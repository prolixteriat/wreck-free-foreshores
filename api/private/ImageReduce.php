<?php declare(strict_types=1);

# ------------------------------------------------------------------------------
 # SELECT *, ROUND(OCTET_LENGTH(photo)/1000.0) AS size_kb FROM wrecksdb.photos;

class ImageReduce {
    # Properties
    private int $max_dimension;     # height or width (px)
    private int $quality;           # percent
    private int $new_height;        # (px)
    private int $new_width;         # (px)
    private string $tmp_file;

    # --------------------------------------------------------------------------
    # Methods
    # --------------------------------------------------------------------------
    # Constructor

    function __construct(int $max_dimension = 800, int $quality = 50) {
        $this->max_dimension = $max_dimension;
        $this->quality = $quality;
        $this->new_height = 0;
        $this->new_width = 0;
    }
    # --------------------------------------------------------------------------
    function get_new_height(): int {
        return $this->new_height;
    } 
    # --------------------------------------------------------------------------
    function get_new_width(): int {
        return $this->new_width;
    } 
    # --------------------------------------------------------------------------

    function delete_tmp_file(): void {
        unlink($this->tmp_file);
    }
    # --------------------------------------------------------------------------

    private function get_tmp_filename(): void {
        while (true) {
            $this->tmp_file = sys_get_temp_dir() . DIRECTORY_SEPARATOR . uniqid('wf_') . '.jpg';
            if (!file_exists($this->tmp_file)) break;
        }
    }
    #---------------------------------------------------------------------------
   
    public function reduce(string $uploaded_file): string {
        $this->get_tmp_filename();
        $source_image = imagecreatefromjpeg($uploaded_file);
        if (!$source_image) {
            throw new Exception ("Error loading image: $uploaded_file");
        }

        list($orig_width, $orig_height) = getimagesize($uploaded_file);
        $this->scale($orig_width, $orig_height);
        $resized_image = imagecreatetruecolor($this->new_width, $this->new_height);
        imagecopyresampled($resized_image, $source_image, 0, 0, 0, 0, 
            $this->new_width, $this->new_height, $orig_width, $orig_height);
        imagejpeg($resized_image, $this->tmp_file, $this->quality);
        imagedestroy($source_image);
        imagedestroy($resized_image);
        return $this->tmp_file;
    }
    # --------------------------------------------------------------------------

    private function scale(int $orig_width, int $orig_height): void {
        $largest = max($orig_width, $orig_height);
        $scale_fact = $largest > $this->max_dimension ? $this->max_dimension / $largest : 1;     
        $this->new_width = intval($orig_width * $scale_fact);
        $this->new_height = intval($orig_height * $scale_fact);
    }
    # --------------------------------------------------------------------------
}
# ------------------------------------------------------------------------------

/*
End
*/

