import numpy as np
from genetic_algorithm import *

# To output to file and terminal
# python3 -u ChumBucket/trainer/main.py | tee ChumBucket/trainer/Output.txt

"""
Note: If you are marking this and want to try run the genetic algorithm,
please do so on a copy of the Module and not on the original version.
Doing so will mess up the weights of the AI and cause its performance to break.
"""

start_over = False  # Set to False if continuing from existing data

last_gen = [
    [1.534, -0.047, 0.16, 0.839, 0.598, -0.412, -0.265, -0.081, 0.47, 2.791, 0.1],
    [0.011, 0.239, 0.16, 0.709, 0.598, -0.415, -1.07, -0.567, 0.222, 2.791, 0.1],
    [0.011, 0.458, 0.16, 0.709, 0.598, -0.415, -1.275, -0.567, 0.222, 2.791, 0.1],
    [0.261, 0.458, 0.16,  0.709, 0.598, -0.415, -0.854, -0.567, 0.222, 2.791, 0.1]
]


def train():
    # initial variables
    sol_per_pop = 25
    num_weights = 11
    start_gen = 0

    pop_size = (sol_per_pop, num_weights)
    new_population = np.random.choice(
        np.arange(-1, 1, step=0.01), size=pop_size, replace=True)

    # if continue training from previous session
    if start_over == False:
        parents = np.asarray(last_gen)
        offspring_crossover = crossover(parents, offspring_size=(
            pop_size[0] - parents.shape[0], num_weights))
        offspring_mutation = mutation(offspring_crossover)
        new_population[0:parents.shape[0], :] = parents
        new_population[parents.shape[0]:, :] = offspring_mutation
        start_gen = 0

    num_generations = 50
    num_parents_mating = 4

    # use genetic algorithm for every generation
    for generation in range(start_gen, num_generations):
        print('##############        GENERATION ' +
              str(generation) + '  ###############')
        # Measuring the fitness of each chromosome in the population.
        fitness = cal_pop_fitness(new_population)
        print('#######  fittest chromosome in generation ' +
              str(generation) + ' is having fitness value:  ', np.max(fitness))
        # Selecting the best parents in the population for mating.
        parents = select_mating_pool(
            new_population, fitness, num_parents_mating)

        # Generating next generation using crossover.
        offspring_crossover = crossover(parents, offspring_size=(
            pop_size[0] - parents.shape[0], num_weights))

        # Adding some variations to the offspring using mutation.
        offspring_mutation = mutation(offspring_crossover)

        # Creating the new population based on the parents and offspring.
        new_population[0:parents.shape[0], :] = parents
        new_population[parents.shape[0]:, :] = offspring_mutation


if __name__ == "__main__":
    train()
