var ctrl_panel_slider = $("#control_panel_slider");
ctrl_panel_slider.html("<i class='fa fa-angle-down' aria-hidden='true'></i>");
var crtl_panel_status = 1;
var currentModel = 'temp';

ctrl_panel_slider.mouseenter(function () {

    $("#control_panel").css("transform", "translate(0, 0%)");
    $("#bg").css("background-color", getComputedStyle(document.documentElement).getPropertyValue('--th-pri-cld'));
    ctrl_panel_slider.html("<i class='fa fa-angle-down' aria-hidden='true'></i>");
    $(".layer").css("border-color", getComputedStyle(document.documentElement).getPropertyValue('--th-pri-clr'));

    // clearInterval(refresh);
    const canvas = document.getElementById("bg");
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    $(".node").addClass("disabled_node");

    crtl_panel_status++;

})

$("#control_panel").mouseenter(function () {

    $("#control_panel").css("transform", "translate(0, 0%)");
    $("#bg").css("background-color", getComputedStyle(document.documentElement).getPropertyValue('--th-pri-cld'));
    ctrl_panel_slider.html("<i class='fa fa-angle-down' aria-hidden='true'></i>");
    $(".layer").css("border-color", getComputedStyle(document.documentElement).getPropertyValue('--th-pri-clr'));

    // clearInterval(refresh);
    const canvas = document.getElementById("bg");
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    $(".node").addClass("disabled_node");

    crtl_panel_status++;

}).mouseleave(function () {
    $("#control_panel").css("transform", "translate(0, 98%)");
    if (!menuWindowState)
        $("#bg").css("background-color", getComputedStyle(document.documentElement).getPropertyValue('--th-pri-clr'));
    ctrl_panel_slider.html("<i class='fa fa-angle-up' aria-hidden='true'></i>");
    $("#num").text(0);
    $(".layer").css("border-color", "transparent");

    if (edit_status % 2 != 0)
        $(".node.active").removeClass("disabled_node");
    else
        $(".node").removeClass("disabled_node");
    activationFunctions.forEach((element_) => $('#' + element_).removeClass('active'));
    updateConnections();
})

$('#menu-button').click(() => {
    menuWindowState === 0 ? $('#menu-window').css('transform', 'translate(-50%, -50%)') : $('#menu-window').css('transform', 'translate(-200%, -50%)');
    menuWindowState === 0 ? $('#bg').css('background-color', getComputedStyle(document.documentElement).getPropertyValue('--th-pri-cld')) : $('#bg').css('background-color', getComputedStyle(document.documentElement).getPropertyValue('--th-pri-clr'));
    menuWindowState === 0 ? menuWindowState = 1 : menuWindowState = 0;
    $('#menu-button').toggleClass('clicked');
});

menuOptionState = [1, 0, 0];

if (menuOptionState[0] === 1) {
    $('#general').toggleClass('active-items');
}
else if (menuOptionState[1] === 1) {
    $('#theme').toggleClass('active-items');
}
else if (menuOptionState[2] === 1) {
    $('#settings').toggleClass('active-items');
}

$('#general').click(() => {
    if (menuOptionState[0] === 0) {

        $('#general-content').css('display', 'flex'); // show general content
        $('#theme-content').css('display', 'none'); // hide theme content
        $('#settings-content').css('display', 'none'); // hide settings content

        $('#general').addClass('active-items');
        $('#theme').removeClass('active-items');
        $('#settings').removeClass('active-items');

        menuOptionState = [1, 0, 0];
    }
});

$('#create-new-model').click((e) => {
    console.log('create new model');
    let modelLength = $('.general-content-model').length + 1;
    const template = '<div id="model-list' + modelLength + '" class="general-content-model"><div class="ml-info"><div class="ml-primary-info"><div id="sno' + modelLength + '" class="ml-sno ml-name">t_' + modelLength + '.</div><div id="name' + modelLength + '" class="ml-name ml-name">temp_model_' + modelLength + '</div></div><div class="ml-secondary-info"><div id="nol' + modelLength + '" class="ml-nol ml-name">0 layers</div><div id="fitness' + modelLength + '" class="ml-fit ml-name">0</div><div id="fitness' + modelLength + '" class="ml-fit ml-name">0</div></div></div><div class="ml-operations"><div id="delete' + modelLength + '" class="ml-ops ml-ops-del-btn" onclick="deleteModel(\'' + modelLength + '\')">delete</div></div></div>';
    $(template).insertBefore("div.general-content-new-model");
});

function deleteModel(e) {
    console.log(e);
    $('#model-list' + e).css('display', 'none');
    /////////////////////////////////
    // to be continued....
}



function refreshModelData() {
    for (let idx = 1; idx <= $('.general-content-model').length; idx++) {
        [sno_, name_, nol_, fitness_, generation_] = getModelDataById(idx);
        modelData[sno_] = [name_, nol_.slice(0, 1), fitness_, generation_];
    }
    console.log(modelData);
}

function getModelDataById(id) {
    const sno = document.getElementById('sno' + id).textContent.trim();
    const name = document.getElementById('name' + id).textContent.trim();
    const nol = document.getElementById('nol' + id).textContent.trim();
    const fitness = document.getElementById('fitness' + id).textContent.trim();
    const generation = document.getElementById('generation' + id).textContent.trim();

    return Array(sno, name, nol, fitness, generation);
}

function getModelWeights() {
    const settings = {
        func: 'get-model-weights',
    }
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'php/main.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onload = () => {
        console.log(xhr.responseText);
    }
    xhr.send(JSON.stringify(settings));
}





$('#settings').click(() => {
    if (menuOptionState[2] === 0) {
        $('#general-content').css('display', 'none');
        $('#theme-content').css('display', 'none');
        $('#settings-content').css('display', 'flex'); // show general content

        $('#settings').addClass('active-items');
        $('#theme').removeClass('active-items');
        $('#general').removeClass('active-items');

        menuOptionState = [0, 0, 1];
    }
});

$('#theme').click(() => {
    if (menuOptionState[1] === 0) {
        $('#general-content').css('display', 'none');
        $('#theme-content').css('display', 'grid'); // show theme content
        $('#settings-content').css('display', 'none');

        $('#theme').addClass('active-items');
        $('#general').removeClass('active-items');
        $('#settings').removeClass('active-items');

        menuOptionState = [0, 1, 0];
    }
});

// Background, Foreground, Border
var themes = [
    ['#001824', '#012536', '#ffb703'],
    ['#379237', '#10240a', '#F0FF42'],
    ['#4D77FF', '#112530', '#5EE6EB'],
    ["#00213E", "#003A54", "#FF5733"],
    ["#000000", "#1f271b", "#f9c80e"],
    ["#000000", "#000000", "#ff6b6b"],
    ["#000000", "#3a3f44", "#eb984e"],
    ["#f94144", "#301608", "#f9c74f"],
    ["#1a1a1a", "#4d4d4d", "#f2f2f2"],
]

var defaultThemes = $('#theme-content').children().length - 1;

function addThemes() {
    for (i in themes) {
        colors = themes[i];
        const cover = document.createElement('div');
        const banner = document.createElement('div');
        cover.classList.add('theme');
        cover.id = 'theme' + defaultThemes;
        banner.classList.add('theme-banner');
        banner.id = 'th-banner' + defaultThemes;
        cover.append(banner);
        cover.style.backgroundColor = themes[i][0];
        banner.style.backgroundColor = themes[i][1];
        banner.style.borderColor = themes[i][2];
        cover.addEventListener('click', (event) => {
            const element = event.target;
            const themeIndex = element.id.slice(-1);
            $(':root').css('--th-pri-clr', themes[themeIndex][1]);
            $(':root').css('--th-pri-cld', darkenColor(themes[themeIndex][1], 80));
            $(':root').css('--th-brd-clr', themes[themeIndex][2]);
            $('#bg').css('background-color', getComputedStyle(document.documentElement).getPropertyValue('--th-pri-cld'))

            current_theme = themes[themeIndex];
            activation_button_update();
            updateConnections();
        });

        $('#theme-content').append(cover);
        defaultThemes++;
    }
}

addThemes();

$('.ml-name').click((e) => {
    let currentElement = e;
    currentElement.innerHTML = '<input type=\'text\' id=\'' + currentElement.id + 'text\' class=\'change-model-name\' placeholder=\'enter new name\' >';
});

global_activation = '#relu_';
function set_global_activation(id) {
    if ((global_activations).some((activation) => activation != id)) {
        allGlobalActivations.forEach((activation) => { $(activation).css({ 'background': 'transparent', 'color': current_theme[2] }); })
        $(id).css("background-color", current_theme[2]);
        $(id).css("color", current_theme[1]);
        global_activations = global_activations.map(() => id);
        refreshNodes();
    }
    else {
        allGlobalActivations.forEach((activation) => { $(activation).css({ 'background': 'transparent', 'color': current_theme[2] }); });
    }
}


$('#sub-1').click(() => { changePopulation(parseInt($('#num-1').text()), -1) });
$('#add-1').click(() => { changePopulation(parseInt($('#num-1').text()), 1) });
$('#sub-2').click(() => { changeCrossOverRate(parseInt($('#num-2').text()), -1) });
$('#add-2').click(() => { changeCrossOverRate(parseInt($('#num-2').text()), 1) });
$('#sub-3').click(() => { changeMutationRate(parseInt($('#num-3').text()), -1) });
$('#add-3').click(() => { changeMutationRate(parseInt($('#num-3').text()), 1) });
$('#sub-4').click(() => { changeNumberOfElites(parseInt($('#num-4').text()), -1) });
$('#add-4').click(() => { changeNumberOfElites(parseInt($('#num-4').text()), 1) });
$('#sub-6').click(() => { switchGlobalActivationSelection(parseInt($('#num-6').text()), -1) });
$('#add-6').click(() => { switchGlobalActivationSelection(parseInt($('#num-6').text()), 1) });
$('#sub-7').click(() => { showCustomTrackFunction(parseInt($('#num-7').text()), -1) });
$('#add-7').click(() => { showCustomTrackFunction(parseInt($('#num-7').text()), 1) });
$('#sub-8').click(() => { changeCameraLength(parseInt($('#num-8').text()), -5) });
$('#add-8').click(() => { changeCameraLength(parseInt($('#num-8').text()), 5) });
$('#sub-9').click(() => { changeCameraDivergence(parseInt($('#num-9').text()), -5) });
$('#add-9').click(() => { changeCameraDivergence(parseInt($('#num-9').text()), 5) });
$('#sub-10').click(() => { changeCameraNumber(parseInt($('#num-10').text()), -1) });
$('#add-10').click(() => { changeCameraNumber(parseInt($('#num-10').text()), 1) });
$('#sub-11').click(() => { changeGenerationTime(parseInt($('#num-11').text()), -10) });
$('#add-11').click(() => { changeGenerationTime(parseInt($('#num-11').text()), 10) });



function changePopulation(current, changeBy, min = 5, max = 100) {
    if ((current < max) && (changeBy > 0)) {
        current += changeBy;
    }
    if ((current > min) && (changeBy < 0)) {
        current += changeBy;
    }
    $('#num-1').text(current);
    saveSimulationSettings();
}

function showCustomTrackFunction(current, changeBy, min = 0, max = 1) {
    if ((current < max) && (changeBy > 0)) {
        current += changeBy;
    }
    if ((current > min) && (changeBy < 0)) {
        current += changeBy;
    }
    $('#num-7').text(current);
    if (current) {
        $('#custom-track-function1').css('display', 'flex');
    } else {
        $('#custom-track-function1').css('display', 'none');
    }
    console.log('value should be: ' + current);
    saveSimulationSettings();
}

function changeCrossOverRate(current, changeBy, min = 1, max = 100) {
    if ((current < max) && (changeBy > 0)) {
        current += changeBy;
    }
    if ((current > min) && (changeBy < 0)) {
        current += changeBy;
    }
    $('#num-2').text(current);
    saveSimulationSettings();
}

function changeMutationRate(current, changeBy, min = 1, max = 100) {
    if ((current < max) && (changeBy > 0)) {
        current += changeBy;
    }
    if ((current > min) && (changeBy < 0)) {
        current += changeBy;
    }
    $('#num-3').text(current);
    saveSimulationSettings();
}

function changeNumberOfElites(current, changeBy, min = 1, max = simulationSettings['population_size']) {
    if ((current < max) && (changeBy > 0)) {
        current += changeBy;
    }
    if ((current > min) && (changeBy < 0)) {
        current += changeBy;
    }
    $('#num-4').text(current);
    saveSimulationSettings();
}

function switchGlobalActivationSelection(current, changeBy, min = 0, max = 1) {
    if ((current < max) && (changeBy > 0)) {
        current += changeBy;
    }
    if ((current > min) && (changeBy < 0)) {
        current += changeBy;
    }
    $('#num-6').text(current);

    if (current == 1) {
        $('#global-activation-function').css('display', 'flex');
    }
    else {
        $('#global-activation-function').css('display', 'none');
    }
    saveSimulationSettings();
}

function changeCameraLength(current, changeBy, min = 50, max = 300) {
    if ((current < max) && (changeBy > 0)) {
        current += changeBy;
    }
    if ((current > min) && (changeBy < 0)) {
        current += changeBy;
    }
    $('#num-8').text(current);
    saveSimulationSettings();
}

function changeCameraDivergence(current, changeBy, min = 90, max = 180) {
    if ((current < max) && (changeBy > 0)) {
        current += changeBy;
    }
    if ((current > min) && (changeBy < 0)) {
        current += changeBy;
    }
    $('#num-9').text(current);
    saveSimulationSettings();
}

function changeCameraNumber(current, changeBy, min = 3, max = 10) {
    if (currentModel == 'temp') {
        if ((current < max) && (changeBy > 0)) {
            current += changeBy;
        }
        if ((current > min) && (changeBy < 0)) {
            current += changeBy;
        }
        $('#num-10').text(current);
        saveSimulationSettings();
    }
}

function changeGenerationTime(current, changeBy, min = 10, max = 300) {
    if ((current < max) && (changeBy > 0)) {
        current += changeBy;
    }
    if ((current > min) && (changeBy < 0)) {
        current += changeBy;
    }
    $('#num-11').text(current);
    saveSimulationSettings();
}


function triggerMainUploadButton() {
    $("#track-img-upload-btn").click();
}

$('#track-img-upload-btn, #track-preview').on("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.addEventListener("load", function () {
            $('.preview-wrapper')[0].style.display = 'block';
            $('#psudo-track-img-upload-btn').css('display', 'none');
            $('#upload').css('display', 'block');
            $('#track-preview')[0].setAttribute("src", this.result);
            customTrackImage = this.result;
            showAlert('Image saved', '', false, 1000);
        });
        reader.readAsDataURL(file);
    } else {
        $('#track-preview')[0].setAttribute("src", "#");
    }
});

function saveSimulationSettings() {
    simulationSettings['population_size'] = $('#num-1').text();
    simulationSettings['crossover_rate'] = $('#num-2').text();
    simulationSettings['mutation_rate'] = $('#num-3').text();
    simulationSettings['number_of_elite_networks'] = $('#num-4').text();
    simulationSettings['camera_length'] = $('#num-8').text();
    simulationSettings['camera_divergence'] = $('#num-9').text();
    simulationSettings['camera_number'] = $('#num-10').text();
    simulationSettings['generation_alive_time'] = $('#num-11').text();
    simulationSettings['global_activation'] = global_activation;
    saveSimulationInSessionStorage();
}

function defaultSimulationSettings() {
    simulationSettings['population_size'] = 20;
    simulationSettings['crossover_rate'] = 50
    simulationSettings['mutation_rate'] = 20;
    simulationSettings['number_of_elite_networks'] = 2;
    simulationSettings['camera_length'] = 250;
    simulationSettings['camera_divergence'] = 180;
    simulationSettings['camera_number'] = 5;
    simulationSettings['generation_alive_time'] = 30;
    simulationSettings['global_activation'] = 'relu';
    $('#num-1').text(simulationSettings['population_size']);
    $('#num-2').text(simulationSettings['crossover_rate']);
    $('#num-3').text(simulationSettings['mutation_rate']);
    $('#num-4').text(simulationSettings['number_of_elite_networks']);
    $('#num-8').text(simulationSettings['camera_length']);
    $('#num-9').text(simulationSettings['camera_divergence']);
    $('#num-10').text(simulationSettings['camera_number']);
    $('#num-11').text(simulationSettings['generation_alive_time']);
    saveSimulationInSessionStorage();
}

function saveSimulationInSessionStorage() {
    let settings = {
        func: 'session-save',
        data: JSON.stringify(simulationSettings)
    }
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'php/main.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onload = () => {
        console.log(xhr.responseText);
    }

    xhr.send(JSON.stringify(settings));
}

function loadModel(idx) {
    const row = $(`#model-list${idx}`);
    const id = row.find('.ml-sno').text();
    const name = row.find('.ml-name').text();
    const settings = {
        func: 'load-shape-weights',
        id: id,
        name: name,
    }
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'php/main.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        $('#main').html(data.template);
        updateConnections();
        // console.log(data.template);
    }
    xhr.send(JSON.stringify(settings));
}






$(document).ready(() => {
    // saveSimulationSettings();
});







