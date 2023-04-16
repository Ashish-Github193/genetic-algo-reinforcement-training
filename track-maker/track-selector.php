<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/x-icon" href="assets/icon.png">
    <link rel="stylesheet" href="../css/track_selector.css">
    <title>Select Track</title>
    <script src="https://code.jquery.com/jquery-3.6.3.js"
        integrity="sha256-nQLuAZGRRcILA+6dMBOvcRh5Pe310sBpanc6+QBmyVM=" crossorigin="anonymous"></script>
    <script src="../scripts/track-selector-script.js"></script>

</head>

<body>

    <?php
    session_start();
    ?>

    <nav class="nav">
        <a href="track-drawer.php">Drawer</a>
        <a href="track-selector.php" class="active">Selector</a>
    </nav>

    <section class="main">

        <?php
        // Connect to MySQL database
        $conn = mysqli_connect("localhost", "root", "", "neuroevolutionsimulation");

        // Retrieve image details from database
        $result = mysqli_query($conn, "SELECT serial, data, date, X(start_pos) as spx, Y(start_pos) as spy, X(start_vector) as svx, Y(start_vector) as svy FROM trackimage");
        // $result = mysqli_query($conn, "SELECT serial, data, date_of_creation, X(start_pos) as spx, Y(start_pos) as spy, X(start_vector) as svx, Y(start_vector) as svy FROM trackimage");
        
        // $result = mysqli_query($conn, "SELECT serial, data, date_of_creation FROM trackimage");
        
        // // Store image details in an array
        // $images = array();
        
        if (!$result) {
            echo "error: " . mysqli_error($conn);
        } else {

            if (mysqli_num_rows($result) > 0) {



                while ($row = mysqli_fetch_assoc($result)) {
                    $image = $row['data'];

                    $spX = $row["spx"];
                    $spY = $row["spy"];
                    $svX = $row["svx"];
                    $svY = $row["svy"];

                    // echo $spX . ' ' . $spY . ' ' . $svX . ' ' . $svY;
        
                    echo '<div class="gallery-item" id="g-i-' . $row['serial'] . '">
                <div class="date-created">created: ' . $row['date'] . '</div>
                <div class="track-image-wrapper">
                    <img src=' . 'data:image/jpeg;base64,' . base64_encode($image) . ' alt="">
                    <div class="start-data" id="start_position_data">
                    <span class="start-point">
                            x: <span class="spx">' . $spX . '</span>
                            y: <span class="spy">' . $spY . '</span> <br>
                        <span class="start-vector">
                            x: <span class="svx">' . $svX . '</span>
                            y: <span class="svy">' . $svY . '</span>
                        </span>
                </div>
                </div>
                <div class="image-details">
                    <span>id: track_' . $row['serial'] . '</span>
                    <span class="options">
                        <button class="use-btn btn" name="use-btn" value="90" id="u-b-' . $row['serial'] . '">use</button>
                        <button class="del-btn btn" name="del-btn" value="90" id="d-b-' . $row['serial'] . '">delete</button>
                    </span>
                </div>
            </div>';
                }
            } else {
                echo 'no data found';
            }
        }

        ?>

        <div class="gallery-item">
            <div class="date-created">created: yyyy-mm-dd</div>
            <div class="track-image-wrapper">
                <img src='../assets/track.png' alt="">
                <div class="start-data" id="start_position_data">
                    <span class="start-point">
                        x: <span class="spx"> 00 </span>
                        y: <span class="spy"> 00 </span> <br>
                        <span class="start-vector">
                            x: <span class="svx"> 00 </span>
                            y: <span class="svy"> 00 </span>
                        </span>
                </div>
            </div>
            <div class="image-details">
                <span>id:01</span>
                <form method="post" class="options" action="../php/deleteRow.php">
                    <!-- <button type="submit" name="use-btn" value="90" class="use-btn btn">use</button> -->
                    <!-- <button type="submit" name="delbtn" value="90" class='del-btn btn'>delete</button> -->
                </form>
            </div>
        </div>

    </section>
        <?php
        if (session_status() === PHP_SESSION_ACTIVE) {
            // Session is still open
            echo "Session is still open. "."and was open from ".$_SESSION['start-time'];
        } else {
            // Session is closed
            echo "Session is closed.";
        }
        ?>


</body>

<script>

    $('.use-btn').click(function (e) {
        e.preventDefault();
        id = $(this).attr('id').slice(-4).split('-').at(-1);
        console.log($(this).attr('id'), id);
        var settings = { id: id, action: 'select' };
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '../php/trackManage.php', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            console.log(xhr.responseText);
            window.location.href = "../index.php";
        };
        xhr.send(JSON.stringify(settings));

    });

    $('.del-btn').click(function (e) {
        e.preventDefault();
        id = $(this).attr('id').slice(-4).split('-').at(-1);
        $('#g-i-' + id).css('display', 'none');
        var settings = { id: id, action: 'delete' };
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '../php/trackManage.php', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            console.log(xhr.responseText);
        };
        xhr.send(JSON.stringify(settings));
    });


</script>

</html>