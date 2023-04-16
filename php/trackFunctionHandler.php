<?php 

$conn = mysqli_connect('localhose', 'root', '', 'neuroevolutionsimulation');

if (!$conn) {
    echo "couldn't connect to the server.";
}

// checking for action parameter and set proper function:
if (isset($_REQUEST['action'])) {
    $action = $_REQUEST['action'];
    switch ($action) {
        case 'update':
            updateDatabase();
            break;
        case 'create':
            createDatabase();
            break;
        case 'read':
            readDatabase();
            break;
        case 'delete':
            deleteDatabase();
            break;
    }

}

function updateDatabase() {

}
function createDatabase() {

}
function readDatabase() {

}
function deleteDatabase() {

}
    

?>