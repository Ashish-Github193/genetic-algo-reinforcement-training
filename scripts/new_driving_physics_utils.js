// colours 

var blank_clr = getComputedStyle(document.documentElement).getPropertyValue('--blank-clr');
var accent_clr = getComputedStyle(document.documentElement).getPropertyValue('--accent-clr');
var side_clr = getComputedStyle(document.documentElement).getPropertyValue('--side-clr');
var extra_clr = getComputedStyle(document.documentElement).getPropertyValue('--extra-clr');
var font_clr = getComputedStyle(document.documentElement).getPropertyValue('--font-clr');
var light_font = getComputedStyle(document.documentElement).getPropertyValue('--light-clr');

// utility functions

function timeDiff(startTime, duration) {
    if (((Date.now() - startTime) >= duration)) {
        // console.log('duration is over');
        return true;
    } else return false;
}

function updateBestCarData(carList) {
    $("#generation-box").text(generation);
    let cars = carList;
    const car = findObjectWithMaxAttribute(cars, 'fitness');
    $("#fitness-box").text(roundNumber(car.fitness, 0));
    $("#population-box").text(cars.filter(car => car.state == 'start').length + "/" + population);
    if (fitnessList.length !== 0) {
        $("#last-gen-fitness-box").text(roundNumber(fitnessList.at(-1), 0));
    }else $("#last-gen-fitness-box").text(0);
}

function findObjectWithMaxAttribute(objects, attribute) {
    /**
     * Find the object with the maximum value of a given attribute in an array of objects.
     *
     * @param {Array} objects - Array of objects.
     * @param {string} attribute - Attribute name to compare.
     * @returns {Object|null} - Object with the maximum attribute value, or null if array is empty.
     */
    if (objects.length === 0) {
        return null; // Return null if the array is empty
    }

    return objects.reduce(function (maxObject, currentObject) {
        var maxAttributeValue = maxObject[attribute];
        var currentAttributeValue = currentObject[attribute];

        if (currentAttributeValue > maxAttributeValue) {
            return currentObject;
        } else {
            return maxObject;
        }
    });
}


function sortObjectsByAttribute(objects, attribute) {
    /**
     * Sort an array of objects by a given attribute.
     *
     * @param {Array} objects - Array of objects.
     * @param {string} attribute - Attribute name to sort by.
     * @returns {Array} - Sorted array of objects.
     */
    return objects.sort(function (a, b) {
        var attrA = a[attribute];
        var attrB = b[attribute];

        if (attrA < attrB) {
            return 1;
        }
        if (attrA > attrB) {
            return -1;
        }
        return 0;
    });
}


function CountLiveCars() {
    return carList.filter((car) => (car.state == 'start')).length;
}

function getControlData(cameraData) {
    // console.log(cameraData);
    controlData = [];
    for (let idx = 0; idx < genetic_algo.population.length; idx++) {
        if (cameraData[idx] != 0) {
            data = genetic_algo.population[idx].predict(cameraData[idx]);
            // data[0] < 0.5 ? (data[0] = 0) : (data[0] = 1);
            // console.log(data);
            if (data[0] < -0.5) { data[0] = 1; }
            else if (data[0] > 0.5) { data[0] = 2; }
            else { data[0] = 0; }

            if (data[1] < 0.2) { data[1] = 1; }
            else if (data[1] > 0.8) { data[1] = 2; }
            else { data[1] = 0; }
            // console.log(data);

        } else { data = [0, 0]; }
        controlData.push(data);
    }
    return controlData;
}

function CheckDeadCars() {
    let allStoppedStatus = carList.every((cars) => (cars.state == 'stop'));
    return allStoppedStatus;
}

function checkAliveCars() {
    return carList.filter(car => (car.state == 'start')).length;
}

function getImageDataFaster(x, y) {
    return completeImage[y * image_dim[0] + x];
}

function drawImage(image, x, y, r, scale) {
    ctx.setTransform(scale, 0, 0, scale, x, y);
    ctx.rotate(r);
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
    this.dot = function (other) {
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

function roundNumber(num, n) {
    let factor = Math.pow(10, n);
    return Math.round(num * factor) / factor;
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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

// Function to convert RGB color to HEX color
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// Helper function to convert a single color component to its hexadecimal value
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

// Function to convert HEX color to RGB color
function hexToRgb(hex) {
    var r = parseInt(hex.substring(1, 3), 16);
    var g = parseInt(hex.substring(3, 5), 16);
    var b = parseInt(hex.substring(5, 7), 16);
    // return "rgb(" + r + ", " + g + ", " + b + ")";
    op = Array(r, g, b);
    return op;
}

function matchByString(a, b) {
    if (typeof a != "string") {
        a = String(a);
    }
    if (typeof b != "string") {
        b = String(b);
    }
    if (a.length != b.length) {
        return false;
    } else {
        for (let i = 0; i < a.length; i++) {
            if (a[i] != b[i]) {
                return false;
            }
        }
        return true;
    }
}

function createNewPopulation() {
    modelInputShape = parseInt($('#model-input-shape').text());
    modelOneWeights = $('#model-one-weights').text().split(",").map(w => parseFloat(w));
    modelTwoWeights = $('#model-two-weights').text().split(",").map(w => parseFloat(w));
    // console.log(num_neurons);
    op = [];
    for (idx in num_neurons) {
        if (idx == 0) {
            op.push([input_shape, num_neurons[idx]]);
        } else {
            op.push([num_neurons[idx - 1], num_neurons[idx]]);
        }
    }
    opm1 = reshape(op, modelOneWeights);
    opm2 = reshape(op, modelTwoWeights);

    genetic_algo.CREATE_POPULATION(size = population, parent1_weights = opm1, parent1_weights = opm2);

    for (let i = 0; i < population; i++)
        carList.push(new Car(spawnPoint[0], spawnPoint[1]));
}


function createAndUpdateRealTimeChart(divId, labelX, labelY) {
    // const canvasId = divId + "-canvas"; // Create a unique canvas ID based on the div ID
    const ctx = document.getElementById(divId);
    
    const chartOptions = {
        responsive: true,
        animation: { duration: 100 },
        plugins: {
          title: { display: true, color: accent_clr },
          // colors: { forceOverride: true },
        },
      };

    const data = {
      labels: [],
      datasets: [
        {
          label: labelX + "-" + labelY,
          data: [],
          cubicInterpolationMode: "monotone",
          borderWidth: 5,
          borderColor: accent_clr,
          backgroundColor: side_clr,
          fill: true,
        },
      ],
    };
  
    const options = {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        title: {
          ...chartOptions.plugins.title,
          text: "",
        },
      },
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: labelX,
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: labelY,
            },
          },
        ],
      },
    };
  
    const chart = new Chart(ctx, {
      type: "line",
      data: data,
      options: options,
    });
  
    return {
      updateChartData: (y, x) => {
        chart.data.labels.push(x);
        chart.data.datasets[0].data.push(y);
        chart.update();
      },
    };
  }