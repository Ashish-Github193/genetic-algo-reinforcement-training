



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
        population = parseInt($slider.val());
        // genetic_algo = new GENETIC_ALGORITHM(population_size = population, crossover_rate = crossoverRate / 100, mutation_rate = mutationRate / 10, elite_networks = 2);
        p1w = genetic_algo.parent1.weights;
        p2w = genetic_algo.parent2.weights;
        genetic_algo.CREATE_POPULATION(size = population, parent1_weights = p1w, parent2_weights = p2w);
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
        $sliderValue = maxSpeed = $slider.val() / 10;
        carList.forEach(car => car.maxSpeed = $sliderValue);
      }

      if ($slider.attr('id') == 'min-velocity-slider') {
        // code for minimum velocity
        $sliderValue = minSpeed = $slider.val() / 10;
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
        generationAliveTime = parseInt($slider.val()) * 1000;
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

  // setInterval(() => {
  //   // Generate random x and y coordinates
  //   const x = Math.floor(Math.random() * 30) + 1;
  //   const y = Math.floor(Math.random() * 50);

  //   // Update chart data with new coordinates
  //   chart1.updateChartData(x, y);
  //   chart2.updateChartData(x, y);
  //   chart3.updateChartData(x, y);
  // }, 1000);



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

  $("#save-model-to-db").click((event) => {
    console.log("model saved to databse");
    saveModelWeightsToServer();
    $("#bl-1").animate(
      {
        "width": '100%',
      },
      300,
      function () {
        $(this).width(0);
      }
    );

    // $('#next-gen-btn').click();
  });
  $('#show-camera-rays').click(function () {
    drawCameraRays = 1;
    $(this).addClass('active');
    $('#hide-camera-rays').removeClass('active');
  });
  $('#hide-camera-rays').click(function () {
    drawCameraRays = 0;
    $(this).addClass('active');
    $('#show-camera-rays').removeClass('active');
  });
  $('#show-car-velocity-vector').click(function () {
    drawVelocityVector = 1;
    $(this).addClass('active');
    $('#hide-car-velocity-vector').removeClass('active');
  });
  $('#hide-car-velocity-vector').click(function () {
    drawVelocityVector = 0;
    $(this).addClass('active');
    $('#show-car-velocity-vector').removeClass('active');
  });
  $('#show-car-detail-section').click(function () {
    drawExactDetails = 1;
    $(this).addClass('active');
    $('#hide-car-detail-section').removeClass('active');
  });
  $('#hide-car-detail-section').click(function () {
    drawExactDetails = 0;
    $(this).addClass('active');
    $('#show-car-detail-section').removeClass('active');
  });



  $('#pause-btn').click();

});

// function car() {
//   carList.forEach(car => console.log(car));
// }