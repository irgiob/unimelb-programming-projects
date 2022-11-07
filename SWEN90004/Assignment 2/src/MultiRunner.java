import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

/**
 * Helper class for running multiple iterations of the rebellion simulation under multiple different parameters
 * similar to BehaviourSpace function in NetLogo
 */
public class MultiRunner {
    /**
     * The number of iterations to run each experiment
     */
    public final static int ITERATIONS = 5;

    /**
     * Values of government legitimacy to test
     */
    public final static double[] GOVERNMENT_LEGITIMACY = {0.72, 0.82, 0.92};

    /**
     * Values of max jail term to test
     */
    public final static int[] MAX_JAIL_TERM = {10, 30, 50};

    /**
     * Values of initial cop density to test
     */
    public final static double[] INITIAL_COP_DENSITY = {0.012, 0.042, 0.102};

    /**
     * Values of initial agent densities to test
     */
    public final static double[] INITIAL_AGENT_DENSITY = {0.73, 0.7, 0.64};


    /**
     * print progress of multi-runner to standard output
     */
    public static final boolean VERBOSE = true;

    /**
     * rows of non simulation data (DO NOT CHANGE)
     */
    public static final int INFO_ROWS = 7;

    /**
     * Runs the MultiRunner using the set of parameters above
     * @param args command line arguments (not used here)
     * @throws Exception if agent and cop densities are invalid
     */
    public static void main(String[] args) throws Exception {
        // initialize data table
        String[] data = initializeData();

        // test government legitimacy
        if (VERBOSE) System.out.println("STARTING TESTING ON GOVERNMENT LEGITIMACY");
        for (double val : GOVERNMENT_LEGITIMACY) {
            if (VERBOSE) System.out.println("Running test value " + val + " for " + ITERATIONS + " iterations");
            Map<String, Object> values = new HashMap<>();
            values.put("GOVERNMENT_LEGITIMACY", val);
            for(int i=0;i<ITERATIONS;i++) {
                Params params = new Params(values);
                Logger logger = Rebellion.runSimulation(params);
                logIterationData(data, params, logger,i+1);
            }
        }

        // test max jail term
        if (VERBOSE) System.out.println("STARTING TESTING ON MAX JAIL TERM");
        for (int val : MAX_JAIL_TERM) {
            if (VERBOSE) System.out.println("Running test value " + val + " for " + ITERATIONS + " iterations");
            Map<String, Object> values = new HashMap<>();
            values.put("MAX_JAIL_TERM", val);
            for(int i=0;i<ITERATIONS;i++) {
                Params params = new Params(values);
                Logger logger = Rebellion.runSimulation(params);
                logIterationData(data, params, logger,i+1);
            }
        }

        // test initial cop and agent density together
        if (VERBOSE) System.out.println("STARTING TESTING ON COP AND AGENT DENSITIES");
        for(int j=0;j<INITIAL_AGENT_DENSITY.length;j++) {
            if (VERBOSE) System.out.println("Running cop density of " + INITIAL_COP_DENSITY[j]
                    + " with agent density of " + INITIAL_AGENT_DENSITY[j] + " for " + ITERATIONS + " iterations");
            Map<String, Object> values = new HashMap<>();
            values.put("INITIAL_COP_DENSITY", INITIAL_COP_DENSITY[j]);
            values.put("INITIAL_AGENT_DENSITY", INITIAL_AGENT_DENSITY[j]);
            for(int i=0;i<ITERATIONS;i++) {
                Params params = new Params(values);
                Logger logger = Rebellion.runSimulation(params);
                logIterationData(data, params, logger,i+1);
            }
        }

        // export data table to csv file
        try {
            String time = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS).toString();
            FileWriter myWriter = new FileWriter("MultiRunnerData_" + time + ".csv");
            myWriter.write(String.join("\n",data));
            myWriter.close();
            System.out.println("MultiRunner has completed running all iterations. Run data saved to csv file.");
        } catch (IOException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }
    }

    /**
     * Create initial empty table of data which MultiRunner will add its data to
     * @return initial data table
     */
    private static String[] initializeData() {
        String[] data = new String[Params.N_TURNS+INFO_ROWS];
        data[0] = "MultiRunner(N_TURNS: 100 | GRID_SIZE: 40)";
        data[1] = "ITERATION,";
        data[2] = "GOVERNMENT_LEGITIMACY,";
        data[3] = "MAX_JAIL_TERM,";
        data[4] = "INITIAL_COP_DENSITY,";
        data[5] = "INITIAL_AGENT_DENSITY,";
        data[6] = ",";
        for (int i=INFO_ROWS;i<Params.N_TURNS+INFO_ROWS;i++)
            data[i] = ",";
        return  data;
    }

    /**
     * Logs a single iteration of the rebellion simulation into data table
     * @param data the entire MultiRunner dataset
     * @param params the parameters used to run that simulation
     * @param logger the data of the simulation iteration
     * @param iteration the current iteration that is being logged
     */
    private static void logIterationData(String[] data, Params params, Logger logger, int iteration) {
        data[1] += iteration + ",,,,";
        data[2] += params.GOVERNMENT_LEGITIMACY + ",,,,";
        data[3] += params.MAX_JAIL_TERM + ",,,,";
        data[4] += params.INITIAL_COP_DENSITY + ",,,,";
        data[5] += params.INITIAL_AGENT_DENSITY + ",,,,";
        data[6] += Logger.COLUMN_HEADERS + ",";
        for (int j=INFO_ROWS;j<Params.N_TURNS+INFO_ROWS;j++)
            data[j] += logger.dataAtTurn(j-INFO_ROWS) + ",";
    }
}
