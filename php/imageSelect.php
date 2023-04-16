<?php
// Connect to MySQL database
// $conn = mysqli_connect("localhost", "username", "password", "neuroevolutionsimulation");

// // Retrieve image details from database
// $result = mysqli_query($conn, "SELECT * FROM trackimage2");

// // Loop through image details to create image elements
// while ($row = mysqli_fetch_assoc($result)) {
// 	echo '<div class="image">';
// 	echo '<img src="' . $row['file_path'] . '" alt="' . $row['name'] . '">';
// 	echo '</div>';
// }

// // Close database connection
// mysqli_close($conn);






// Connect to MySQL database
$conn = mysqli_connect("localhost", "username", "password", "mydatabase");

// Retrieve image details from database
$result = mysqli_query($conn, "SELECT * FROM images");

// Store image details in an array
$images = array();
while ($row = mysqli_fetch_assoc($result)) {
    $images[] = $row;
}

// Close database connection
mysqli_close($conn);


?>