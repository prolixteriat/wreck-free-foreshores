-- Populate database with sample data

SET @TEST_PASSWORD = '';   -- password used for test accounts: needs to match that in PHPUnit tests
SET @FILE_PATH = '';       -- path to photos directory

USE WrecksDB;

-- Delete any existing data
SET FOREIGN_KEY_CHECKS = 0; 
TRUNCATE TABLE `photos`;
TRUNCATE TABLE `environmental`;
TRUNCATE TABLE `safety`;
TRUNCATE TABLE `wrecks`;
TRUNCATE TABLE `password_reset`;
TRUNCATE TABLE `audit`;
TRUNCATE TABLE `users`;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO `users` (`username`, `email`, `password`, `role`, `verified`, `terms_accepted`, `disabled`) VALUES
('test_admin', 'admin@example.co.uk', SHA2(@TEST_PASSWORD, 256), 'admin', TRUE, TRUE, FALSE),
('test_user', 'user@example.co.uk', SHA2(@TEST_PASSWORD, 256), 'user', TRUE, TRUE, FALSE),
('test_unverified', 'unverified@example.co.uk', SHA2(@TEST_PASSWORD, 256), 'user', FALSE, FALSE, FALSE),
('test_disabled', 'disabled@example.co.uk', SHA2(@TEST_PASSWORD, 256), 'user', TRUE, FALSE, TRUE);

INSERT INTO `wrecks` (`location`, `w3w`, `latitude`, `longitude`, `name`, `make`, `length`, `sort`, `hull`, `engine`, `position`, `floating`, `vessel_condition`, `additional`, `reporter_id`, `status`) VALUES
('Trabas Beach', 'settled.crucially.cheese', 50.095771, -5.12973, 'Bain de Soleil', 'Chaparral', 3.5, 'Yacht - fin keel', 'Fibreglass/GRP', 'Inboard engine', 'Foreshore - below high water springs mark', 'Yes', 'Total wreck - will need to be dismantled in place', null, 1, 'Reported'),
('Port Navas Creek', 'firelight.heartened.scanner',50.094505,-5.133262, 'Beau Solei', 'Cruisers Yachts', 3.0, 'Motor yacht', 'Aluminium', 'No engine', 'On dry land', 'No', 'It could probably float with bouyancy bags and be towed away', null, 2, 'Assigned'),
('Polpenwith Creek', 'prefect.chatters.splice',50.093723,-5.132043, 'Carpe Diem', 'Bayliner', 4.5, 'Fishing boat', 'Fibreglass/GRP', 'Outboard engine', 'Foreshore - above high water springs mark', 'Yes', 'It could probably float and be towed away', null, 1, 'In progress'),
('Padgagarrack Cove', 'weddings.unfit.shark',50.096822,-5.141713, 'Ciao Bella', 'Yamaha', 4.1, 'Canoe or small personal watercraft', 'Steel', 'Inboard engine', 'Foreshore - below high water springs mark', 'Yes', 'Total wreck - will need to be dismantled in place', null, 2, 'Cleared'),
('Ponsence Cove', 'feels.amending.engrossed',50.099275,-5.132085, 'Del Mar', 'Alumacraft', 3.0, 'Yacht - fin keel', 'Aluminium', 'No engine', 'Foreshore - below high water springs mark', 'No', 'Total wreck - will need to be dismantled in place', 'Nesting birds', 1, 'Reported'),
('Bosahan Cove', 'punters.proudest.waking',50.101835,-5.140452, 'Dolce Far Niente', 'Azimut', 2.8, 'Yacht - long keel', 'Fibreglass/GRP', 'Inboard engine', 'Foreshore - above high water springs mark', 'Yes', 'It could probably float and be towed away', null, 2, 'Reported'),
('Grebe Beach', 'deflation.riddle.slightly',50.097658,-5.152308, 'Dreamboat', 'Beneteau', 4.1, 'Canoe or small personal watercraft', 'Fibreglass/GRP', 'Outboard engine', 'Foreshore - below high water springs mark', 'Yes', 'Could be removed by land', null, 1, 'Reported'),
('Trebah Beach', 'observers.spearhead.shutting',50.093561,-5.153486, 'La Dolce Vita', 'Four Winns', 3.7, 'Yacht - fin keel', 'Fibreglass/GRP', 'No engine', 'Foreshore - above high water springs mark', 'Yes', 'Total wreck - will need to be dismantled in place', 'Attacked by shark', 2, 'Assigned'),
('Porth Saxon Beach', 'appealed.reforming.wades',50.09534,-5.162399, 'Namaste', 'Monterey', 3.9, 'Yacht - fin keel', 'Wood', 'No engine', 'On dry land', 'Maybe', 'Could be removed by land', null, 1, 'reported'),
('Gillan Creek', 'fuzz.absorb.garden',50.092025,-5.160549, 'Mariposa', 'Bowriders', 2.9, 'Sailing dingy, tender, punt, small outboard boat', 'Plastic', 'No engine', 'Foreshore - below high water springs mark', 'Maybe', 'It could probably float and be towed away', 'Mysterious cargo', 1, 'In progress');

INSERT INTO `environmental`(`wreck_id`, `hazard`) VALUES
(1, 'Fuel tanks'),
(1, 'Oil in engine'),
(1, 'Degrading plastics'),
(2, 'Fuel tanks'),
(2, 'Containers of paint or chemicals'),
(3, 'Containers of paint or chemicals'),
(3, 'Netting or things wildlife could get caught in'),
(3, 'Degrading plastics'),
(4, 'Containers of paint or chemicals'),
(5, 'Netting or things wildlife could get caught in'),
(6, 'Fuel tanks'),
(8, 'Oil in engine'),
(8, 'Degrading plastics'),
(9, 'Oil in engine'),
(10, 'Netting or things wildlife could get caught in');

INSERT INTO `safety`(`wreck_id`, `hazard`) VALUES
(1, 'Boat unstable and could fall over'),
(1, 'Boat not properly secured'),
(1, 'Boat in poor condition and would be a risk to people boarding it'),
(2, 'Boat unstable and could fall over'),
(3, 'Boat not properly secured'),
(4, 'Boat in poor condition and would be a risk to people boarding it'),
(5, 'Boat unstable and could fall over'),
(6, 'Boat in poor condition and would be a risk to people boarding it'),
(8, 'Boat not properly secured'),
(8, 'Boat in poor condition and would be a risk to people boarding it'),
(10, 'Boat unstable and could fall over');

INSERT INTO `photos`(`wreck_id`, `photo`, `width`, `height`) VALUES
(1, LOAD_FILE(CONCAT(@FILE_PATH, 'boat_01.jpg')), 289, 216),
(1, LOAD_FILE(CONCAT(@FILE_PATH, 'boat_02.jpg')), 288, 216),
(2, LOAD_FILE(CONCAT(@FILE_PATH, 'boat_03.jpg')), 288, 216),
(2, LOAD_FILE(CONCAT(@FILE_PATH, 'boat_04.jpg')), 305, 204),
(2, LOAD_FILE(CONCAT(@FILE_PATH, 'boat_05.jpg')), 736, 736),
(3, LOAD_FILE(CONCAT(@FILE_PATH, 'boat_06.jpg')), 305, 204),
(4, LOAD_FILE(CONCAT(@FILE_PATH, 'boat_07.jpg')), 325, 192),
(5, LOAD_FILE(CONCAT(@FILE_PATH, 'boat_08.jpg')), 288, 216),
(6, LOAD_FILE(CONCAT(@FILE_PATH, 'boat_09.jpg')), 305, 204),
(7, LOAD_FILE(CONCAT(@FILE_PATH, 'boat_10.jpg')), 288, 216),
(7, LOAD_FILE(CONCAT(@FILE_PATH, 'boat_11.jpg')), 306, 204),
(8, LOAD_FILE(CONCAT(@FILE_PATH, 'boat_12.jpg')), 288, 216),
(9, LOAD_FILE(CONCAT(@FILE_PATH, 'boat_13.jpg')), 307, 203),
(10, LOAD_FILE(CONCAT(@FILE_PATH, 'boat_14.jpg')), 288, 203),
(10, LOAD_FILE(CONCAT(@FILE_PATH, 'boat_15.jpg')), 333, 187);
