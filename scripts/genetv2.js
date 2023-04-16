var num_neurons = $('#model-shape').text().split(",").map(ele => parseInt(ele));
var num_layers = num_neurons.length;
var input_shape = parseInt($('#model-input-shape').text());

function BubbleSort(cars, networks)
{    
    for(var i = 0; i < cars.length; i++)
    {
      for(var j = 0; j < ( cars.length - i -1 ); j++)
      {
        if(cars[j] < cars[j+1])
        {
          var temp = cars[j]
          cars[j] = cars[j + 1]
          cars[j+1] = temp

          var temp_net = networks[j];
          networks[j] = networks[j + 1];
          networks[j + 1] = temp_net;
        }
      }
    }
    // console.log(cars);
    return networks, cars;
}

function rand(min, max) {
    return Math.floor(Math.random() * (max
        ? (max - min + 1)
        : min + 1)) + (max
        ? min
        : 0);
}

function dot(array, matrix)
{  
    var final = [];
    for (let i = 0; i < matrix[0].length; i++)
    {
        final.push(0);
        for (let j = 0; j < matrix.length; j++)
        {
            final[i] +=  array[j] * matrix[j][i];
        }
    }
    return final;
}

function reshape(shapes, child_genes)
    {
        let start = 0;
        let weights = [];
        for (let shape = 0; shape < shapes.length; shape++)
        {
            let weight = [];
            for (let row = 0; row < shapes[shape][0]; row++)
            {
                weight.push(child_genes.slice(start, start+shapes[shape][1]));
                start += shapes[shape][1];
            }
            weights.push(weight);
        }
        return weights;
    }
/**
 * Class for creating a neural network.
 *
 * @param   {Array} num_neurons  Number of neurons per layer.
 * @param   {number} num_layers  Number of layers.
 * @param   {number} input_shape  Input shape of model. 
 * @returns {string} A useful value.
 */
function Model(num_neurons, num_layers, input_shape)
{
    this.num_neurons = num_neurons;
    this.num_layers = num_layers;
    this.input_shape = input_shape;

    this.weights = [];
    
    this.initialise = () =>
    {
        for (let index = 0; index < this.num_layers; index++)
        {
            if (index == 0) {this.weights.push(new Array(this.input_shape).fill(0).map(() => Array.from({length: this.num_neurons[index]}, () => Math.random() * [-1, 1][rand(1)])));}

            else {this.weights.push(new Array(this.num_neurons[index-1]).fill(0).map(() => Array.from({length: this.num_neurons[index]}, () => Math.random() * [-1, 1][rand(1)])));}
        }
    }

    this.sigmoid = (x) => 
    {
        for (let indexi = 0; indexi < x.length; indexi++)
        {
            x[indexi] = 1/(1+Math.exp(-x[indexi]));
        }
        return x;
    }
    
    this.relu = (x) =>
    {
        for (let indexi = 0; indexi < x.length; indexi++)
        {
            if (x < 0) x = 0;
        }
        return x;
    }

    this.forward_prop = (x) => 
    {
        var a = x;
        for (let index = 0; index < this.num_layers; index++)
        {
            z = dot(a, this.weights[index]);
            a = this.relu(z);
        }
        return a;
    }

    this.predict = (x) => {return this.forward_prop(x);}
    this.initialise();
}

function GENETIC_ALGORITHM(population_size=20, crossover_rate=.4, mutation_rate=.1, elite_networks=2)
{
    this.population_size = population_size;
    this.crossover_rate = crossover_rate;
    this.mutation_rate = mutation_rate;
    this.elite_networks = elite_networks;
    this.parent1 = new Model(num_neurons, num_layers, input_shape);
    this.parent2 = new Model(num_neurons, num_layers, input_shape);
    this.parent1_fitness = 0;
    this.parent2_fitness = 0;
    this.generations = 0;
    this.population = [];
    
    this.CROSSOVER_MUTATION_NETWORKS = (fitnesses, continue_saved_model=0) =>
    {         
        if (continue_saved_model == 0)
        {
            this.population, cars = BubbleSort(fitnesses, this.population);
            parent_1_idx = rand(0, this.elite_networks-1);
            do {parent_2_idx = rand(0, this.elite_networks-1);} while (parent_2_idx == parent_1_idx);

            this.parent1_fitness = cars[parent_1_idx];
            this.parent2_fitness = cars[parent_2_idx];

            this.parent1 = this.population[parent_1_idx];
            this.parent2 = this.population[parent_2_idx];
        }
        else {
            // for (model of this.population) {console.log(model.predict([1, 2, 3, 4, 5]))}
            // console.log("done");
        }

        let parent3 = new Model(num_neurons, num_layers, input_shape);
        let offsprings = [];

        shapes = [];
        for (let idx = 0; idx < this.parent1.weights.length; idx++)
        {
            shapes.push([this.parent1.weights[idx].length, this.parent1.weights[idx][0].length]);            
        }

        /*--------------------Flatten---------------------*/
        genes1 = this.parent1.weights.flat(2);
        genes2 = this.parent2.weights.flat(2);
        genes3 = parent3.weights.flat(2);

        /*--------------------Crossover---------------------*/
        length = Math.floor(genes1.length*this.crossover_rate);
        size = genes1.length - length;
        start = rand(0, size-1);

        child1_genes = genes2.slice(0, start).concat(genes1.slice(start, start+length).concat(genes2.slice(start+length, )));
        child2_genes = genes1.slice(0, start).concat(genes2.slice(start, start+length).concat(genes1.slice(start+length, )));
    
        /*--------------------Mutation---------------------*/
        length = Math.floor(genes1.length*this.mutation_rate);
        size = genes1.length - length;
        for (let ch = 0; ch < this.population.length-2; ch++)
        {
            let new_random_parent = new Model(num_neurons, num_layers, input_shape);
            random_parent_gene = new_random_parent.weights.flat(2);
            gene = [genes1, genes2][rand(1)];
            start = rand(0, size-1);

            child_gene_cm = gene.slice(0, start).concat(random_parent_gene.slice(start, start+length)).concat(gene.slice(start+length, ));
            
            new_random_parent.weights = reshape(shapes, child_gene_cm);
            offsprings.push(new_random_parent);
        }
        offsprings.push(this.parent1);
        offsprings.push(this.parent2);
        this.population = offsprings;
        this.generations += 1;
    }

    this.CREATE_POPULATION = (size=this.population_size, parent1_weights=null, parent2_weights=null) =>
    {
        this.population = []
        for (let index = 0; index < size; index++) {this.population.push(new Model(num_neurons, num_layers, input_shape));}
        
        if (parent1_weights != null && parent2_weights != null)
        {
            this.parent1.weights = parent1_weights;
            this.parent2.weights = parent2_weights;
            this.CROSSOVER_MUTATION_NETWORKS(Array.from({length: 2}, () => 0), continue_saved_model=1);
        }
    }
    this.CREATE_POPULATION(population_size);


    this.save_model = () => {
        // this.population = BubbleSort(fitnesses, this.population)
        let model_1 = this.parent1.weights.flat(2);
        let model_2 = this.parent2.weights.flat(2);
        /// http request to server........
        
        return [model_1, model_2, this.parent1_fitness, this.parent2_fitness];
    }
}

function saveModelWeightsToServer() {
    [m1, m2, m1f, m2f] = genetic_algo.save_model();

    m1s = m1.join(",");
    m2s = m2.join(",");
    // console.log(m1.join(","));
    // console.log(m2.join(","));

    const settings = {
        func : 'save-model-weights',
        serial: $("#model-id").text().slice(-1),
        model_1: m1s,
        model_2: m2s,
        fitness: m1f,
        generation: generation,
    }
    // console.log($("#model-id").text().slice(-1));
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '../php/main.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onload = () => {
        console.log(xhr.responseText);
    }
    xhr.send(JSON.stringify(settings));
}


// 5, [3, 4, 2]
// [[5, 3], [3, 4], [4, 2]]