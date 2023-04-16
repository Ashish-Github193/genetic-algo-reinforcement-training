var canvas = document.querySelector("#bg");
var canvasWidth = (canvas.width = window.innerWidth);
var canvasHeight = (canvas.height = window.innerHeight);
var ctx = canvas.getContext("2d", {
    willReadFrequently: true
});
var roadImage = document.getElementById("roadImage");
roadImage.onload = ctx.drawImage(roadImage, 0, 0, 1920, 1080);

var image_dim = [1920, 1080];
var completeImage = new Uint32Array(
    ctx.getImageData(0, 0, 1920, 1080).data.buffer
);

var completeImageArray = [];
var lastCalledTime = Date.now();
var trackBoundryColor = [255, 251, 0];
var spawnPoint = [341, 226];
var frameIndex = 0;
var population = 200;
var cameraData = [];
var controlData = [];
var carList = [];
var numberOfCamers = 7;
var live_cars = population;
var genetic_algo = new GENETIC_ALGORITHM(population, 0.4, 0.2, 2);
var flag = 0;

// cd = getImageDataFaster(322, 172, 1, 1, image_dim[0], image_dim[1], completeImage)[0];
// // console.log(cd & 0xff);
// console.log([(cd & 0xff), (cd >> 8 & 0xff), (cd >> 16 & 0xff)]);
//-----------------------------------------------car definition--------------------------------------//

function Car(x = 262, y = 165) {
    this.x = x;
    this.y = y;
    this.velocity = new vector(
        1 + rand(10) / 10,
        ([-1, 1][rand(1)] * rand(10)) / 10
    );
    this.state = "start";
    this.maxSpeed = 3.2;
    this.r = this.velocity.r;
    this.acceletation = 0.012;
    this.steeringConstant = 0.000005;
    this.breakingConstant = 0.005;
    this.steerData = [1, 0, 0];
    this.carImage = new Image();
    this.carImage.src = "../assets/car.png";
    this.width = this.carImage.width;
    this.height = this.carImage.height;
    this.cameraDivergence = Math.PI;
    this.numberOfCamers = numberOfCamers;
    this.cameraRange = 180;
    this.startTime = Date.now();
    this.cameras = [];
    this.cameraData = [];
    this.fitness = 0;
    this.isDead = 0;
    this.lowRefreshData = [this.fitness, 0];
    this.notMovedFrame = 0;

    for (let i = 0; i < this.numberOfCamers; i++) {
        this.cameras.push(
            new camera(
                this.x,
                this.y,
                this.r + this.cameraDivergence * (i / this.numberOfCamers - 1 / 2),
                this.cameraRange
            )
        );
        this.cameraData.push(0);
    }

    this.update = () => {
        if (!this.isDead) {
            this.velocity.mod < 0.08 ?
                (this.steeringConstant = 0.00075) :
                (this.steeringConstant = 0.05);

            if (this.velocity.magnitude < this.maxSpeed) {
                this.velocity = this.velocity.add(
                    this.velocity.unitVector().intensify(this.acceletation)
                );
                this.state = "start";
            } else {
                this.velocity = this.velocity.unitVector().intensify(this.maxSpeed);
            }

            if (this.steerData[0] && this.velocity.mod != 0) {
                if (
                    this.velocity.mod <
                    this.velocity.unitVector().intensify(this.breakingConstant).mod
                ) {
                    this.state = "stop";
                } else {
                    this.velocity = this.velocity.sub(
                        this.velocity.unitVector().intensify(this.breakingConstant)
                    );
                }
            }

            if (this.steerData[1]) {
                this.velocity = this.velocity.add(
                    this.velocity
                    .perp()
                    .intensify(-1 * this.steerData[1] * this.steeringConstant)
                );
            }

            if (this.steerData[2]) {
                this.velocity = this.velocity.add(
                    this.velocity
                    .perp()
                    .intensify(this.steerData[2] * this.steeringConstant)
                );
            }

            this.cameraData = [];

            for (i in this.cameras) {
                this.cameras[i].x = this.x;
                this.cameras[i].y = this.y;
                this.cameras[i].degree =
                    this.r +
                    this.cameraDivergence * (i / (this.numberOfCamers - 1) - 1 / 2);
                frameIndex % 3 ? 0 : this.cameras[i].update();
                let CamRange = this.cameras[i].range;
                this.cameraData.push(CamRange);
                if (CamRange <= 20) this.isDead = 1;
                else this.state = "start";
            }

            frameIndex % 3 ? ((this.lastX = this.x), (this.lastY = this.y)) : 0;

            if (
                Math.abs(this.x - this.lastX) < 0.8 &&
                Math.abs(this.y - this.lastY) < 0.8
            ) {
                this.notMovedFrame++;
            } else {
                this.notMovedFrame = 0;
            }
            if (this.notMovedFrame >= 75) this.isDead = 1;

            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.r = this.velocity.r;

            this.fitness += Math.floor(this.velocity.mod);

            // if (this.x + 25 >= canvas.width || this.x - 25 <= 0)
            // {
            //     this.isDead = 1;
            //     this.velocity = new vector(this.velocity.x * (-1), this.velocity.y);
            // }

            // if (this.y + 25 >= canvas.height || this.y - 25 <= 0)
            // {
            //     this.isDead = 1;
            //     this.velocity = new vector(this.velocity.x, this.velocity.y * (-1));
            // }
        }
    };

    this.calculateFitness = () => {
        return this.fitness;
    };

    this.draw = () => {
        if (!this.isDead) {
            ctx.setTransform(1, 0, 0, 1, this.x, this.y);
            this.velocity.draw(0, 0, 25);

            // ctx.fillStyle = '#fff';
            // ctx.strokeStyle = '#222';
            // ctx.lineWidth = 1;
            // ctx.rect(-1 * this.carImage.width - 200, -1 * this.carImage.height/2 + 2, 200, 20);
            // ctx.fill();
            // ctx.stroke();

            // if ((frameIndex%20==0))
            // {
            //     lengthData = [];
            //     for (i of this.cameraData) {
            //         lengthData.push(i[3]);
            //     }
            //     this.lowRefreshData[0] = this.fitness;
            // }

            // ctx.fillStyle = '#000';
            // ctx.font = "20px Arial";
            // ctx.fillText(this.lowRefreshData[0], -1 * this.carImage.width - 200, -1 * this.carImage.height/2 + 20);

            for (i in this.cameras) {
                this.cameras[i].draw();
            }
            drawImage(this.carImage, this.x, this.y, this.r, 1);
        }
    };
}

//------------------------------------------------camera definitions---------------------------------//

function camera(carX, carY, degree, range) {
    this.x = carX;
    this.y = carY;
    this.maxRange = range;
    this.range = 10.0;
    this.degree = degree;

    this.draw = () => {
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(
            this.range * Math.cos(this.degree),
            this.range * Math.sin(this.degree),
            1,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // ctx.strokeStyle = '#fff';
        // ctx.lineWidth = 1;
        // ctx.beginPath();
        // ctx.moveTo(0, 0);
        // ctx.lineTo(this.range * Math.cos(this.degree), this.range * Math.sin(this.degree));
        // ctx.stroke();
    };

    this.checkWallCollision = () => {
        this.range = 10.0;
        while (this.range < this.maxRange) {
            x = parseInt(this.x + this.range * Math.cos(this.degree));
            y = parseInt(this.y + this.range * Math.sin(this.degree));
            // colorData = ctx.getImageData(x, y, 1, 1);
            colorData = getImageDataFaster(x, y);
            // console.log(colorData);
            // console.log(x, y, [(colorData & 0xff), (colorData >> 8 & 0xff), (colorData >> 16 & 0xff)]);
            if (
                (colorData & 0xff) === trackBoundryColor[0] &&
                ((colorData >> 8) & 0xff) === trackBoundryColor[1] &&
                ((colorData >> 16) & 0xff) === trackBoundryColor[2]
            ) {
                break;
            } else {
                this.range += 1;
            }
        }
    };

    this.update = () => {
        this.checkWallCollision();
    };
}

function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

var steer = 1;

for (let i = 0; i < population; i++) {
    carList.push(new Car(spawnPoint[0], spawnPoint[1]));
}
//----------------------------------------controls-------------------------------------------------//
onresize = resize;
onkeydown = controlKey;
onkeyup = () => {
    steer = 0;
};
next = 0;

//----------------------------------------mainLoop--------------------------------------------------//
controlData = getControlDataDummy();

function run() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(roadImage, 0, 0, 1920, 1080);
    cameraData = [];

    if (CheckDeadCars() || next) {
        fitnesses = [];
        for (let idx = 0; idx < carList.length; idx++) {
            fitnesses.push(carList[idx].calculateFitness());
        }
        carList = Array.from({
                length: population
            },
            () => new Car(spawnPoint[0], spawnPoint[1])
        );
        frameIndex = 0;
        genetic_algo.CROSSOVER_MUTATION_NETWORKS(fitnesses);
        next = 0;
    } else {
        for (carIndex in carList) {
            if (!(steer == -1)) {
                let thisCar = carList[carIndex];
                if (!thisCar.isDead) {
                    cameraData.push(thisCar.cameraData);
                    thisCar.update();
                } else cameraData.push(0);

                thisCar.steerData = controlData[carIndex];
            }
            carList[carIndex].draw();
        }

        if (!(steer == -1)) {
            controlData = getControlData(cameraData);
            console.log("Control Data: " + controlData);
            frameIndex++;
        }
    }

    live_cars = CountLiveCars();
    if (frameIndex % 10 === 0) {
        delta = (Date.now() - lastCalledTime) / 10000;
        showLegend(Math.floor(1 / delta));
        lastCalledTime = Date.now();
    }

    requestAnimationFrame(run);
    // flag = 1;
}
// sleep(100);
window.onload = run;

//---------------------------------------utility functions------------------------------------------//
function CheckDeadCars() {
    isDeads = 0;
    for (let idx = 0; idx < carList.length; idx++) {
        if (carList[idx].isDead) {
            isDeads += 1;
        }
    }
    if (isDeads == carList.length) return true;
    else return false;
}

function getControlData(cameraData) {
    controlData = [];
    for (let idx = 0; idx < genetic_algo.population.length; idx++) {
        if (cameraData[idx] != 0) {
            data = genetic_algo.population[idx].predict(cameraData[idx]);
            data[0] < 0.5 ? (data[0] = 1) : (data[0] = 0);
            data[1] > data[2] ?
                ((data[1] = 1), (data[2] = 0)) :
                ((data[1] = 0), (data[2] = 1));
        } else {
            data = [0, 0, 0];
        }
        controlData.push(data);
    }
    return controlData;
}

var getImageDataFaster = (x, y) => completeImage[y * image_dim[0] + x];

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    x = evt.clientX - rect.left;
    y = evt.clientY - rect.top;
    cd = getImageDataFaster(x, y);
    // console.log(cd);
    console.log(x, y, [cd & 0xff, (cd >> 8) & 0xff, (cd >> 16) & 0xff]);
}

function getControlDataDummy() {
    controlData = [];
    for (let i = 0; i < population; i++) {
        controlData.push([0, 0, 0]);
    }
    return controlData;
}

function roundToNDecimalPlaces(number, n) {
    return Math.round(number * 10 ** n) / 10 ** n;
}

function drawImage(image, x, y, r, scale) {
    ctx.setTransform(scale, 0, 0, scale, x, y);
    ctx.rotate(r + Math.PI);
    ctx.drawImage(image, (-1 * image.width) / 2, (-1 * image.height) / 2);
}

function vector(x, y) {
    this.x = x;
    this.y = y;
    this.mod = this.magnitude = Math.sqrt(this.x ** 2 + this.y ** 2);
    this.r =
        Math.sign(this.x) == -1 ?
        Math.PI - Math.asin(this.y / this.mod) :
        Math.asin(this.y / this.mod);
    this.unitVector = () => {
        return new vector(x / this.mod, y / this.mod);
    };
    this.perp = () => {
        return new vector(-this.y, this.x);
    };
    this.dot = function(other) {
        return this.x * other.x + this.y * other.y;
    };
    this.add = (other) => {
        return new vector(this.x + other.x, this.y + other.y);
    };
    this.sub = (other) => {
        return new vector(this.x - other.x, this.y - other.y);
    };
    this.intensify = (amt) => {
        return new vector(amt * this.x, amt * this.y);
    };
    this.draw = (x0, y0, length = 10) => {
        ctx.strokeStyle = "#f00";
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(x0, y0);
        ctx.lineTo(x0 + this.x * length, y0 + this.y * length);
        ctx.stroke();
    };
}

function rand(min, max) {
    return (
        Math.floor(Math.random() * (max ? max - min + 1 : min + 1)) +
        (max ? min : 0)
    );
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function controlKey(e = window.event) {
    e.key === " " ? (steer = -1) : (steer = 1);
    e.key === "ArrowRight" ? (next = 1) : (next = 0);
}

function CountLiveCars() {
    return carList.filter((car) => !Boolean(car.isDead)).length;
}

function showLegend(fps) {
    document.getElementById("fps").innerText = "FamePerSec " + fps;

    document.getElementById("gen").innerHTML =
        "Generation: " + genetic_algo.generations;

    document.getElementById("pop").innerHTML = "Population: " + live_cars;
}

function drawBanner(timeTaken) {
    document.getElementById("time").innerText =
        "time taken : " + timeTaken + " seconds";
    document.getElementById("heading").innerText = "Finished";
}