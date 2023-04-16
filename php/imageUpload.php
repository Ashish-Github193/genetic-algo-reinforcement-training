<?php

  session_start();
  $_SESSION['start'] = 'hello world';
  $_SESSION['start-time'] = time();

// if ($_SERVER['REQUEST_METHOD'] == 'POST') {
//     $email = $_POST['email'];
//     $password = $_POST['password'];

//     echo '<div class="alert alert-warning" role="alert">
//     your email is' .  $email . 'and password is' . $password . 'Give it a click if you like.
//   </div>';
// }

// echo '<div class="alert"> hello </div>';

echo '>>>>    -----   PHP STARTED  ----  <br>';

$connection = mysqli_connect('localhost', 'root', '', 'neuroevolutionsimulation');
// $connection = mysqli_connect('localhost', 'root', '', 'phptutorial');

if ($connection) {
  echo '>>>>  connected to the server <br><br>';
} else {
  echo '>>>>  connected to the server <br><br>';
}


// to create a new database
// $sql = "CREATE DATABASE myDB";
// if ($connection->query($sql) === TRUE) {
//   echo "Database created successfully <br><br>";
// } else {
//   echo "Error creating database, reason:  " . $connection->error . " <br><br>";
// }


// reading data from sql table;
// $sql = "SELECT serial, email, password FROM userdata2";
// $result = $connection->query($sql);


// if ($result-> num_rows > 0) {
//   // output data of each row
//   while ($row = $result->fetch_assoc()) {
//     // echo "id: " . $row["serial"] . " email : " . $row["email"] . " - data: " . $row["password"] . "<br>";
//     // echo print_r($row);
//     echo "serial: " . $row["serial"] . " - email: " . $row["email"] . " - password: " . $row["password"] . "<br>";
//     // echo "serial: " . $row["serial"] . "<br>";
//   }

//   // echo print_r($result);

// } else {
//   echo "0 results";
// }







if ($_SERVER['REQUEST_METHOD'] == 'POST') {

  $data = json_decode(file_get_contents('php://input'));

  $startPosX = explode(',', $data->startPos)[0];
  $startPosY = explode(',', $data->startPos)[1];

  $initialVectorX = explode(',', $data->initialVector)[0];
  $initialVectorY = explode(',', $data->initialVector)[1];

  $boundryColor = $data->boundryColor;

  echo $startPosX . $startPosY . ' ' . $initialVectorX . ' ' . $initialVectorX . ' ' . gettype($boundryColor) . '<br>';

  $imageData = $data->imageData;
  // Strip the data URI scheme and decode the Base64-encoded data
  $imageData = str_replace('data:image/png;base64,', '', $imageData);
  $imageData = str_replace(' ', '+', $imageData);
  $imageData = base64_decode($imageData);

  // Save the image data to a file
  file_put_contents('../assets/new_track_made_by_php.png', $imageData);

  $sql = "INSERT INTO `trackimage` (`serial`, `data`, `start_pos`, `start_vector`, `p_boundry_color`) VALUES (NULL, (?), POINT($startPosX, $startPosY), POINT($initialVectorX, $initialVectorY), '$boundryColor')";
  $stmt = mysqli_prepare($connection, $sql);

  if (!$stmt) {
    die("Error preparing statement: " . mysqli_error($connection));
  } else {
    echo ">> image saved successfully <br><br><br>";
    echo 'sesison started on: ' .  date('Y-m-d H:i:s', $_SESSION['start-time']);
  }

  // Bind the image data to the parameter
  mysqli_stmt_bind_param($stmt, "s", $imageData);

  // Execute the SQL statement
  mysqli_stmt_execute($stmt);

  // Close the statement and connection
  mysqli_stmt_close($stmt);
  mysqli_close($connection);

}
?>