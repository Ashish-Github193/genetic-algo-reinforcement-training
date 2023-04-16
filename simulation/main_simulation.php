<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simulation</title>
  <!-- <link rel="stylesheet" href="../css/main_game.css"> -->

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
    integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
    crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
    crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="stylesheet" href="../css/simulation.css" />
  <script src="https://code.jquery.com/jquery-3.6.3.js" integrity="sha256-nQLuAZGRRcILA+6dMBOvcRh5Pe310sBpanc6+QBmyVM="
    crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.min.js"
    integrity="sha512-pumBsjNRGGqkPzKHndZMaAG+bir374sORyzM3uulLV14lN5LyykqNk8eEeUlUkB3U0M4FApyaHraT65ihJhDpQ=="
    crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>

  </style>
</head>

<?php session_start();?>

<body id="body">

  <div class="hidden-track-data">
    <?php
    echo '<div id="td-i">start point</div>           <span class="t-d" id="sp"  >' . $_SESSION['spx'] . ',' . $_SESSION['spy'] . '</span>';
    echo '<div id="td-i">start vector</div>          <span class="t-d" id="sv"  >' . $_SESSION['svx'] . ',' . $_SESSION['svy'] . '</span>';
    echo '<div id="td-i">track created</div>      <span class="t-d" id="tdc" >' . $_SESSION['track-date-created'] . '</span>';
    echo '<div id="td-i">track boundry</div>   <span class="t-d" id="tbc" >' . $_SESSION['boundry-color'] . '</span>';
    echo '<div id="td-i">track id</div>        <span class="t-d" id="tid" >' . $_SESSION['track-id'] . '</span>';

    echo '<div id="td-i">population size</div>       <span class="t-d" id="population-size">       ' . $_SESSION['population_size'] . '</span>';
    echo '<div id="td-i">crossover rate</div>        <span class="t-d" id="crossover-rate">        ' . $_SESSION['crossover_rate'] . '</span>';
    echo '<div id="td-i">mutation rate</div>         <span class="t-d" id="mutation-rate">         ' . $_SESSION['mutation_rate'] . '</span>';
    echo '<div id="td-i">elites number </div>      <span class="t-d" id="number-of-elites">      ' . $_SESSION['number_of_elite_networks'] . '</span>';
    echo '<div id="td-i">camera range</div>          <span class="t-d" id="camera-length">         ' . $_SESSION['camera_length'] . '</span>';
    echo '<div id="td-i">camera divergence</div>     <span class="t-d" id="camera-divergence">     ' . $_SESSION['camera_divergence'] . '</span>';
    echo '<div id="td-i">camera number</div>         <span class="t-d" id="camera-number">         ' . $_SESSION['camera_number'] . '</span>';
    echo '<div id="td-i">generation alive</div>      <span class="t-d" id="generation-alive-time"> ' . $_SESSION['generation_alive_time'] . '</span>';
    echo '<div id="td-i">global activation</div>     <span class="t-d" id="global-activation">     ' . $_SESSION['global_activation'] . '</span>';

    echo '<div id="td-i">model id</div>     <span class="t-d" id="model-id">     ' . $_SESSION['model-id'] . '</span>';
    echo '<div id="td-i">model name</div>     <span class="t-d" id="model-name">     ' . $_SESSION['model-name'] . '</span>';
    echo '<div id="td-i">model shape</div>     <span class="t-d" id="model-shape">     ' . $_SESSION['model-shape'] . '</span>';
    echo '<div id="td-i">input shape</div>     <span class="t-d" id="model-input-shape">     ' . $_SESSION['model-input-shape'] . '</span>';
    echo '<div id="td-i">model one</div>     <span class="t-d hidden" id="model-one-weights">     ' . $_SESSION['model-one-weights'] . '</span>';
    echo '<div id="td-i">model two</div>     <span class="t-d hidden" id="model-two-weights">     ' . $_SESSION['model-two-weights'] . '</span>';
    ?>
  </div>


  <canvas id="bg"></canvas>
  <!-- <img class="hidden" src="../assets/boundry(132).png" alt="" id="roadImage"> -->
  <?php
  if (!$_SESSION['track-image']) {
    echo '<img class="roadImage" id="roadImage" src="../assets/black.png' . '" alt="" > ';
  } else {
    echo '<img class="roadImage" id="roadImage" src="' . $_SESSION['track-image'] . '" alt="" > ';
  }
  ?>
  
  <img class="hidden" src="../assets/car2.png" alt="" id="carImage">
  <img class="hidden" src="../assets/car-tyres.png" alt="" id="tyreImage">

  <div class="parameter">
    <div class="ptd speed">Speed: <span id="speed-data-show"></span></div>
    <div class="ptd acc">Acceleration: <span id="acc-data-show"></span></div>
    <div class="ptd carAngle">Angle: <span id="angle-data-show"></span></div>
    <div class="ptd tyreAngle">Tyre: <span id="tyre-data-show"></span></div>
    <div class="ptd steer-input">Control <span id="steer-data-show"></span></div>
    <div class="ptd polulation">Cars: <span id="population-data-show"></span></div>
    <div class="ptd frame-index">Generation: <span id="frame-data-show"></span></div>
  </div>


  <!-- -------------------------------------- simulation visualisation ------------------------- -->
  <?php

  echo '<div id="s-panel">
    <div class="title">Parameters</div>
    <div id="slide-panel"></div>
    <div id="sliders">
      <div class="slider">
        <p>Population_size:</p>
        <input type="range" min="2" max="1000" value="' . $_SESSION['population_size'] . '" />
      </div>
      <div class="slider">
        <p>Crossover_rate:</p>
        <input type="range" min="1" max="100" value="' . $_SESSION['crossover_rate'] . '" />
      </div>
      <div class="slider">
        <p>Mutation_rate:</p>
        <input type="range" min="1" max="100" value="' . $_SESSION['mutation_rate'] . '" />
      </div>
      <div class="slider">
        <p>Steering_constant:</p>
        <input type="range" min="1" max="5" value="50" />
      </div>
      <div class="slider">
        <p>Breaking_constant:</p>
        <input type="range" min="1" max="100" value="50" />
      </div>
      <div class="slider">
        <p>Max_velocity:</p>
        <input type="range" min="1" max="100" value="50" />
      </div>
      <div class="slider">
        <p>Min_velocity:</p>
        <input type="range" min="1" max="100" value="50" />
      </div>
      <div class="slider">
        <p>Camera_length:</p>
        <input type="range" min="1" max="300" value="' . $_SESSION['camera_length'] . '" />
      </div>
      <div class="slider">
        <p>Camera_divergence:</p>
        <input type="range" min="1" max="180" value="' . $_SESSION['camera_divergence'] . '" />
      </div>
      <div class="slider">
        <p>Generation_alive_time:</p>
        <input type="range" min="1" max="50" value="' . $_SESSION['generation_alive_time'] . '" />
      </div>
    </div>
  </div>';

  ?>


  <div id="v-panel">
    <div class="title">visualizations</div>
    <div id="slide-v-panel"></div>
    <canvas id="generationFitnessChart"></canvas>
    <br><canvas id="speedGenerationChart"></canvas>
    <br><canvas id="successRateOverGenerationsChart"></canvas>
  </div>

  <div id="option-menu">
    <div id="notch"></div>
    <div class="mini_circle" id="c1">stop simulation</div>
    <div class="mini_circle" id="c3">restart simulation</div>
    <div class="mini_circle" id="c2">save model</div>
  </div>

  <!-- <div id="controls"></div> -->
</body>
<script src="../scripts/new_driving_physics_utils.js"></script>
<script src="../scripts/genetv2.js"></script>
<script src="../scripts/simulationQueryManager.js"></script>
<script src="../scripts/new_driving_physics.js"></script>
<script src="../scripts/simulation_requests_response.js"></script>
<script src="../scripts/sliders_graphs.js"></script>

</html>