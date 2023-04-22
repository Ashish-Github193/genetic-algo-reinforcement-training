<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neural-Network-Reinforcement</title>
    <link rel="stylesheet" href="css/Neural_style.css">

    <script src="https://code.jquery.com/jquery-3.6.3.js"
        integrity="sha256-nQLuAZGRRcILA+6dMBOvcRh5Pe310sBpanc6+QBmyVM=" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"
        integrity="sha512-5A8nwdMOWrSz20fDsjczgUidUBR8liPYU+WymTZP1lmY9G6Oc7HlZv156XqnsgNUzTyMefFTcsFH/tnJE/+xBg=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />

</head>

<body>

    <?php
    include 'php/main.php';
    session_start();
    $_SESSION['start-time'] = time();

    if (!$_SESSION['track-image']) {
        $_SESSION['track-image'] = '';
        $_SESSION['spx'] = 'nothing';
        $_SESSION['spy'] = 'nothing';
        $_SESSION['svx'] = 'nothing';
        $_SESSION['svy'] = 'nothing';
        $_SESSION['track-id'] = 'nothing';
        $_SESSION['boundry-color'] = 'nothing';
        $_SESSION['track-date-created'] = 'nothing';
    }
    // $_SESSION['track-image'] = '';
    
    if (!$_SESSION['model-id']) {
        $_SESSION['model-name'] = '';
        $_SESSION['model-one-weights'] = '';
        $_SESSION['model-two-weights'] = '';
        $_SESSION['model-shape'] = '';
        $_SESSION['model-activations'] = '';
        $_SESSION['model-fitness'] = '';
        $_SESSION['model-generation'] = '';
        $_SESSION['model-save-type'] = ''; // temp / perm
    }

    // if (!$_SESSION['name']) {
    //     $_SESSION['name'] = 'avinash';
    // }
    
    ?>
    <canvas id="bg" , width="1920px" , height="1080px"></canvas>

    <div id="alert-box">
        <div id="alert">
            <h4>lorem</h4>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus, temporibus!</p>
            <button>learn more</button>
            <span id="alert-loader"></span>
        </div>
    </div>

    <div id="main">

        <!-- <div id="layerFirst" class="layer">
            <div id="layerFirst_node1" class="node active_node disabled_node"></div>
            <div id="layerFirst_node2" class="node active_node disabled_node"></div>
            <div id="layerFirst_node3" class="node active_node disabled_node"></div>
            <div id="layerFirst_node4" class="node active_node disabled_node"></div>
            <div id="layerFirst_node5" class="node active_node disabled_node"></div>
        </div>

        <div id="layerLast" class="layer">
            <div id="layerLast_node1" class="node active_node disabled_node"></div>
            <div id="layerLast_node2" class="node active_node disabled_node"></div>
            <div id="layerLast_node3" class="node active_node disabled_node"></div>
            <div id="layerLast_node4" class="node active_node disabled_node"></div>
        </div> -->

        <?php

        $neuron_template = '<div id="layerFirst" class="layer" style="border-color: transparent;"><div id="layerFirst_node1" class="node active_node"></div><div id="layerFirst_node2" class="node active_node"></div> <div id="layerFirst_node3" class="node active_node"></div><div id="layerFirst_node4" class="node active_node"></div><div id="layerFirst_node5" class="node active_node"></div></div>';

        $shape = explode(",", $_SESSION['model-shape']);
        $layers = explode(",", $_SESSION['model-activations']);

        for ($i = 0; $i < count($layers); $i++) {
            $neuron_template .= '<div id="layer' . ($i + 1) . '" class="layer ' . $layers[$i] . '" style="border-color: transparent;">';
            for ($j = 0; $j < (int) $shape[$i]; $j++) {
                $neuron_template .= '<div class="node active_node" id="layer' . ($i + 1) . '_node' . ($j + 1) . '"></div>';
            }
            $neuron_template .= '</div>';
        }
        $neuron_template .= '<div id="layerLast" class="layer" style="border-color: transparent;"><div id="layerLast_node1" class="node active_node"></div><div id="layerLast_node2" class="node active_node"></div><div id="layerLast_node3" class="node active_node"></div><div id="layerLast_node4" class="node active_node"></div></div>';
        // echo $shape . "layers" . $layers;
        echo $neuron_template

        ?>



    </div>

    <div id="menu-button">
        <div class="menu-btn-bar"></div>
        <div class="menu-btn-bar"></div>
        <div class="menu-btn-bar"></div>
        <div class="menu-btn-bar"></div>
        <div class="menu-btn-bar"></div>
        <div class="menu-btn-bar"></div>
    </div>
    <div id="menu-window">
        <div id="menu-left">
            <div id="general" class="menu-left-items">General</div>
            <div id="theme" class="menu-left-items">Themes</div>
            <div id="settings" class="menu-left-items">Settings</div>
        </div>
        <div id="menu-right">
            <div id="general-content">

                <!-- heading -->
                <div id="model-list0" class="general-content-model-heading">
                    <div class="ml-info">
                        <div class="ml-primary-info ">
                            <div id="sno0" class="ml-sno content-model-class-text hidden">Sno.</div>
                            <div id="name0" class="ml-name content-model-class-text">Model</div>
                        </div>
                        <div class="ml-secondary-info">
                            <div id="nol0" class="ml-nol  content-model-class-text">n-layers</div>
                            <div id="fitness0" class="ml-fit content-model-class-text">fit</div>
                            <div id="generation0" class="ml-gen  content-model-class-text">gen</div>
                            <div id="input-shape0" class="ml-noc  content-model-class-text">ci</div>
                        </div>
                    </div>
                </div>

                <?php

                $conn = mysqli_connect('localhost', 'root', '', 'neuroevolutionsimulation');

                if (!$conn) {
                    echo 'not connected with db';
                }
                $result = mysqli_query($conn, "SELECT * FROM modeldata");

                if (!$result) {
                    echo "error: " . mysqli_error($conn);
                } else {
                    $id = 1;
                    if (mysqli_num_rows($result) > 0) {

                        while ($row = mysqli_fetch_assoc($result)) {
                            $serial = $row['serial'];
                            $modelName = $row['model_name'];
                            $layers = count(explode(",", $row['layers']));
                            $fitness = $row['fitness'];
                            $generation = $row['generation'];
                            $inputShape = $row['input_shape'];
                            $modelShape = implode("-", explode(",", $row['shape']));
                            // $modelShape = $row['shape'];
                

                            echo '<div id="model-list' . $id . '" class="general-content-model non-editable">
                                <div class="ml-info">
                                    <div class="ml-primary-info">
                                        <div id="sno' . $id . '" class="ml-sno content-model-class-text hidden">m_' . $serial . '</div>
                                        <div id="name' . $id . '" class="ml-name content-model-class-text">' . $modelName . '</div>
                                    </div>
                                    <div class="ml-secondary-info">
                                        <div id="nol' . $id . '" class="ml-nol content-model-class-text">' . $layers . ' layers</div>
                                        <div id="fitness' . $id . '" class="ml-fit content-model-class-text">' . $fitness . '</div>
                                        <div id="generation' . $id . '" class="ml-gen content-model-class-text">' . $generation . '</div>
                                        <div id="input-shape' . $id . '" class="ml-noc content-model-class-text">' . $inputShape . '</div>
                                    </div>
                                </div>
                                <div class="ml-operations">
                                    <div id="load' . $id . '" class="ml-ops" onclick=loadModel(' . $id . ')>load</div>
                                    <div id="delete' . $id . '" class="ml-ops" onclick=deleteModel(' . $id . ')>delete</div>
                                </div>
                            </div>';
                            $id++;
                        }
                    }
                }
                ?>

                <!-- add new  -->
                <div id="create-new-model" class="general-content-new-model"> New Model</div>
            </div>

            <div class="theme-content" id="theme-content">
                <div class="themes-heading">
                    <h1>Select Theme</h1>
                </div>
            </div>
            <div id="settings-content">
                <div class="settings-heading">
                    <h1>Simulation settings</h1>
                </div>
                <div class="option">
                    <span class="option-name">Add custom track</span>
                    <div class="simulation-settings buttons">
                        <div id="sub-7"><i class="fa fa-minus-circle" aria-hidden="true"></i></div>
                        <div id="num-7">0</div>
                        <div id="add-7"><i class="fa fa-plus-circle" aria-hidden="true"></i></div>
                    </div>
                </div>

                <div class="sub-options" id="custom-track-function1">
                    <h4 class="custom-track-name">Draw with tool</h4>

                    <?php

                    if ($_SESSION['track-image']) {

                        echo
                            '<div class="preview-wrapper">
                                <img class="track-preview" id="image-preview1" src= ' . $_SESSION['track-image'] . ' alt="">
                                <div id="preview-details">
                                    <span class="preview-details-item" id="pd-name">track_' . $_SESSION['track-id'] . '</span>
                                    <span class="preview-details-item" id="pd-date">created on: ' . $_SESSION['track-date-created'] . '</span>
                                </div>
                                </div>
                                ';
                    }

                    ?>

                    <a class="links" href="track-maker/track-drawer.php">Go to tool</a>
                    <a class="links" href="track-maker/track-selector.php">select from premade</a>

                </div>

                <?php

                if ($_SESSION['population_size']) {
                    $population = $_SESSION['population_size'];
                    $crr = $_SESSION['crossover_rate'];
                    $mur = $_SESSION['mutation_rate'];
                    $noe = $_SESSION['number_of_elite_networks'];
                    $cl = $_SESSION['camera_length'];
                    $cd = $_SESSION['camera_divergence'];
                    $cn = $_SESSION['camera_number'];
                    $gat = $_SESSION['generation_alive_time'];
                    $ga = $_SESSION['global_activation'];
                } else {
                    $population = 20;
                    $crr = 40;
                    $mur = 10;
                    $noe = 2;
                    $cl = 200;
                    $cd = 120;
                    $cn = 5;
                    $gat = 30;
                    $ga = 'relu';
                }

                echo '<div class="option">
                <span class="option-name">Population size</span>
                <div class="simulation-settings buttons" >
                    <div id="sub-1"><i class="fa fa-minus-circle" aria-hidden="true"></i></div>
                    <div id="num-1">' . $population . '</div>
                    <div id="add-1"><i class="fa fa-plus-circle" aria-hidden="true"></i></div>
                </div>
            </div>
            <div class="option">
                <span class="option-name">Crossove rate (%)</span>
                <div class="simulation-settings buttons" >
                    <div id="sub-2"><i class="fa fa-minus-circle" aria-hidden="true"></i></div>
                    <div id="num-2">' . $crr . '</div>
                    <div id="add-2"><i class="fa fa-plus-circle" aria-hidden="true"></i></div>
                </div>
            </div>
            <div class="option">
                <span class="option-name">Mutation rate (%)</span>
                <div class="simulation-settings buttons" >
                    <div id="sub-3"> <i class="fa fa-minus-circle" aria-hidden="true"></i> </div>
                    <div id="num-3">' . $mur . '</div>
                    <div id="add-3"> <i class="fa fa-plus-circle" aria-hidden="true"></i> </div>
                </div>
            </div>
            <div class="option">
                <span class="option-name">Number of elite networks</span>
                <div class="simulation-settings buttons" >
                    <div id="sub-4"><i class="fa fa-minus-circle" aria-hidden="true"></i></div>
                    <div id="num-4">' . $noe . '</div>
                    <div id="add-4"><i class="fa fa-plus-circle" aria-hidden="true"></i></div>
                </div>
            </div>
            <div class="option" id="camera-length-setting">
                <span class="option-name">Camera Length</span>
                <div class="simulation-settings buttons" >
                    <div id="sub-8"><i class="fa fa-minus-circle" aria-hidden="true"></i></div>
                    <div id="num-8">' . $cl . '</div>
                    <div id="add-8"><i class="fa fa-plus-circle" aria-hidden="true"></i></div>
                </div>
            </div>
            <div class="option" id="camera-divergence-setting">
                <span class="option-name">Camera Divergence</span>
                <div class="simulation-settings buttons" >
                    <div id="sub-9"><i class="fa fa-minus-circle" aria-hidden="true"></i></div>
                    <div id="num-9">' . $cd . '</div>
                    <div id="add-9"><i class="fa fa-plus-circle" aria-hidden="true"></i></div>
                </div>
            </div>
            <div class="option" id="generation-alive-time-seetting">
                <span class="option-name">Generation alive time</span>
                <div class="simulation-settings buttons" >
                    <div id="sub-11"><i class="fa fa-minus-circle" aria-hidden="true"></i></div>
                    <div id="num-11">' . $gat . '</div>
                    <div id="add-11"><i class="fa fa-plus-circle" aria-hidden="true"></i></div>
                </div>
            </div>
            <div class="option" id="global-activation-setting">
                <span class="option-name">Same activation for every layer</span>
                <div class="simulation-settings buttons" >
                    <div id="sub-6"><i class="fa fa-minus-circle" aria-hidden="true"></i></div>
                    <div id="num-6">0</div>
                    <div id="add-6"><i class="fa fa-plus-circle" aria-hidden="true"></i></div>
                </div>
            </div>
            <div class="option" id="global-activation-function" style="display: none;">
                <span class="option-name">global activation</span>
                <div class="select-activation">
                    <div id="relu_" class="buttons" onclick="set_global_activation(\'#relu_\')">ReLU</div>
                    <div id="tanh_" class="buttons" onclick="set_global_activation(\'#tanh_\')">Tanh</div>
                    <div id="sigmoid_" class="buttons" onclick="set_global_activation(\'#sigmoid_\')">Sigmoid</div>
                </div>
            </div>'

                    ?>

            </div>
        </div>
    </div>

    <div id="control_panel">
        <div id="control_panel_slider"><i class="fa fa-angle-up" aria-hidden="true"></i></div>
        <div id="delete_index" class="buttons">
            <div id="sub" onclick="update_value(-1)"><i class="fa
                        fa-minus-circle" aria-hidden="true"></i></div>
            <div id="num">0</div>
            <div id="add" onclick="update_value(1)"><i class="fa
                        fa-plus-circle" aria-hidden="true"></i></div>
        </div>
        <div id="add_layer" class="buttons" onclick="Add_layer()">Add layer</div>
        <div id="move_left" class="buttons" onclick="Swap_layer(-1);">Move
            left</div>
        <div id="move_right" class="buttons" onclick="Swap_layer(1);">Move
            right</div>
        <div id="proceed" class="buttons" onclick="proceed()">Proceed -></div>
        <div id="delete_layer" class="buttons" onclick="delete_layer()">Delete
            layer</div>
        <div id="edit" class="buttons" onclick="edit_on_off('#edit')">Edit-Mode:&nbsp<b>ON</b></div>
        <div id="relu" class="buttons" onclick="assignActivationFunction('relu')">ReLU</div>
        <div id="tanh" class="buttons" onclick="assignActivationFunction('tanh')">Tanh</div>
        <div id="sigmoid" class="buttons" onclick="assignActivationFunction('sigmoid')">Sigmoid</div>
    </div>
</body>

<script src="scripts/Neural_utils.js"></script>
<script src="scripts/Neural_main.js"></script>
<script src="scripts/Neural_main_menu.js"></script>
<script>

    window.onload = () => {
        // const settings = {
        //     func: 'logsg',
        // } 
        // let xhr = new XMLHttpRequest();
        // xhr.open('POST', 'php/main.php', true);
        // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // xhr.onload = () => {
        //     console.log('ye bhi to whi kar rha hai');
        //     console.log(xhr.responseText);
        // }

        // xhr.send(JSON.stringify(settings));
        console.log('index.php');
    }

</script>

</html>