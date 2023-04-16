<?php

session_start();

function logSGdata()
{

    echo 'list of super globals <br>';
    echo $_SESSION['track-image'] . '<br>';
    echo $_SESSION['spx'] . '<br>';
    echo $_SESSION['spy'] . '<br>';
    echo $_SESSION['svx'] . '<br>';
    echo $_SESSION['svy'] . '<br>';
    echo $_SESSION['boundry-color'] . '<br>';
}

function saveToSession($popu, $crr, $mur, $noe, $cl, $cd, $cn, $gat, $ga)
{
    $_SESSION['population_size'] = $popu;
    $_SESSION['crossover_rate'] = $crr;
    $_SESSION['mutation_rate'] = $mur;
    $_SESSION['number_of_elite_networks'] = $noe;
    $_SESSION['camera_length'] = $cl;
    $_SESSION['camera_divergence'] = $cd;
    $_SESSION['camera_number'] = $cn;
    $_SESSION['generation_alive_time'] = $gat;
    $_SESSION['global_activation'] = $ga;

    // echo 'saved successfully...';
    // echo 'population is: ' . $_SESSION['population_size'];
    // echo 'cross over rate is: ' . $_SESSION['crossover_rate'];
}


$request = json_decode(file_get_contents('php://input'));


if ($request->func == 'logsg') {
    logSGdata();
}

if ($request->func == 'session-save') {
    $data = json_decode($request->data);
    echo $data->number_of_elite_networks;
    $population = $data->population_size;
    $crossoverRate = $data->crossover_rate;
    $mutationRate = $data->mutation_rate;
    $numberOfElites = $data->number_of_elite_networks;
    $cameraLength = $data->camera_length;
    $cameraDivergence = $data->camera_divergence;
    $cameraNumber = $data->camera_number;
    $generationAliveTime = $data->generation_alive_time;
    $globalActivation = $data->global_activation;

    saveToSession($population, $crossoverRate, $mutationRate, $numberOfElites, $cameraLength, $cameraDivergence, $cameraNumber, $generationAliveTime, $globalActivation);
}

if ($request->func == 'load-shape-weights') {
    $id = substr($request->id, -1, 1);
    $name = $request->name;
    // echo "model weights request got with id: " . $request->id;
    $conn = mysqli_connect('localhost', 'root', '', 'neuroevolutionsimulation');
    if (!$conn) {
        echo 'not connected with db';
        return 0;
    }
    $result = mysqli_query($conn, "SELECT shape, layers, model_1, model_2, fitness, generation, input_shape from modeldata WHERE serial=" . $id . ";");
    if (!$result) {
        echo "\nerror in finding the result from database: " . mysqli_error($conn);
    } else {

        $row = mysqli_fetch_assoc($result);
        $shape = $row['shape'];
        $inputShape = $row['input_shape'];
        $layers = $row['layers'];
        $model1 = $row['model_1'];
        $model2 = $row['model_2'];
        $fitness = $row['fitness'];
        $generation = $row['generation'];

        $neuron_template = '<div id="layerFirst" class="layer" style="border-color: transparent;"><div id="layerFirst_node1" class="node active_node"></div><div id="layerFirst_node2" class="node active_node"></div> <div id="layerFirst_node3" class="node active_node"></div><div id="layerFirst_node4" class="node active_node"></div><div id="layerFirst_node5" class="node active_node"></div></div>';

        $shape = explode(",", $shape);
        $layers = explode(",", $layers);

        for ($i = 0; $i < count($layers); $i++) {
            $neuron_template .= '<div id="layer' . ($i + 1) . '" class="layer ' . $layers[$i] . '" style="border-color: transparent;">';
            for ($j = 0; $j < (int) $shape[$i]; $j++) {
                $neuron_template .= '<div class="node active_node" id="layer' . ($i + 1) . '_node' . ($j + 1) . '"></div>';
            }
            $neuron_template .= '</div>';
        }
        $neuron_template .= '<div id="layerLast" class="layer" style="border-color: transparent;"><div id="layerLast_node1" class="node active_node"></div><div id="layerLast_node2" class="node active_node"></div><div id="layerLast_node3" class="node active_node"></div><div id="layerLast_node4" class="node active_node"></div></div>';

        $_SESSION['model-id'] = $id;
        $_SESSION['model-name'] = $name;
        $_SESSION['model-one-weights'] = $model1;
        $_SESSION['model-two-weights'] = $model2;
        $_SESSION['model-shape'] = implode(",", $shape);
        $_SESSION['model-input-shape'] = $inputShape;
        $_SESSION['model-activations'] = implode(",", $layers);
        $_SESSION['model-fitness'] = $fitness;
        $_SESSION['model-generation'] = $generation;

        $data = array(
            "shape" => $shape,
            "layers" => $layers,
            "template" => $neuron_template,
        );
        echo "\n" . json_encode($data);
    }
}

if ($request->func == 'save-model-weights') {
    // echo "model weights request got\n";
    $id = $request -> serial;
    $model1 = $request->model_1;
    $model2 = $request->model_2;
    $fitness = $request->fitness;
    $generation = $request->generation;
    $connection = mysqli_connect('localhost', 'root', '', 'neuroevolutionsimulation');

    // echo $model1;

    if (!$connection) {
        echo "\ncouldnt cnnect to the server\n";
    } else {
        echo "\nconnected to the server\n";
    }

    $sql = "UPDATE modeldata SET model_1 = ?, model_2 = ?, fitness = ?, generation = ? WHERE serial = ?";
    $stmt = mysqli_prepare($connection, $sql);
    if (!$stmt) {
        echo "Error preparing statement: " . mysqli_error($connection) . "\n";
    } else {
        mysqli_stmt_bind_param($stmt, "ssiii", $model1, $model2, $fitness, $generation, $id);
        mysqli_stmt_execute($stmt);
        echo "model weights saved successfully \n";
    }

}

?>