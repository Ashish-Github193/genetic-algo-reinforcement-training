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
        <div id="fitness-show" class="item">max fitness:   <span id="fitness-box">23465</span></div>
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
            <input id="crossover-rate-slider" type="range" min="5" max="200" value="<?php echo $_SESSION['crossover_rate']; ?>" />
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
            <input id="steering-const-slider" type="range" min="1" max="10" value="5" />
        </div>
        <div class="sliders">
            <span>
                <p>Breaking constant:</p><span class="value"></span>
            </span>
            <input id="breaking-const-slider" type="range" min="1" max="10" value="8" />
        </div>
        <div class="sliders">
            <span>
                <p>Maximum velocity:</p><span class="value"></span>
            </span>
            <input id="max-velocity-slider" type="range" min="30" max="50" value="40" />
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
        <h2 class="heading">This is how this works</h2>
        <p class="para">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, sit vel ullam culpa
            nesciunt incidunt fugiat expedita quidem maxime. Illo mollitia ab repellendus excepturi itaque minima
            consequatur veniam quis laborum dicta sunt fuga, suscipit similique ad dolorum dolores in iure assumenda
            impedit ullam. Sit suscipit ipsa deleniti ab, at explicabo voluptas nemo quibusdam illum, quae vel totam
            omnis! Soluta mollitia nostrum aut sit quia officia temporibus fugit, iure quas ab? Earum magni a fugit,
            doloribus labore doloremque veniam odio aliquid dolor, dolores commodi similique laboriosam corporis
            deleniti necessitatibus architecto rem, est illo. Facere facilis repudiandae ex explicabo maiores deserunt
            sint tenetur molestiae repellat, enim veritatis aliquid, eum aspernatur eligendi cum porro non nesciunt
            optio vel alias. Sequi quaerat similique eos laboriosam ut eum expedita aspernatur soluta. Ex laborum ad
            nemo sapiente aut quibusdam ab veniam atque quod possimus labore deserunt neque at repellendus velit vero
            delectus, accusamus excepturi mollitia tempora voluptate eveniet dignissimos. Molestiae nemo similique
            numquam modi. Ad, eaque. Aut quia hic tempora nobis animi modi amet. Veritatis ratione voluptates numquam
            distinctio provident saepe cumque eum doloremque laborum quaerat modi maxime sit id velit aperiam alias
            vitae ut cum, dolorem perspiciatis, ad deleniti culpa? Et nemo dolor consequuntur labore!</p>

        <div class="grid-3">
            <div class="small-insights">
                <h3 class="sub-heading">item 1</h3>
                <p class="para">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae officia ut explicabo
                    commodi incidunt, a laborum minima, aliquam inventore iusto optio! Minus amet minima ducimus quos
                    nisi quod in quasi?</p>
            </div>
            <div class="small-insights">
                <h3 class="sub-heading">item 2</h3>
                <p class="para">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae officia ut explicabo
                    commodi incidunt, a laborum minima, aliquam inventore iusto optio! Minus amet minima ducimus quos
                    nisi quod in quasi?</p>
            </div>
            <div class="small-insights">
                <h3 class="sub-heading">item 3</h3>
                <p class="para">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae officia ut explicabo
                    commodi incidunt, a laborum minima, aliquam inventore iusto optio! Minus amet minima ducimus quos
                    nisi quod in quasi?</p>
            </div>
            <div class="small-insights">
                <h3 class="sub-heading">item 1</h3>
                <p class="para">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae officia ut explicabo
                    commodi incidunt, a laborum minima, aliquam inventore iusto optio! Minus amet minima ducimus quos
                    nisi quod in quasi?</p>
            </div>
            <div class="small-insights">
                <h3 class="sub-heading">item 2</h3>
                <p class="para">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae officia ut explicabo
                    commodi incidunt, a laborum minima, aliquam inventore iusto optio! Minus amet minima ducimus quos
                    nisi quod in quasi?</p>
            </div>
            <div class="small-insights">
                <h3 class="sub-heading">item 3</h3>
                <p class="para">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae officia ut explicabo
                    commodi incidunt, a laborum minima, aliquam inventore iusto optio! Minus amet minima ducimus quos
                    nisi quod in quasi?</p>
            </div>
            <div class="small-insights">
                <h3 class="sub-heading">item 1</h3>
                <p class="para">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae officia ut explicabo
                    commodi incidunt, a laborum minima, aliquam inventore iusto optio! Minus amet minima ducimus quos
                    nisi quod in quasi?</p>
            </div>
            <div class="small-insights">
                <h3 class="sub-heading">item 2</h3>
                <p class="para">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae officia ut explicabo
                    commodi incidunt, a laborum minima, aliquam inventore iusto optio! Minus amet minima ducimus quos
                    nisi quod in quasi?</p>
            </div>
            <div class="small-insights">
                <h3 class="sub-heading">item 3</h3>
                <p class="para">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae officia ut explicabo
                    commodi incidunt, a laborum minima, aliquam inventore iusto optio! Minus amet minima ducimus quos
                    nisi quod in quasi?</p>
            </div>
        </div>
    </div>
    <div id="settings">
        <div class="setting-wrap">
            <div class="setting-statement">
                <h4 class="small-light-heading">save model</h4>
                <p class="para">save model to database</p>
            </div>
            <button class="setting-btn">save</button>
        </div>
        <div class="setting-wrap">
            <div class="setting-statement">
                <h4 class="small-light-heading">save model</h4>
                <p class="para">save model to database</p>
            </div>
            <button class="setting-btn">save</button>
        </div>
        <div class="setting-wrap">
            <div class="setting-statement">
                <h4 class="small-light-heading">save model</h4>
                <p class="para">save model to database</p>
            </div>
            <button class="setting-btn">save</button>
        </div>
        <div class="setting-wrap">
            <div class="setting-statement">
                <h4 class="small-light-heading">save model</h4>
                <p class="para">save model to database</p>
            </div>
            <button class="setting-btn">save</button>
        </div>
        <div class="setting-wrap">
            <div class="setting-statement">
                <h4 class="small-light-heading">save model</h4>
                <p class="para">save model to database</p>
            </div>
            <button class="setting-btn">save</button>
        </div>
        <div class="setting-wrap">
            <div class="setting-statement">
                <h4 class="small-light-heading">save model</h4>
                <p class="para">save model to database</p>
            </div>
            <button class="setting-btn">save</button>
        </div>
    </div>
</body>
<script src="../scripts/new_driving_physics_utils.js"></script>
<script src="../scripts/genetv2.js"></script>
<script src="../scripts/simulationQueryManager.js"></script>
<script src="../scripts/new_driving_physics.js"></script>
<script src="../scripts/simulation_requests_response.js"></script>
<script src="../scripts/sliders_graphs.js"></script>


</html>