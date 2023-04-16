<?php

function getPrimaryModelData() {
    $conn = mysqli_connect('localhost', 'root', '', 'neuroevolutionsimulation');
    if (!$conn) {
        echo 'couldnt connect to db';
        echo mysqli_error($conn);
    }
    $result = mysqli_query($conn, "SELECT * FROM modeldata'");
    // $resultArray = array();
    $row = mysqli_fetch_assoc($result)['model_name'];
    echo $row['serial'];
    // while ($row = mysqli_fetch_assoc($result)) {
        // echo $row['serial'];
        // $rowArray = array($row['serial'], $row['model_name'], $row['layers'], $row['fitness'], $row['generation']);
        // array_push($resultArray, $rowArray);
    // }

    // return json_encode($resultArray);
}

$request = file_get_contents('php://input');

$data = json_decode($request);

$action = $data -> action;

// echo 'request was: '. $action;


if ($action == 'get-all-models') {
    getPrimaryModelData();
    // echo 'finally';
}


?>