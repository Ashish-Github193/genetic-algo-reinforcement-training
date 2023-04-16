<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
	<style>
		#roadImage {
			width: 50vh;
		}
	</style>
</head>
<body>
<?php
    session_start();

    
		$imageUrl = $_SESSION['track-image']; // Encode the query parameter
		echo '<img class="roadImage" id="roadImage" src="' . $imageUrl . '" alt="" ">';

	
    
    ?>
</body>
</html>