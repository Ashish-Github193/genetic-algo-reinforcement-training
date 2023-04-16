num_neurons = [5, 7, 7, 3];
num_layers = num_neurons.length;
input_shape = 5;

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
    return networks;
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
    this.generations = 0;
    this.population = [];

    this.CREATE_POPULATION = (size) =>
    {
        for (let index = 0; index < size; index++) {this.population.push(new Model(num_neurons, num_layers, input_shape));}
    }
    this.CREATE_POPULATION(population_size);
    
    this.CROSSOVER_MUTATION_NETWORKS = (fitnesses) =>
    {
        this.population = BubbleSort(fitnesses, this.population);
        let parent1 = this.population[0];
        let parent2 = this.population[1];
        let parent3 = new Model(num_neurons, num_layers, input_shape);
        let offsprings = [];

        shapes = [];
        for (let idx = 0; idx < parent1.weights.length; idx++)
        {
            shapes.push([parent1.weights[idx].length, parent1.weights[idx][0].length]);            
        }

        /*--------------------Flatten---------------------*/
        genes1 = parent1.weights.flat(2);
        genes2 = parent2.weights.flat(2);
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
            gene = [genes1, genes2][rand(1)];
            start = rand(0, size-1);

            child_gene_cm = gene.slice(0, start).concat(genes3.slice(start, start+length)).concat(gene.slice(start+length, ));
            
            parent3.weights = reshape(shapes, child_gene_cm);
            offsprings.push(parent3);
        }
        offsprings.push(parent1);
        offsprings.push(parent2);
        this.population = offsprings;
        this.generations += 1;
    }
    this.save_model = () => {
        this.population = BubbleSort(fitnesses, this.population);
        let model_1 = JSON.stringify(this.population[0].weights);
        let model_2 = JSON.stringify(this.population[1].weights);
        /// http request to server........
        
        return [model_1, model_2];
    }
}

function saveModelWeightsToServer(genetic_algo) {
    m1, m2 = genetic_algo.save_mode();

    const settings = {
        func : 'save-model-weights',
        serial: 1,
        model_1: m1,
        model_2: m2,
    }
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'php/main.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onload = () => {
        console.log(xhr.responseText);
    }
    xhr.send(JSON.stringify(settings));
}

// dat = [1, 2, 3, 4, 5];
// var genetic_algo = new GENETIC_ALGORITHM();
// start = Date.now();
// for (let idx = 0; idx < genetic_algo.population.length; idx++)
// {
//     console.log(genetic_algo.population[idx].predict(dat));
// }
// console.log("Execution ended in: ", Date.now()-start, " ms");
// genetic_algo.CROSSOVER_MUTATION_NETWORKS(genetic_algo.population[0], genetic_algo.population[1]);
