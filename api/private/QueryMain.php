<?php declare(strict_types=1);

# ------------------------------------------------------------------------------

require_once 'QueryCore.php';

# ------------------------------------------------------------------------------

class QueryMain extends QueryCore {

    # --------------------------------------------------------------------------
    # Methods
    # --------------------------------------------------------------------------
    # 
    public function add_wreck(array $params, array $token_payload): Status {

        $required_params = ['sub', 'user_id'];
        if (!validate_params($token_payload, $required_params)) {
            return new Status(false, 400, 'Incorrectly formatted authorisation token');
        }
        $required_params = ['location', 'latitude', 'longitude', 'length', 
            'sort', 'hull', 'engine', 'position', 'floating', 
            'vessel_condition'];
        $status = validate_params($params, $required_params) ? 
            $this->db->add_wreck($params, $token_payload) :
             new Status(false, 400, 
                'Incorrectly formatted query. Must supply all required parameters.');
        
        return $status;
    }     
    # --------------------------------------------------------------------------
    # 
    public function get_photo(array $args): Status {
   
        $required_params = ['id'];
        $status = validate_params($args, $required_params) ?
            $this->db->get_photo((int)$args['id']) :
            new Status(false, 400, 'Incorrectly formatted query. Must supply photo ID.');

        return $status;
    }
    # --------------------------------------------------------------------------
    # 
    public function get_photo_info(array $args): Status {
   
        $required_params = ['id'];
        $status = validate_params($args, $required_params) ?
            $this->db->get_photo_info((int)$args['id']) :
            new Status(false, 400, 'Incorrectly formatted query. Must supply photo ID.');

        return $status;
    }
    # --------------------------------------------------------------------------
    # 
    public function get_wrecks(): Status {

        return $this->db->get_wrecks();
    }   
    # --------------------------------------------------------------------------

}

# ------------------------------------------------------------------------------

/*
End
*/
