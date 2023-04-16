<?php
$action = $_POST['action'];

if ($action === 'get-track-data') {
    $trackData = array('I am awesome', 'I am super awesome');

    header('Content-Type: application/json');
    echo json_encode($trackData);
} else {
    header('Content-Type: application/json');
    echo json_encode('error occured');
}
?>