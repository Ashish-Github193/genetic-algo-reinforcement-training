<?php
include 'main.php';

session_start();

function deleteRow($table, $column, $value)
{
    $conn = mysqli_connect("localhost", "root", "", "neuroevolutionsimulation");

    // Check connection
    if (!$conn) {
        die("couldn't connect to thy mysql server.");
    }

    // SQL query to delete a row from a table
    $sql = "DELETE FROM $table WHERE $column = '$value'";


    mysqli_query($conn, $sql);
    // Execute the query
    if (mysqli_query($conn, $sql)) {
        echo 'row deleted';
    } else {
        echo "Error deleting row: " . mysqli_error($conn);
    }

    // Close the connection
    mysqli_close($conn);
}

function selectRow($table, $column, $value)
{

    echo 'started selecting';
    $conn = mysqli_connect("localhost", "root", "", "neuroevolutionsimulation");
    if (!$conn) {
        die("couldn't connect to thy mysql server.");
    }
    $result = mysqli_query($conn, "SELECT serial, data, date, p_boundry_color, X(start_pos) as spx, Y(start_pos) as spy, X(start_vector) as svx, Y(start_vector) as svy FROM trackimage WHERE $column = $value");
    if (!$result) {
        echo "error: " . mysqli_error($conn);
    } else {

        $row = mysqli_fetch_assoc($result); // ooe assoc wala function ek baar chalne ko hi bna hai bar bar call karna pe shayad alag alag vlaue deta hai

        $_SESSION['track-image'] = 'data:image/jpeg;base64,' . base64_encode($row['data']);
        $_SESSION['spx'] = $row["spx"];
        $_SESSION['spy'] = $row["spy"];
        $_SESSION['svx'] = $row["svx"];
        $_SESSION['svy'] = $row["svy"];
        $_SESSION['track-id'] = $row["serial"];
        $_SESSION['track-date-created'] = $row["date"];
        $_SESSION['boundry-color'] = $row["p_boundry_color"];

        $_SESSION['name'] = 'ashish';



        // logSGdata();

        // echo $_SESSION['spx'].$_SESSION['spx'].$_SESSION['spx'].$_SESSION['spx'].$_SESSION['spx'] ;



        // print_r($array);


        // if (mysqli_num_rows($result) > 0) {



        //     while ($row = mysqli_fetch_assoc($result)) {
        //         $image = $row['data'];

        //         $spX = $row["spx"];
        //         $spY = $row["spy"];
        //         $svX = $row["svx"];
        //         $svY = $row["svy"];

        //         echo $spX . $spY . $svX . $svY;
        //     }
        // }
    }
}





$column = 'serial';
$table = 'trackimage';

$request = file_get_contents('php://input');

$data = json_decode($request);

$id = $data->id;
$action = $data->action;



// if (session_status() === PHP_SESSION_ACTIVE) {
//     // Session is still open
//     echo "Session is still open.";
// } else {
//     // Session is closed
//     echo "Session is closed.";
// }



if ($action == 'delete') {
    // echo $id . " to be deleted   ";
    deleteRow($table, $column, $id);
}

if ($action == 'select') {
    // echo $id . " to be selected    ";
    selectRow($table, $column, $id);
    echo $_SESSION['spx'];
}


?>