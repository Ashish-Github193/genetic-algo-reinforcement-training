// $(function () {
//   $('#sliders input[type="range"]').each(function () {
//     var $slider = $(this);
//     var $label = $slider.prev();
//     $label.text(`${$label.text().split(":")[0]}: ${$slider.val()}`);
//     $slider.on('input', function () {
//       var value = $slider.val();
//       var min_value = $slider.attr('min');
//       var max_value = $slider.attr('max');
//       $label.text(`${$label.text().split(":")[0]}: ${value}`);
//       $slider.css('background', `linear-gradient(to right, #53898a 0%, #528485 ${((value - min_value) / (max_value - min_value)) * 100}%, #999 ${((value - min_value) / (max_value - min_value)) * 100}%, #999 100%)`);
//     }).trigger('input'); // Trigger the input event for each range input
//   });
// });

// function getSliderValues() {
//   var sliderValues = {};
//   $('#sliders input[type="range"]').each(function () {
//     var label = $(this).prev().text().split(":")[0];
//     var value = parseInt($(this).val());
//     sliderValues[label] = value;
//   });
//   return JSON.stringify(sliderValues);
// }

// // Define common chart options
// const chartOptions = {
//   responsive: true,
//   maintainAspectRatio: true,
//   aspectRatio: 2,
//   animation: { duration: 0 },
//   plugins: {
//     // title: { display: true, color: "#000000" },
//     title: { display: true, color: "#9BD0F5" },
//     // colors: { forceOverride: true },
//   },
// };

// // Define a function to create and update charts
// function createAndUpdateChart(canvasId, label, title) {
//   const canvas = document.getElementById(canvasId);
//   const ctx = canvas.getContext("2d");
//   const data = {
//     labels: Array.from({ length: 30 }, (_, i) => i + 1),
//     datasets: [
//       {
//         label,
//         data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100)),
//         borderColor: "rgb(0, 0, 0)",
//         // borderColor: "rgb(255, 99, 255)",
//         backgroundColor: "rgb(0, 0, 0)",
//         // backgroundColor: "#9BD0F5",
//         fill: false,
//       },
//     ],
//   };
//   const options = { ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: title } } };
//   const chart = new Chart(ctx, { type: "line", data, options });
//   setInterval(() => {
//     const newValue = Math.floor(Math.random() * 100);
//     chart.data.datasets[0].data.push(newValue);
//     chart.data.datasets[0].data.shift();
//     chart.update();
//   }, 1000);
// }

// // Create and update charts
// createAndUpdateChart("generationFitnessChart", "Fitness", "Fitness-Generation");
// createAndUpdateChart("speedGenerationChart", "Speed", "Speed-Generation");
// createAndUpdateChart("successRateOverGenerationsChart", "SuccessRate", "SuccessRate-Generations");

// baseCircle = $(".circle")
// circles = $(".mini_circle")

// baseCircle.click(() => {
//   circles.toggleClass("finished");
// })

// s_panel = $("#s-panel");
// slide_panel = $("#slide-panel");

// slide_panel.click(() => {
//   s_panel.toggleClass("closed");
// })

// v_panel = $("#v-panel");
// slide_v_panel = $("#slide-v-panel");

// slide_v_panel.click(() => {
//   v_panel.toggleClass("closed");
// })

// notch = $("#notch");
// option_menu = $("#option-menu");

// notch.click(() => {
//   option_menu.toggleClass("option-menu-clicked");
// })

var blank_clr = getComputedStyle(document.documentElement).getPropertyValue('--blank-clr');
var accent_clr = getComputedStyle(document.documentElement).getPropertyValue('--accent-clr');
var side_clr = getComputedStyle(document.documentElement).getPropertyValue('--side-clr');
var extra_clr = getComputedStyle(document.documentElement).getPropertyValue('--extra-clr');
var font_clr = getComputedStyle(document.documentElement).getPropertyValue('--font-clr');
var light_font = getComputedStyle(document.documentElement).getPropertyValue('--light-clr');


// jQuery code
$(document).ready(function () {

  $('#sliders input[type="range"]').each(function () {
    var $slider = $(this);
    var $label = $($slider.prev().children()[1]);
    $label.text(`${$slider.val()}`);
    $slider.on('input', function () {
      var value = $slider.val();
      var min_value = $slider.attr('min');
      var max_value = $slider.attr('max');
      $label.text(`${value}`);
      $slider.css('background', `linear-gradient(to right, var(--accent-clr) 0%, var(--accent-clr) ${((value - min_value) / (max_value - min_value)) * 100}%, var(--side-clr) ${((value - min_value) / (max_value - min_value)) * 100}%, var(--side-clr) 100%)`);
    }).trigger('input'); // Trigger the input event for each range input

    $slider.change(() => {
      console.log($slider.val());
      if ($slider.attr('id') == 'population-slider') {
        // code for population
        population = $slider.val();
        genetic_algo = new GENETIC_ALGORITHM(population_size = population, crossover_rate = crossoverRate / 100, mutation_rate = mutationRate / 10, elite_networks = 2);
        genetic_algo.CREATE_POPULATION(size = population, parent1_weights = genetic_algo.parent1.weights, parent2_weights = genetic_algo.parent2.weights);
        carList = Array.from({ length: population }, () => new Car(spawnPoint[0], spawnPoint[1]));
        // createNewPopulation();
      }

      if ($slider.attr('id') == 'crossover-rate-slider') {
        // code for crossover rate
        crossoverRate = $slider.val();
      }

      if ($slider.attr('id') == 'mutation-rate-slider') {
        // code for mutation rate
        mutationRate = $slider.val();
      }

      if ($slider.attr('id') == 'steering-const-slider') {
        // code for steering constant
        $sliderValue = steeringConstant = $slider.val() / 100;
        carList.forEach(car => car.steeringConstant = $sliderValue);
      }

      if ($slider.attr('id') == 'breaking-const-slider') {
        // code for breaking constant
        $sliderValue = breakingConstant = $slider.val() / 10;
      }

      if ($slider.attr('id') == 'max-velocity-slider') {
        // code for maximum velocity
        $sliderValue  = maxSpeed = $slider.val() / 10;
        carList.forEach(car => car.maxSpeed = $sliderValue);
      }

      if ($slider.attr('id') == 'min-velocity-slider') {
        // code for minimum velocity
        $sliderValue  = minSpeed = $slider.val() / 10;
        carList.forEach(car => car.minSpeed = $sliderValue);
      }

      if ($slider.attr('id') == 'acceleration-slider') {
        // code for acceleration
        $sliderValue = accelaration = $slider.val() / 1000;
        carList.forEach(car => car.accelaration = $sliderValue);
      }

      if ($slider.attr('id') == 'camera-length-slider') {
        // code for camera length
        $sliderValue = cameraRange = $slider.val();
        carList.forEach(car => car.cameras.forEach(camera => camera.maxRange = $sliderValue));
        console.log("camera length changed to: ", typeof $sliderValue);
      }
      
      if ($slider.attr('id') == 'camera-divergence-slider') {
        // code for camera divergence
        $sliderValue = cameraDivergence = $slider.val();
        carList.forEach((car, car_idx) => car.cameras.forEach((camera, camera_idx) => camera.maxRange = $sliderValue));
      }

      if ($slider.attr('id') == 'gen-life-time-slider') {
        // code for generation lifetime
        $sliderValue = $slider.val();
      }
    })
    // if ($slider.attr('id') == )

  });

  $('#slider-btn').on('click', function () {
    $('#graphs').hide(); // Hide graphs section
    $('#insights').hide(); // Hide insights section
    $('#settings').hide();
    $('#sliders').show(); // Show sliders section
    $('html, body').animate({ scrollTop: $('#sliders').offset().top }, 1000); // Smooth scroll to sliders section
    $(this).css('background-color', 'var(--accent-clr)'); // Change background color of slider button
    $(this).css('color', 'var(--blank-clr)'); // Change text color of slider button
    $('#graph-btn, #insight-btn, #simulation-settings-btn').css('background-color', ''); // Reset background color of other buttons
    $('#graph-btn, #insight-btn, #simulation-settings-btn').css('color', ''); // Reset text color of other buttons
  });

  // Click event handler for graph button
  $('#graph-btn').on('click', function () {
    $('#sliders').hide(); // Hide sliders section
    $('#insights').hide(); // Hide insights section
    $('#settings').hide();
    $('#graphs').css('display', 'grid'); // Show graphs section
    $('canvas.graph').height(300);
    $('canvas.graph').width(500);
    $('html, body').animate({ scrollTop: $('#graphs').offset().top }, 1000); // Smooth scroll to graphs section
    $(this).css('background-color', 'var(--accent-clr)'); // Change background color of graph button
    $(this).css('color', 'var(--blank-clr)'); // Change text color of graph button
    $('#slider-btn, #insight-btn, #simulation-settings-btn').css('background-color', ''); // Reset background color of other buttons
    $('#slider-btn, #insight-btn, #simulation-settings-btn').css('color', ''); // Reset text color of other buttons
  });

  // Click event handler for insight button
  $('#insight-btn').on('click', function () {
    $('#sliders').hide(); // Hide sliders section
    $('#graphs').hide(); // Hide graphs section
    $('#settings').hide();
    $('#insights').show(); // Show insights section
    $('html, body').animate({ scrollTop: $('#insights').offset().top }, 1000); // Smooth scroll to insights section
    $(this).css('background-color', 'var(--accent-clr)'); // Change background color of insight button
    $(this).css('color', 'var(--blank-clr)'); // Change text color of insight button
    $('#slider-btn, #graph-btn, #simulation-settings-btn').css('background-color', ''); // Reset background color of other buttons
    $('#slider-btn, #graph-btn, #simulation-settings-btn').css('color', ''); // Reset text color of other buttons
  });

  $('#simulation-settings-btn').on('click', function () {
    $('#sliders').hide(); // Hide sliders section
    $('#graphs').hide(); // Hide graphs section
    $('#insights').hide(); // Show insights section
    $('#settings').show(); // Show insights section
    $('html, body').animate({ scrollTop: $('#settings').offset().top }, 1000); // Smooth scroll to insights section
    $(this).css('background-color', 'var(--accent-clr)'); // Change background color of insight button
    $(this).css('color', 'var(--blank-clr)'); // Change text color of insight button
    $('#slider-btn, #graph-btn, #insight-btn').css('background-color', ''); // Reset background color of other buttons
    $('#slider-btn, #graph-btn, #insight-btn').css('color', ''); // Reset text color of other buttons
  });


  const chartOptions = {
    responsive: true,
    animation: { duration: 100 },
    plugins: {
      title: { display: true, color: accent_clr },
      // colors: { forceOverride: true },
    },
  };

  // Define a function to create and update charts
  function createAndUpdateChart(canvasId, label, title) {
    const ctx = document.getElementById(canvasId);
    // const ctx = canvas.getContext("2d");
    const data = {
      labels: Array.from({ length: 30 }, (_, i) => i + 1),
      datasets: [
        {
          label,
          data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 50)),
          cubicInterpolationMode: 'monotone',
          borderWidth: 5,
          borderColor: accent_clr,
          backgroundColor: side_clr,
          fill: true,
        },
      ],
    };
    const options = { ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: title } } };
    const chart = new Chart(ctx, { type: "line", data: data, options: options });
    setInterval(() => {
      const newValue = Math.floor(Math.random() * 100);
      chart.data.datasets[0].data.push(newValue);
      chart.data.datasets[0].data.shift();
      chart.update();
    }, 1000);
  }

  // Create and update charts
  createAndUpdateChart("generationFitnessChart", "Fitness", "Fitness-Generation");
  createAndUpdateChart("speedGenerationChart", "Speed", "Speed-Generation");
  createAndUpdateChart("successRateOverGenerationsChart", "SuccessRate", "SuccessRate-Generations");

  $("#pause-btn").click(() => {
    $('#pause-btn').css('background-color', '#f44');
    $('#start-btn').css('background-color', '');
    manual_steer_data = -1;
  });
  $("#start-btn").click(() => {
    $('#pause-btn').css('background-color', '');
    $('#start-btn').css('background-color', accent_clr);
    manual_steer_data = 0;
  });
  $("#next-gen-btn").click(() => {
    next = 1;
  });
  $("#restart-btn").click(() => {
    modelInputShape = parseInt($('#model-input-shape').text());
    modelOneWeights = $('#model-one-weights').text().split(",").map(w => parseFloat(w));
    modelTwoWeights = $('#model-two-weights').text().split(",").map(w => parseFloat(w));
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
    console.log(opm1, opm2);
    genetic_algo.CREATE_POPULATION(size = population, parent1_weights = opm1, parent1_weights = opm2);
    manual_steer_data = 0;
    next = 1;
    generation = 1;
  });
});

function car() {
  carList.forEach(car => console.log(car));
}