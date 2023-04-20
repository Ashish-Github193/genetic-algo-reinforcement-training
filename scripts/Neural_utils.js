// ---------------------------------------------- Global Variables --------------------------//
var population, crossoverRate, mutationRate, numberOfElites, earlyStopping, customTrackImage, customStrartCoordinates, customBoundryColor;
var global_activations = [];
var shape = [];
var global_activation = "#relu_";
var allGlobalActivations = ['#relu_', '#sigmoid_', '#tanh_'];
var activationFunctions = ['relu', 'tanh', 'sigmoid'];
var menuWindowState = 0;
var NumberOfLayers = document.getElementById("main").children.length - 2;
var current_theme = ['#001824', '#012536', '#ffb703'];
var modelData = {};

var edit_status, currentLayer;

var simulationSettings = {
    'population_size': 50,
    'crossover_rate': 50,
    'mutation_rate': 20,
    'number_of_elite_networks': 2,
    'camera_length': 250,
    'camera_divergence': 180,
    'camera_number': 5,
    'generation_alive_time': 30,
    'global_activation': JSON.stringify(global_activations),
}


$(global_activation).css("background-color", current_theme[2]);
$(global_activation).css("color", current_theme[1]);

$(":root").css("--th-pri-cld", darkenColor(getComputedStyle(document.documentElement).getPropertyValue('--th-pri-clr'), 80));

function drawLine([x1, y1], [x2, y2], color, thickness) {
    const canvas = document.getElementById("bg");
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function Connection(layer1, layer2) {
    try {
        var childs1 = document.getElementById(layer1).childNodes;
        var childs2 = document.getElementById(layer2).childNodes;
    }
    catch { return ""; }

    for (child1 of childs1) {
        if (child1.nodeName != "#text" && child1.classList.contains("active_node"))
            for (child2 of childs2) {
                if (child2.nodeName != "#text" && child2.classList.contains("active_node")) {
                    var xy1 = child1.getBoundingClientRect();
                    var w1 = child1.offsetWidth;
                    var h1 = child1.offsetHeight;
                    var w2 = child2.offsetWidth;
                    var h2 = child2.offsetHeight;
                    var xy2 = child2.getBoundingClientRect();
                    drawLine([xy1.left + w1, xy1.top + h1], [xy2.left + w2, xy2.top + h2], current_theme[2], 1);
                    // console.log('if chal rha hai');
                }
            }
    }
}

function darkenColor(hex, percent) {
    // Convert hex color to RGB values
    const red = parseInt(hex.substring(1, 3), 16);
    const green = parseInt(hex.substring(3, 5), 16);
    const blue = parseInt(hex.substring(5, 7), 16);

    // Reduce RGB values by percentage
    const redDarkened = Math.floor(red * (100 - percent) / 100);
    const greenDarkened = Math.floor(green * (100 - percent) / 100);
    const blueDarkened = Math.floor(blue * (100 - percent) / 100);

    // Convert darkened RGB values back to hex format
    const darkenedHex = "#" + ((1 << 24) + (redDarkened << 16) + (greenDarkened << 8) + blueDarkened).toString(16).slice(1);
    return darkenedHex;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showAlert(heading, para, btnFuntion = 0, timeToStay = 1000) {
    $('#alert > h4').text(heading);
    $('#alert > p').text(para);
    if (btnFuntion) {
        $('#alert > button').click(btnFuntion);
        $('#alert > button').css('display', 'block');
        $('#alert > button').text('learn more');
    }
    
    $('#alert-box').css('transform', 'translateX(-10%)');

    (para.split(' ').length = 0) ? timeToStay = para.split(' ').length * 500 : 0;

    $('#alert-loader').animate(
        {
            'width': 0
        }, timeToStay - 100);

    setTimeout(() => {
        $('#alert-box').css('transform', 'translateX(110%)');
    }, timeToStay);

}

showAlert('hello', 'welcome to nural-network driven car simulation', () => { console.log('none') }, 2000);


function findNumberOfLayers() {
    return $('#main').children().length - 2;
}

function findModelShape() {
    children = $('#main').children();
    shape = [];
    for (idx in global_activations) {
        let actives = 0;
        layer = children[parseInt(idx)+1];
        nodes = $(layer).children();
        nodes.each((idx, node) => {
            if ($(node).hasClass('active_node')) {
                actives++;
            }
        });
        shape.push(actives);
    }
    return shape;
}

function findModelActivation() {
    children = $('#main').children();
    let activations = [];
    children.each((idx, child) => {
        activationFunctions.forEach(activation => {
            ($(child).hasClass(activation)) ? activations.push(activation) : 0;
        });
    });
    return activations;
}