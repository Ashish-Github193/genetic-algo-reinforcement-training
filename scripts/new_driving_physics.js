//output and labels
// var speed_o = $("#speed-data-show");
// var acc_o = $("#acc-data-show");
// var angle_o = $("#angle-data-show");
// var tyre_o = $("#tyre-data-show");
// var manual_steer_data_o = $("#manual_steer_data-data-show");
// var population_o = $("#population-data-show");
// var frame_o = $("#frame-data-show");

// setup

var canvas = document.querySelector("#bg");
var canvasWidth = (canvas.width = window.innerWidth);
var canvasHeight = (canvas.height = window.innerHeight);

var ctx = canvas.getContext("2d", {
  willReadFrequently: true
});

var image_dim = [canvasWidth, canvasHeight];
var completeImage = [];

var roadImage = document.getElementById("roadImage");
var carImage = document.getElementById("carImage");
var tyreImage = document.getElementById("tyreImage");





var manual_steer_data = 0;

var completeImageArray = [];
var lastCalledTime = Date.now();
var trackBoundryColor = hexToRgb($("#tbc").text());
var spawnPoint = $("#sp").text().split(",").map((ele) => parseFloat(ele));
var startVector = $("#sv").text().split(",").map((ele) => parseFloat(ele));


var frameIndex = 0;
var generation = 0;
var population = parseInt($('#population-size').text());
var crossoverRate = parseInt($('#crossover-rate').text());
var mutationRate = parseInt($('#mutation-rate').text());
var numberOfElites = parseInt($('#number-of-elites').text());
var cameraData = [];
var controlData = Array.from({ length: population }, () => [0, 0]);
var lastGenTime = Date.now();
var generationAliveTime = parseInt($('#generation-alive-time').text()) * 1000;
var carList = [];
var numberOfCamers = parseInt($('#model-input-shape').text());
var live_cars = population;
var genetic_algo = new GENETIC_ALGORITHM(population_size = population, crossover_rate = crossoverRate / 100, mutation_rate = mutationRate / 10, elite_networks = 2);

var fitnessList = [];
var maxVelocityReacedList = [];
var ParentAverageVelocityList = [];
var successRateList = []
var populationList = []


var flag = 0;

// car settings
var maxSpeed = 4.0;
var minSpeed = 0.8;
var accelaration = 0.01;
var steeringConstant = 0.02;
var breakingConstant = 0.2;

// extra settings 
var drawExactDetails = 0;
var drawVelocityVector = 0;
var drawCameraRays = 0;

// camera settings
var cameraRange = parseInt($('#camera-length').text());
var cameraDivergence = parseInt($('#camera-divergence').text());



function Car(x = spawnPoint[0], y = spawnPoint[1]) {
  // car settings:
  this.x = x;
  this.y = y;
  this.state = "start";
  this.maxSpeed = maxSpeed;
  this.minSpeed = minSpeed;
  this.accelaration = accelaration;
  this.steeringConstant = steeringConstant;
  this.breakingConstant = breakingConstant;
  this.auto_steer_data = [0, 0, 0, 0]; // breaking left right
  this.carImage = carImage;
  this.width = this.carImage.width;
  this.height = this.carImage.height;
  this.startTime = Date.now();
  this.isDead = 0;
  this.frontTyreR = 0;
  this.scaleImage = 0.08;
  this.scaleTyreImage = this.scaleImage / 2;
  this.velocity = new vector(
    startVector[0] - spawnPoint[0],
    startVector[1] - spawnPoint[1]
  ).unitVector().intensify(this.minSpeed);
  this.r = this.velocity.r;
  this.speed = this.velocity.magnitude;
  this.maxSpeedReached = this.velocity.magnitude;

  // camera settings:
  this.cameraDivergence = cameraDivergence * (Math.PI / 180);
  this.numberOfCamers = numberOfCamers;
  this.cameraRange = cameraRange;
  this.cameras = [];
  this.cameraData = [];

  // model settings:
  this.fitness = 0;
  this.isDead = 0;

  // mislanneous:
  this.notMovedFrame = 0;

  // camera setup:
  for (let i = 0; i < this.numberOfCamers; i++) {
    this.cameras.push(
      new Camera(
        this.x,
        this.y,
        this.r + this.cameraDivergence * (i / this.numberOfCamers - 1 / 2),
        this.cameraRange
      )
    );
    this.cameraData.push(0);
  }

  this.update = () => {
    // while car isn't collided with wall:

    // console.log(this.auto_steer_data);

    if (this.auto_steer_data == undefined) {
      return 0;
    }

    if ((manual_steer_data == 1) || (this.auto_steer_data[0] == 1)) {
      this.velocity = this.velocity.add(
        this.velocity.unitVector().intensify(this.accelaration));
    }
    else if (((manual_steer_data == 3) || (this.auto_steer_data[0] == 2)) && (this.velocity.mod != 0)) {
      this.velocity = this.velocity.sub(
        this.velocity.unitVector().intensify(this.breakingConstant));
    }
    if ((manual_steer_data == 2) || (this.auto_steer_data[1] == 1)) {
      this.velocity = this.velocity.add(
        this.velocity.perp().intensify(-1 * this.steeringConstant));
      this.frontTyreR = -Math.PI / 6;
    }
    else if ((manual_steer_data == 4) || (this.auto_steer_data[1] == 2)) {
      this.velocity = this.velocity.add(
        this.velocity.perp().intensify(this.steeringConstant));
      this.frontTyreR = Math.PI / 6;
    }


    else {
      if (Math.abs(this.frontTyreR) < Math.PI / 10) {
        this.frontTyreR = 0;
      }
      if (this.frontTyreR > Math.PI / 10) {
        this.frontTyreR = this.frontTyreR - Math.PI / 100;
      } else if (this.frontTyreR < -Math.PI / 10) {
        this.frontTyreR = this.frontTyreR + Math.PI / 100;
      }
    }

    this.cameraData = [];
    for (i in this.cameras) {
      this.cameras[i].x = this.x;
      this.cameras[i].y = this.y;
      this.cameras[i].degree = this.r + this.cameraDivergence * (i / (this.numberOfCamers - 1) - 1 / 2);
      this.cameras[i].update();
      // (frameIndex % 3) ? 0 : this.cameras[i].update();
      let CamRange = this.cameras[i].range;
      this.cameraData.push(CamRange);
      (this.cameraData.some((range) => range < 20)) ? this.state = 'stop' : 0;
    }

    if (this.state === 'start') {
      if (this.velocity.magnitude < this.minSpeed) {
        this.velocity = this.velocity.unitVector().intensify(this.minSpeed);
      }

      if (this.velocity.magnitude > this.maxSpeed) {
        this.velocity = this.velocity.unitVector().intensify(this.maxSpeed);
      }

      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.r = this.velocity.r;
      this.fitness += this.velocity.mod;
      this.speed = this.velocity.mod;
      (this.speed > this.maxSpeedReached) ? this.maxSpeed = this.speed : 0;
    } else if (this.state === 'stop') {
      this.velocity = new vector(0, 0);
      // this.x += this.velocity.x;
      // this.y += this.velocity.y;
    }

  }

  this.calculateFitness = () => {
    return this.fitness;
  };

  this.draw = () => {

    if (this.state == 'start') {

      if (drawCameraRays) {
        for (i in this.cameras) {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.beginPath();
          this.cameras[i].draw();
        }
      }


      ctx.setTransform(
        this.scaleTyreImage,
        0,
        0,
        this.scaleTyreImage,
        this.x + 1000 * Math.cos(this.r - Math.PI / 12) * this.scaleTyreImage,
        this.y + 1000 * Math.sin(this.r - Math.PI / 12) * this.scaleTyreImage
      );
      ctx.rotate(this.r + Math.PI / 2 + this.frontTyreR);
      ctx.drawImage(
        tyreImage,
        (-1 * tyreImage.width) / 2,
        (-1 * tyreImage.height) / 2
      );

      ctx.setTransform(
        this.scaleTyreImage,
        0,
        0,
        this.scaleTyreImage,
        this.x + 1000 * Math.cos(this.r + Math.PI / 12) * this.scaleTyreImage,
        this.y + 1000 * Math.sin(this.r + Math.PI / 12) * this.scaleTyreImage
      );
      ctx.rotate(this.r + Math.PI / 2 + this.frontTyreR);
      ctx.drawImage(
        tyreImage,
        (-1 * tyreImage.width) / 2,
        (-1 * tyreImage.height) / 2
      );

      ctx.setTransform(
        this.scaleTyreImage,
        0,
        0,
        this.scaleTyreImage,
        this.x + 400 * Math.cos(this.r - Math.PI / 4) * this.scaleTyreImage,
        this.y + 400 * Math.sin(this.r - Math.PI / 4) * this.scaleTyreImage
      );
      ctx.rotate(this.r + Math.PI / 2);
      ctx.drawImage(
        tyreImage,
        (-1 * tyreImage.width) / 2,
        (-1 * tyreImage.height) / 2
      );

      ctx.setTransform(
        this.scaleTyreImage,
        0,
        0,
        this.scaleTyreImage,
        this.x + 400 * Math.cos(this.r + Math.PI / 4) * this.scaleTyreImage,
        this.y + 400 * Math.sin(this.r + Math.PI / 4) * this.scaleTyreImage
      );
      ctx.rotate(this.r + Math.PI / 2);
      ctx.drawImage(
        tyreImage,
        (-1 * tyreImage.width) / 2,
        (-1 * tyreImage.height) / 2
      );

      ctx.setTransform(
        this.scaleImage / 1,
        0,
        0,
        this.scaleImage / 1,
        this.x,
        this.y
      );
      ctx.rotate(this.r);
      ctx.drawImage(carImage, -100, (-1 * carImage.height) / 2);

      if (drawExactDetails) {
        ctx.setTransform(1, 0, 0, 1, this.x, this.y);

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#111';
        ctx.moveTo(0, 0);
        ctx.lineTo(10, 10);
        ctx.stroke();

        ctx.fillStyle = "#111";
        ctx.fillRect(8, 8, 84, 74);

        ctx.fillStyle = "#40d672";
        ctx.fillRect(10, 10, 80, 70);

        ctx.fillStyle = "#111";
        ctx.font = "12px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("fit: " + roundNumber(this.fitness, 2), 15, 25);
        ctx.fillText("vel: " + roundNumber(this.velocity.mod, 2), 15, 40);
        ctx.fillText("psx: " + roundNumber(this.x, 2), 15, 55);
        ctx.fillText("psy: " + roundNumber(this.y, 2), 15, 70);
      }


      if (drawVelocityVector) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.velocity.x * 25, this.y + this.velocity.y * 25);
        ctx.stroke();
      }

    } else {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.beginPath();
      ctx.fillStyle = 'red';
      ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}


function Camera(carX, carY, degree, range) {
  this.x = carX;
  this.y = carY;
  this.maxRange = range;
  this.range = 10.0;
  this.degree = degree;
  this.cameraRayColor = "#fff";

  this.draw = () => {
    ctx.fillStyle = this.cameraRayColor;
    ctx.beginPath();
    ctx.arc(
      this.x + this.range * Math.cos(this.degree),
      this.y + this.range * Math.sin(this.degree),
      5,
      0,
      Math.PI * 2
    );

    ctx.fill();
    ctx.strokeStyle = this.cameraRayColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(
      this.x + this.range * Math.cos(this.degree),
      this.y + this.range * Math.sin(this.degree)
    );

    ctx.stroke();
  };

  this.checkWallCollision = () => {
    this.range = 10.0;
    let colorData = 0;
    while (this.range < this.maxRange) {
      const x = parseInt(this.x + this.range * Math.cos(this.degree));
      const y = parseInt(this.y + this.range * Math.sin(this.degree));
      colorData = getImageDataFaster(x, y);
      if ((colorData & 0xff) == trackBoundryColor[0] && ((colorData >> 8) & 0xff) == trackBoundryColor[1] && ((colorData >> 16) & 0xff) == trackBoundryColor[2]) { break; }
      else { this.range += 1; }
    }

    this.cameraRayColor =
      "rgb(" +
      (255 - ((colorData >> 0) & 0xff)) +
      ", " +
      (255 - ((colorData >> 8) & 0xff)) +
      ", " +
      (255 - ((colorData >> 16) & 0xff)) +
      ")";
  };

  this.update = () => {
    this.checkWallCollision();
  };
}

// pre setup:
// for (let i = 0; i < population; i++)
//   carList.push(new Car(spawnPoint[0], spawnPoint[1]));

// controls:
// onclick = (event) => console.log("x: " + event.clientX + ", " + "y: " + event.clientY);

onkeydown = (e) => {
  if (e.key == " ") {
    manual_steer_data = -1;
  } else if (e.key == "w") {
    manual_steer_data = 1;
  } else if (e.key == "a") {
    manual_steer_data = 2;
  } else if (e.key == "s") {
    manual_steer_data = 3;
  } else if (e.key == "d") {
    manual_steer_data = 4;
  } else if (e.key == "n") {
    next = 1;
  } else if (e.key == "m") {
    saveModelWeightsToServer();
  }
}


// Create and update charts
var chart_fit_gen = createAndUpdateRealTimeChart("generationFitnessChart", "Fitness", "Generation");
var chart_speed_gen = createAndUpdateRealTimeChart("speedGenerationChart", "Speed", "Generation");
var chart_succ_gen = createAndUpdateRealTimeChart("successRateOverGenerationsChart", "SuccessRate", "Generation");

// onkeyup = () => { manual_steer_data = 0 };
var next = 1;


function run() 
{

  (frameIndex % 30) ? 0 : updateBestCarData(carList);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(roadImage, 0, 0, canvasWidth, canvasHeight);
  cameraData = [];

  // console.log(carList[1].auto_steer_data);


  if (manual_steer_data !== -1) {
    if (timeDiff(lastGenTime, generationAliveTime) || CheckDeadCars() || next) {
      generation++;

      fitnessList.push(roundNumber(findObjectWithMaxAttribute(carList, 'fitness').fitness, 2));
      successRateList.push(roundNumber((checkAliveCars() / population), 3));
      maxVelocityReacedList.push(roundNumber(findObjectWithMaxAttribute(carList, 'speed').speed, 2));
      populationList.push(population);

      (successRateList[0] != 0) ? successRateList[0] = 0 : 0; // to solve a bug of always showing 1 in successrate list in first position; 

      // console.log('///// new generation ////');
      // console.log("fit: ", fitnessList);
      // console.log("scc: ", successRateList);
      // console.log("mxv: ", maxVelocityReacedList);
      // console.log("ppl: ", populationList);

      chart_fit_gen.updateChartData(fitnessList.at(-1), generation-1);
      chart_speed_gen.updateChartData(maxVelocityReacedList.at(-1), generation-1);
      chart_succ_gen.updateChartData(successRateList.at(-1), generation-1);

      lastGenTime = Date.now();
      frameIndex = 0;
      fitnesses = [];
      for (let idx = 0; idx < carList.length; idx++) {
        fitnesses.push(carList[idx].calculateFitness());
      }
      // console.log(fitnesses);
      carList = Array.from({ length: population }, () => new Car(spawnPoint[0], spawnPoint[1]));
      genetic_algo.CROSSOVER_MUTATION_NETWORKS(fitnesses);
      next = 0;
    }
    else {

      for (carIndex in carList) {

        if (!(manual_steer_data == -1)) {
          let thisCar = carList[carIndex];
          cameraData.push(thisCar.cameraData);
          thisCar.auto_steer_data = controlData[carIndex];
          thisCar.update();
        }
      }

      if (!(manual_steer_data == -1)) {
        controlData = getControlData(cameraData);
        frameIndex++;
      }
    }
  }
  
  (frameIndex % 1) ? 0 : carList.forEach((car) => car.draw());

  // carList.forEach((car) => car.draw());

  window.requestAnimationFrame(run);
}


$(function () {
  ctx.drawImage(roadImage, 0, 0, canvasWidth, canvasHeight);
  completeImage = new Uint32Array(ctx.getImageData(0, 0, canvasWidth, canvasHeight).data.buffer);
  createNewPopulation();
  // console.log(completeImage);
  // console.log(getImageDataFaster(100, 100));
  run();
});

// function Simulation() {

// }

