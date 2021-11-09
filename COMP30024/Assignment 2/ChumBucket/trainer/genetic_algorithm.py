import random
import subprocess
import numpy as np

"""
NOTE: The code in this file is highly based off of code by Ahmed Gad
on his article about Genetic Algorithms. The article can be found at
https://towardsdatascience.com/genetic-algorithm-implementation-in-python-5ab67bb124a6

The code has been modified for use in this project, primarily the
cal_pop_fitness function
"""


def cal_pop_fitness(pop):
    # calculate fitness score by playing the game
    fitness = []
    for i in range(pop.shape[0]):
        fit = 0

        # write weights to file to be used by eval function
        with open("ChumBucket/trainer/weights.txt", "w") as f:
            for s in pop[i]:
                f.write(str(s) + "\n")

        for j in range(30):
            players = ["ChumBucket", "SmartGreedy"]
            random.shuffle(players)

            proc = subprocess.Popen(
                f"python3 -m referee {players[0]} {players[1]} -v0", stdout=subprocess.PIPE, shell=True)
            (out, err) = proc.communicate()
            out = out.decode()
            out = out.split('\n')

            if out[-2] == "* winner: upper" and players[0] == "ChumBucket":
                result = 5000
            elif out[-2] == "* winner: lower" and players[1] == "ChumBucket":
                result = 5000
            elif out[-2] == "* winner: upper" and players[0] != "ChumBucket":
                result = -5000
            elif out[-2] == "* winner: lower" and players[1] != "ChumBucket":
                result = -5000
            elif out[-2] == "* draw: no remaining tokens or throws":
                result = -1000
            elif out[-2] == "* draw: both players have an invincible token":
                result = -1000
            elif out[-2] == "* draw: same game state occurred for 3rd time":
                result = -5000
            elif out[-2] == "* draw: maximum number of turns reached":
                result = -5000

            print(i, j, players,
                  out[-5:-1], int(out[-5]) - 100*int(out[-4]) + 100*int(out[-3]) + result)
            fit += int(out[-5]) - 100*int(out[-4]) + 100*int(out[-3]) + result

        print('fitness value of chromosome ' + str(i) + ' :  ', fit)
        fitness.append(fit)
    return np.array(fitness)


def select_mating_pool(pop, fitness, num_parents):
    # Selecting the best individuals in the current generation as parents for producing the offspring of the next generation.
    parents = np.empty((num_parents, pop.shape[1]))
    for parent_num in range(num_parents):
        max_fitness_idx = np.where(fitness == np.max(fitness))
        max_fitness_idx = max_fitness_idx[0][0]
        parents[parent_num, :] = pop[max_fitness_idx, :]
        print(pop[max_fitness_idx, :])
        fitness[max_fitness_idx] = -99999999
    return parents


def crossover(parents, offspring_size):
    # creating children for next generation
    offspring = np.empty(offspring_size)

    for k in range(offspring_size[0]):
        while True:
            parent1_idx = random.randint(0, parents.shape[0] - 1)
            parent2_idx = random.randint(0, parents.shape[0] - 1)
            # produce offspring from two parents if they are different
            if parent1_idx != parent2_idx:
                for j in range(offspring_size[1]):
                    if random.uniform(0, 1) < 0.5:
                        offspring[k, j] = parents[parent1_idx, j]
                    else:
                        offspring[k, j] = parents[parent2_idx, j]
                break
    return offspring


def mutation(offspring_crossover):
    # mutating the offsprings generated from crossover to maintain variation in the population
    for idx in range(offspring_crossover.shape[0]):
        for _ in range(25):
            i = random.randint(0, offspring_crossover.shape[1]-1)
        random_value = np.random.choice(
            np.arange(-1, 1, step=0.001), size=(1), replace=False)
        offspring_crossover[idx,
                            i] = offspring_crossover[idx, i] + random_value
    return offspring_crossover
