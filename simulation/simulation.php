<!DOCTYPE html>
<html lang="en">
<?php session_start(); ?>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://code.jquery.com/jquery-3.6.3.js"
        integrity="sha256-nQLuAZGRRcILA+6dMBOvcRh5Pe310sBpanc6+QBmyVM=" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="../css/simulation_v2.css">
    <title>Simulation</title>
</head>

<body>
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
        // echo '<div id="td-i">camera number</div>         <span class="t-d" id="camera-number">         ' . $_SESSION['camera_number'] . '</span>';
        echo '<div id="td-i">generation alive</div>      <span class="t-d" id="generation-alive-time"> ' . $_SESSION['generation_alive_time'] . '</span>';
        echo '<div id="td-i">global activation</div>     <span class="t-d" id="global-activation">     ' . $_SESSION['global_activation'] . '</span>';

        echo '<div id="td-i">model id</div>     <span class="t-d" id="model-id">     ' . $_SESSION['model-id'] . '</span>';
        echo '<div id="td-i">model name</div>     <span class="t-d" id="model-name">     ' . $_SESSION['model-name'] . '</span>';
        echo '<div id="td-i">model shape</div>     <span class="t-d" id="model-shape">     ' . $_SESSION['model-shape'] . '</span>';
        echo '<div id="td-i">input shape</div>     <span class="t-d" id="model-input-shape">     ' . $_SESSION['model-input-shape'] . '</span>';
        echo '<div id="td-i">model one</div>     <span class="t-d " id="model-one-weights">     ' . $_SESSION['model-one-weights'] . '</span>';
        echo '<div id="td-i">model two</div>     <span class="t-d " id="model-two-weights">     ' . $_SESSION['model-two-weights'] . '</span>';
        ?>
        <?php
        if (!$_SESSION['track-image']) {
            echo '<img class="roadImage" id="roadImage" src="../assets/black.png' . '" alt="" > ';
        } else {
            echo '<img class="roadImage" id="roadImage" src="' . $_SESSION['track-image'] . '" alt="" > ';
        }
        ?>
        <img class="hidden" src="../assets/car2.png" alt="" id="carImage">
        <img class="hidden" src="../assets/car-tyres.png" alt="" id="tyreImage">
    </div>
    <canvas id="bg"></canvas>
    <div id="show-panel">
        <div id="model-name-show" class="item">model:      <span id="model-name-box"><?php echo $_SESSION['model-name'];?></span></div>
        <div id="generation-show" class="item">generation: <span id="generation-box">132</span></div>
        <div id="population-show" class="item">population: <span id="population-box">0</span></div>
        <div id="fitness-show" class="item">fitness:   <span id="fitness-box">23465</span></div>
        <div id="last-gen-fitness-show" class="item">last gen max fitness:   <span id="last-gen-fitness-box"></span></div>
    </div>
    <div id="options">
        <button class="control-btn" id="pause-btn">pause</button>
        <button class="control-btn" id="start-btn">start</button>
        <button class="control-btn" id="next-gen-btn">next gen</button>
        <button class="control-btn" id="restart-btn">restart</button>

        <button class="nav-btn" id="slider-btn">parameters</button>
        <button class="nav-btn" id="graph-btn">visualizations</button>
        <button class="nav-btn" id="insight-btn">insigths</button>
        <button class="nav-btn" id="simulation-settings-btn">settings</button>
    </div>
    <div id="sliders">
        <div class="sliders">
            <span>
                <p>Population size:</p><span class="value"></span>
            </span>
            <input id="population-slider" type="range" min="5" max="300" value="<?php echo $_SESSION['population_size']; ?>" />
        </div>
        <div class="sliders">
            <span>
                <p>Crossover rate:</p><span class="value"></span>
            </span>
            <input id="crossover-rate-slider" type="range" min="5" max="100" value="<?php echo $_SESSION['crossover_rate']; ?>" />
        </div>
        <div class="sliders">
            <span>
                <p>Mutation rate:</p><span class="value"></span>
            </span>
            <input id="mutation-rate-slider" type="range" min="1" max="100" value="<?php echo $_SESSION['mutation_rate']; ?>" />
        </div>
        <div class="sliders">
            <span>
                <p>Steering constant:</p><span class="value"></span>
            </span>
            <input id="steering-const-slider" type="range" min="1" max="10" value="2" />
        </div>
        <div class="sliders">
            <span>
                <p>Breaking constant:</p><span class="value"></span>
            </span>
            <input id="breaking-const-slider" type="range" min="1" max="10" value="2" />
        </div>
        <div class="sliders">
            <span>
                <p>Maximum velocity:</p><span class="value"></span>
            </span>
            <input id="max-velocity-slider" type="range" min="30" max="60" value="40" />
        </div>
        <div class="sliders">
            <span>
                <p>Minimum velocity:</p><span class="value"></span>
            </span>
            <input id="min-velocity-slider" type="range" min="5" max="20" value="8" />
        </div>
        <div class="sliders">
            <span>
                <p>Accelaration:</p><span class="value"></span>
            </span>
            <input id="accelaration-slider" type="range" min="0" max="50" value="1" />
        </div>
        <div class="sliders">
            <span>
                <p>Camera length:</p><span class="value"></span>
            </span>
            <input id="camera-length-slider" type="range" min="50" max="500" value="<?php echo $_SESSION['camera_length']; ?>" />
        </div>
        <div class="sliders">
            <span>
                <p>Camera divergence:</p><span class="value"></span>
            </span>
            <input id="camera-divergence-slider" type="range" min="90" max="180" value="<?php echo $_SESSION['camera_divergence']; ?>" />
        </div>
        <div class="sliders">
            <span>
                <p>Generation life time:</p><span class="value"></span>
            </span>
            <input id="gen-life-time-slider" type="range" min="1" max="100" value="<?php echo $_SESSION['generation_alive_time']; ?>" />
        </div>

    </div>
    <div id="graphs">
        <div class="graph-container" style="position: relative;">
            <canvas class="graph" id="generationFitnessChart"></canvas>
        </div>
        <div class="graph-container" style="position: relative;">
            <canvas class="graph" id="speedGenerationChart"></canvas>
        </div>
        <div class="graph-container" style="position: relative;">
            <canvas class="graph" id="successRateOverGenerationsChart"></canvas>
        </div>
    </div>
    <div id="insights">
        <h2 class="heading">Simulation Overview</h2>
        <p class="para">The system is based on a neural network, which is a computer program that can learn to recognize
            patterns and make decisions based on them. The neural network is trained using a reinforcement learning
            technique, where the system is given a reward for making correct decisions and penalized for making
            incorrect decisions.
            Over time, the system learns to drive the car more efficiently and effectively.

            To optimize the performance of the system, you are using a genetic algorithm. This is a technique inspired
            by natural selection, where the system evolves over time by selecting the fittest individuals from a
            population and breeding them to create the next generation.
            In this way, the system can learn from its mistakes and improve its performance over time.

            The virtual track on which the car is driving is designed to challenge the artificial intelligence system.
            It includes various obstacles and hazards, such as sharp turns, narrow corridors, and barriers. The system
            must learn to navigate these obstacles and avoid collisions while still driving as quickly and efficiently
            as possible.

            The project is designed to be both educational and entertaining. By simulating the process of neural network
            reinforcement with genetic algorithm, you can gain a deeper understanding of how artificial intelligence
            systems learn and evolve.
            At the same time, the top view car game provides an exciting and engaging platform for testing and refining
            your system.

            In conclusion, the top view car game project that you are creating is an innovative and exciting simulation
            of neural network reinforcement with genetic algorithm. Through this project, you can gain valuable insights
            into the world of artificial intelligence and contribute to the ongoing development of this fascinating
            field.
        </p>

        <div class="grid-3">
            <div class="small-insights">
                <h3 class="sub-heading">Population Size</h3>
                <p class="para">In genetic algorithm, population size is a critical parameter that influences the
                    performance of the algorithm.
                    The population size refers to the number of individuals in a population, and it impacts the genetic
                    diversity, convergence rate, and computation time.
                    A larger population size may result in better exploration of the search space, but it can also lead
                    to slower convergence and higher computational cost.
                    On the other hand, a smaller population size can lead to premature convergence and decreased
                    diversity.
                    Therefore, selecting an appropriate population size is crucial for achieving optimal performance in
                    genetic algorithm.</p>
            </div>
            <div class="small-insights">
                <h3 class="sub-heading">Crossover Rate</h3>
                <p class="para">In genetic algorithm, crossover rate is a parameter that determines the probability of
                    two individuals in a population exchanging genetic information during reproduction. It influences
                    the exploration and exploitation balance of the algorithm by regulating the extent to which the
                    algorithm explores new solutions and exploits current ones. A higher crossover rate results in a
                    higher probability of producing diverse offspring, while a lower rate favors the exploitation of
                    existing good solutions. Thus, selecting an appropriate crossover rate is crucial for achieving an
                    optimal balance between exploration and exploitation in genetic algorithm.</p>
            </div>
            <div class="small-insights">
                <h3 class="sub-heading">Mutation Rate</h3>
                <p class="para">In genetic algorithm, mutation rate is a parameter that determines the probability of
                    introducing random changes in the genetic material of individuals during reproduction. It provides a
                    way to maintain diversity in the population by allowing new genetic material to be introduced into
                    the gene pool. A higher mutation rate increases the probability of producing diverse offspring, but
                    it may also slow down the convergence of the algorithm. Therefore, selecting an appropriate mutation
                    rate is essential for balancing the exploration of new solutions with the exploitation of current
                    ones in genetic algorithm.</p>
            </div>
            <div class="small-insights">
                <h3 class="sub-heading">Steering Constant</h3>
                <p class="para">Steering constant is a fixed value that dictates the amount of steering input needed to turn the wheels by a particular angle. This value is used to calculate the steering behavior of the virtual vehicle and ensure that it behaves realistically. By setting an appropriate steering constant, the simulation can provide a realistic and accurate representation of how the car would handle in real life. This can help improve the quality and accuracy of the simulation, making it more useful for training, testing, or entertainment purposes.</p>
            </div>
            <div class="small-insights">
                <h3 class="sub-heading">Breaking Constant</h3>
                <p class="para">Braking constant is a fixed value that determines the amount of braking input required to stop the wheels by reducing the vehicle's velocity. This value is essential for calculating the braking behavior of the virtual car and ensuring that it behaves realistically. By setting an appropriate braking constant, the simulation can provide a realistic and accurate representation of how the car would brake in real-life scenarios. This can help improve the quality and accuracy of the simulation, making it more useful for training, testing, or entertainment purposes.</p>
            </div>
            <div class="small-insights">
                <h3 class="sub-heading">Maximum Velocity</h3>
                <p class="para">The top speed of a car refers to the maximum velocity it can reach. When the vehicle hits this limit, its acceleration drops to zero, and it cannot go any faster. The top speed is determined by various factors such as the engine power, aerodynamics, and weight of the car. It is a crucial specification that indicates the vehicle's performance capability and limits. Knowing the top speed of a car is important for drivers to ensure safe and legal driving practices, as well as to make informed decisions about the car's usage and capabilities.</p>
            </div>
            <div class="small-insights">
                <h3 class="sub-heading">Minimum Velocity</h3>
                <p class="para">Minimum velocity value is used to prevent vehicles from remaining stationary for extended periods. This value ensures that the car continues to move, even if the driver does not apply any input. The minimum velocity value represents the minimum speed at which the car can travel, and the simulation engine constantly applies a force to keep the car moving at this speed or higher. This ensures that the car behaves realistically, as vehicles in real life cannot remain stationary unless they are braked or blocked. Knowing the minimum velocity of a car is important for ensuring accurate simulations and training programs.</p>
            </div>
            <div class="small-insights">
                <h3 class="sub-heading">Acceleration</h3>
                <p class="para">Acceleration refers to the rate of change of velocity over time. In a car simulation, acceleration is an essential factor that determines how quickly the car can increase its speed from a standstill or while moving. The acceleration value is often determined by the engine power, weight, and other factors of the virtual vehicle. It is used to ensure that the simulation behaves realistically, allowing for accurate representation of real-life driving scenarios.</p>
            </div>
            <div class="small-insights">
                <h3 class="sub-heading">Camera length</h3>
                <p class="para">Camera length is the distance between the camera viewpoint and the object being viewed. In a car simulation, camera length is often used to adjust the view of the virtual car. By changing the camera length, the view of the car can be altered, allowing for better visualization of the surroundings, road, and other objects. The camera length value can be set to provide a more realistic and immersive experience, making the simulation more engaging for users.</p>
            </div>
            <div class="small-insights">
                <h3 class="sub-heading">Camera divergence</h3>
                <p class="para">Camera divergence is the angle at which the virtual camera views the scene. In a car simulation, camera divergence is often used to simulate the perspective of the driver while driving. By adjusting the camera divergence, the virtual car can be viewed from different angles, providing a more realistic and immersive experience. The camera divergence value can be set to match the specifications of the car being simulated or to provide a more cinematic experience for users</p>
            </div>
            <div class="small-insights">
                <h3 class="sub-heading">Generation lifetime</h3>
                <p class="para">In a car simulation, generation lifetime refers to the lifespan of a generation of vehicles or drivers within the simulation. This value is often used to set the duration of a simulation or to control how long a particular generation of cars or drivers remains in the simulation. By setting an appropriate generation lifetime value, the simulation can accurately represent the effects of long-term changes in the virtual environment, such as changes in traffic patterns, road conditions, or vehicle specifications.</p>
            </div>
        </div>
    </div>
    <div id="settings">
        <div class="setting-wrap">
            <div class="setting-statement">
                <h4 class="small-light-heading">save model</h4>
                <p class="para">save model to database</p>
            </div>
            <button class="setting-btn" id="save-model-to-db">
                <div class="button-loader" id="bl-1"></div>
                save
            </button>
        </div>
        <div class="setting-wrap">
            <div class="setting-statement">
                <h4 class="small-light-heading">cameras</h4>
                <p class="para">show camera rays</p>
            </div>
            <button class="setting-btn right" id="show-camera-rays">show</button>
            <button class="setting-btn active" id="hide-camera-rays">hide</button>
        </div>
        <div class="setting-wrap">
            <div class="setting-statement">
                <h4 class="small-light-heading">car velocity</h4>
                <p class="para">show the velocity vector of car.</p>
            </div>
            <button class="setting-btn right" id="show-car-velocity-vector">show</button>
            <button class="setting-btn active" id="hide-car-velocity-vector">hide</button>
        </div>
        <div class="setting-wrap">
            <div class="setting-statement">
                <h4 class="small-light-heading">car detials</h4>
                <p class="para">show the exact details of car.</p>
            </div>
            <button class="setting-btn right" id="show-car-detail-section">show</button>
            <button class="setting-btn active" id="hide-car-detail-section">hide</button>
        </div>
        <div class="setting-wrap">
            <div class="setting-statement">
                <h4 class="small-light-heading">draw new map</h4>
                <p class="para">create a new map with dedicated map drawer tool.</p>
            </div>
            <button class="setting-btn" id="go-to-map-drawer">go to page</button>
        </div>
        <div class="setting-wrap">
            <div class="setting-statement">
                <h4 class="small-light-heading">select new map</h4>
                <p class="para">select already created map</p>
            </div>
            <button class="setting-btn" id="go-to-map-selector">go to page</button>
        </div>
        <!-- <div class="setting-wrap">
            <div class="setting-statement">
                <h4 class="small-light-heading">save model</h4>
                <p class="para">save model to database</p>
            </div>
            <button class="setting-btn">save</button>
        </div> -->
    </div>
</body>
<script src="../scripts/new_driving_physics_utils.js"></script>
<script src="../scripts/genetv2.js"></script>
<script src="../scripts/simulationQueryManager.js"></script>
<script src="../scripts/new_driving_physics.js"></script>
<script src="../scripts/simulation_requests_response.js"></script>
<script src="../scripts/sliders_graphs.js"></script>


</html>