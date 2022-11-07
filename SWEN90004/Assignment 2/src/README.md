# Rebellion Model Java Implementation

This is an implementation of the NetLogo Rebellion model in Java

## How To Run

### Single Simulation

1. Create terminal instance at this folder
2. Open Params.java and modify default parameter values in the Enum for what you want to test 
3. Run `javac *.java`
4. Run `java Rebellion`

### Multiple Simulations

This code includes a system to run multiple iterations of the simulation using different combinations of
parameters of experimentation purposes, similar to the BehaviourSpace feature in NetLogo. To run it:

1. Create terminal instance at this folder
2. Open Params.java and modify default parameter values for what you want to test 
3. Open MultiRunner.java and set parameters of set of runs
   1. Set number of iterations each unique combination of parameters should be tested for
   2. Add values for each parameter to be tested in list form (e.g `{20, 30, 40}`)
   3. When specific parameter is being tested, default values from Params will be used for other parameters
4. Run `javac *.java`
5. Run `java MultiRunner`

You can clean up the class files after you're done using `rm *.class` and the CSV files using `rm *.csv`

## Extension

The extension of this model considers how the simulation would be impacted if rebels tended to move towards 
other rebels rather than move in completely random directions. The idea of this is to implement a more realistic
interpretation of rebel movement where rebels tend to clump together with other rebels (strength in numbers).

The extension can be activated by setting the `MOVE_TOWARDS_REBELS_EXT` parameter in Params.java to true.

## Other Notable Parameters (That Aren't in the NetLogo Model)

* N_TURNS: How long a simulation lasts (unlike NetLogo it doesn't go on forever)
* PRINT_TO_STDOUT: Prints all the data of a single simulation run to standard output
* SAVE_TO_CSV: Saves the data of a single simulation run to a CSV file
* PRETTY_PRINT: Displays a visual representation of the world grid to standard output
* PRETTY_PRINT_SPEED: The speed of each simulation turn when running PRETTY_PRINT mode (in milliseconds)