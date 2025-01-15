<?php declare(strict_types=1);

# ------------------------------------------------------------------------------

require_once 'DbCore.php';
require_once 'ImageReduce.php';
require_once 'utils.php';

# ------------------------------------------------------------------------------

class DbMain extends DbCore {

    # --------------------------------------------------------------------------
    # Methods
    # --------------------------------------------------------------------------
    #
    private function add_hazards(string $table, int $wreck_id, array|null $hazards): bool {
        
        if (!$hazards) { return true; }
        $rv = true;
        try {
            $query = "INSERT INTO $table (wreck_id, hazard) VALUES (?, ?)";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param('is', $wreck_id, $hazard);
            foreach ($hazards as $hazard) {
                if (!$stmt->execute()) {
                    $rv = false;
                };
            }
            $stmt->close();
        } catch (Exception $e) {
            if (isset($stmt)) { $stmt->close(); }            
            $this->logger->error('add_hazard: ' . $e->getMessage());
            throw new Exception("Error occurred adding hazard: $table");
        }
        return $rv;
    }
    # --------------------------------------------------------------------------
    #
    private function add_photos(int $wreck_id): bool {
        
        $num_files = sizeof($_FILES['files']['name'] ?? []);
        if ($num_files === 0) { return true; }
        $rv = true;
        try {
            $reducer = new ImageReduce();
            $query = 'INSERT INTO photos (wreck_id, photo, width, height) VALUES (?, ?, ?, ?)';
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param('isii', $wreck_id, $file, $width, $height);
            foreach ($_FILES['files']['name'] as $key => $filename) {
                $tmp_name = $_FILES['files']['tmp_name'][$key];
                $tmp_reduced = $reducer->reduce($tmp_name);
                $file = file_get_contents($tmp_reduced);
                $width = $reducer->get_new_width();
                $height = $reducer->get_new_height();
                if (!$stmt->execute()) {
                    $rv = false;
                };
                $reducer->delete_tmp_file();
            }
            $stmt->close();
        } catch (Exception $e) {
            if (isset($stmt)) { $stmt->close(); }            
            $this->logger->error('add_photos: ' . $e->getMessage());
            throw new Exception('Error occurred adding photo: ' . $e->getMessage());
        }
        return $rv;
    }    
    # --------------------------------------------------------------------------
    #
    function add_wreck(array $params, array $token_payload): Status {

        try {
            $username = $token_payload['sub'];
            $user_id = $token_payload['user_id'];
            if ($this->username_disabled($username)) {
               return new Status(false, 403, 'Account is disabled'); 
            }
            $location = clean_param($params, 'location');
            $w3w = clean_param($params, 'w3w');
            $latitude = clean_param($params, 'latitude');
            $longitude = clean_param($params, 'longitude');
            $name = clean_param($params, 'name');
            $make = clean_param($params, 'make');
            $length = clean_param($params, 'length');
            $sort = clean_param($params, 'sort');
            $hull = clean_param($params, 'hull');
            $engine = clean_param($params, 'engine');
            $position = clean_param($params, 'position');
            $floating = clean_param($params, 'floating');
            $vessel_condition = clean_param($params, 'vessel_condition');
            $additional = clean_param($params, 'additional');
            $environmental = clean_param_array($params, 'environmental');
            $safety = clean_param_array($params, 'safety');
            $query = 'INSERT INTO wrecks (location, w3w, latitude, longitude, name, make, length, sort, hull, engine, position, floating, vessel_condition, additional, reporter_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param('ssssssssssssssi', $location, $w3w, $latitude, $longitude, $name, $make, $length, $sort, $hull, $engine, $position, $floating, $vessel_condition, $additional, $user_id);
            if ($stmt->execute()) {
                $wreck_id = $stmt->insert_id;
                $this->add_hazards('environmental', $wreck_id, $environmental);
                $this->add_hazards('safety', $wreck_id, $safety);
                $this->add_photos($wreck_id);
                $status = new Status(true, 200, 'Wreck successfully added');
                $this->add_audit('add_wreck', "Wreck ID $wreck_id added by username: $username");
            } else {
                $status = new Status(false, 500, 'Failed to add wreck');
            }
        } catch (Exception $e) {
            $this->logger->error('add_user: ' . $e->getMessage());
            $status = new Status(false, 500, 'Error occurred (add_wreck)');
        } finally {
            if (isset($stmt)) { $stmt->close(); }            
        }
        return $status;
    }
    # ----------------------------------------------------------------------
    # 
    public function get_photo(int $photo_id): Status {

        $row = $this->get_row('SELECT photo FROM photos WHERE photo_id=?', strval($photo_id));
        if ($row) {
            $status = new Status(true, 200, 'Successfully retrieved photo');
            $status->data = $row['photo'];
        } else {
            $status = new Status(false, 404, 'Photo not found');
        }
        return $status;
    }     
    # ----------------------------------------------------------------------
    # 
    public function get_photo_info(int $photo_id): Status {

        $row = $this->get_row('SELECT width, height FROM photos WHERE photo_id=?', strval($photo_id));
        if ($row) {
            $status = new Status(true, 200, $row);
        } else {
            $status = new Status(false, 404, 'Photo not found');
        }
        return $status;
    }     
    # ----------------------------------------------------------------------
    # 
    private function get_photo_IDs(int $wreck_id): array {

        $results = array();
        try {        
            $query = 'SELECT * FROM photos WHERE wreck_id=?';
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param('i', $wreck_id);
            $stmt->execute();
            $result = $stmt->get_result();               
            while($row = $result->fetch_assoc()) {
                $results[] = $row['photo_id'];
            }
        } catch (Exception $e) {
            $this->logger->error('get_photo_IDs: ' . $e->getMessage());
        } finally {
            if (isset($stmt)) { $stmt->close(); }            
        }        
        return $results;        
    }
    # ----------------------------------------------------------------------
    # 
    private function get_hazard(string $table, int $wreck_id): array {

        $results = array();
        try {
            $query = "SELECT * FROM $table WHERE wreck_id=?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param('i', $wreck_id);
            $stmt->execute();
            $result = $stmt->get_result();               
            $status = array();
            while($row = $result->fetch_assoc()) {
                $results[] = $row['hazard'];
            }
        } catch (Exception $e) {
            $this->logger->error('get_hazard: ' . $e->getMessage());
        } finally {
            if (isset($stmt)) { $stmt->close(); }            
        }                 
        return $results;        
    }    
    # ----------------------------------------------------------------------
    # 
    public function get_wrecks(bool $include_hidden=false): Status {

        try {
            $query = $include_hidden ?
                'SELECT * FROM wrecks' :
                'SELECT * FROM wrecks WHERE hidden=0';
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $result = $stmt->get_result();               
            $wrecks = array();
            while($row = $result->fetch_assoc()) {
                $wreck_id = $row['wreck_id'];
                $reporter_name = $this->get_username($row['reporter_id']);
                $owner_name = $this->get_username($row['owner_id']);
                $environmental = $this->get_hazard('environmental', $wreck_id);
                $safety = $this->get_hazard('safety', $wreck_id);
                $photos = $this->get_photo_IDs($wreck_id);
                $wrecks[] = $row + array(
                                    'reporter_name' => $reporter_name,
                                    'owner_name' => $owner_name,
                                    'environmental' => $environmental, 
                                    'safety' => $safety,
                                    'photos' => $photos);
            }
            $status = new Status(true, 200, $wrecks);
        } catch (Exception $e) {
            $this->logger->error('get_wrecks: ' . $e->getMessage());
            $status = new Status(false, 500, 'Error occurred (get_wrecks)');
        } finally {
            if (isset($stmt)) { $stmt->close(); }            
        }
        return $status;      
    }
    # ----------------------------------------------------------------------
    # 
    public function set_wreck_visibility(array $params, array $token_payload): Status {

        try {        
            $username = $token_payload['sub'];
            if ($this->username_disabled($username)) {
               return new Status(false, 403, 'Account is disabled'); 
            }
            $hidden = clean_param($params, 'hidden');
            $wreck_id = clean_param($params, 'id');
            $query = 'UPDATE wrecks SET hidden=? WHERE wreck_id=?';
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param('ii', $hidden, $wreck_id);
            if ($stmt->execute() && $stmt->affected_rows > 0) {
                $status = new Status(true, 200, 'Wreck visibility updated');
                $this->add_audit('set_wreck_visibility', "Wreck ID $wreck_id visibility set to $hidden by username: $username");
            } else {
                $status = new Status(false, 500, 'Failed to update wreck visibility: ' . $stmt->error);
            }
        } catch (Exception $e) {
            $this->logger->error('set_wreck_visibility: ' . $e->getMessage());
            $status = new Status(false, 500, 'Error occurred (set_wreck_visibility)');
        } finally {
            if (isset($stmt)) { $stmt->close(); }            
        }        
        return $status;        
    }
    # --------------------------------------------------------------------------

}
# ------------------------------------------------------------------------------

/*
End
*/
