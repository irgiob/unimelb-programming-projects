import java.util.Map;

/**
 * Class that contains all parameters to change the way the simulation is run
 */
public class Params {
    /**
     * Enumerator that contains default values for all relevant parameters if not provided in constructor
     * Used to keep the Param properties final
     * Comments for each of these parameters can be found further below
     */
    private enum DefaultValues {
        N_TURNS(100),
        MOVE_TOWARDS_REBELS_EXT(false),
        PRINT_TO_STDOUT(true),
        SAVE_TO_CSV(false),
        PRETTY_PRINT(false),
        PRETTY_PRINT_SPEED(2000),
        GRID_SIZE(40),

        GOVERNMENT_LEGITIMACY(0.82),
        MAX_JAIL_TERM(30),
        INITIAL_COP_DENSITY(0.042),
        INITIAL_AGENT_DENSITY(0.7),
        VISION(7);

        public final Object value;
        DefaultValues(Object value) {
            this.value = value;
        }
    }

    /* SECTION 1 - UTILITY PARAMETERS
     * static constants to control how code is run, but don't impact the actual simulation itself
     */

    /**
     * The number of turns to run the simulation for
     */
    public final static int N_TURNS = (int) DefaultValues.N_TURNS.value;

    /**
     * Activate extension: rebels tend to move towards other rebels within their vision
     */
    public final static boolean MOVE_TOWARDS_REBELS_EXT = (boolean) DefaultValues.MOVE_TOWARDS_REBELS_EXT.value;

    /**
     * If true, run data will be printed to the standard output while running
     */
    public final static boolean PRINT_TO_STDOUT = (boolean) DefaultValues.PRINT_TO_STDOUT.value;

    /**
     * If true, run data from model will be saved to a CSV file in the current directory
     */
    public final static boolean SAVE_TO_CSV = (boolean) DefaultValues.SAVE_TO_CSV.value;

    /**
     * If true, prints a multicolored grid to console showing the simulation
     */
    public final static boolean PRETTY_PRINT = (boolean) DefaultValues.PRETTY_PRINT.value;

    /**
     * Dictates the speed of one turn of the simulation for pretty print mode in milliseconds
     */
    public final static int PRETTY_PRINT_SPEED = (int) DefaultValues.PRETTY_PRINT_SPEED.value;

    /**
     * tThe size of the (square) world grid
     */
    public static final int GRID_SIZE = (int) DefaultValues.GRID_SIZE.value;

    /* SECTION 2 - SIMULATION PARAMETERS
     * default values for parameters to actually change variables of the simulation
     */

    /**
     * The overall legitimacy of the current government
     */
    public final double GOVERNMENT_LEGITIMACY;

    /**
     * The maximum amount of turns a civilian will be jailed
     */
    public final int MAX_JAIL_TERM;

    /**
     * The percentage of tiles taken up by cops
     */
    public final double INITIAL_COP_DENSITY;

    /**
     * The percentage of tiles taken up by civilians (agents)
     */
    public final double INITIAL_AGENT_DENSITY;

    /**
     * The number of tiles away a person can see
     */
    public final int VISION;

    /* SECTION 3 - MISCELLANEOUS PARAMETERS
     * static constants required to make the code work, DO NOT NEED TO BE CHANGED
     */

    /**
     * the min difference between a civilians grievance and net risk before they start rebelling
     */
    public final static double THRESHOLD = 0.1;

    /**
     * a constant to maintain functionality in certain edge cases
     */
    public final static double K = 2.3;

    /**
     * Initializes a set of parameters used to run a simulation
     * @param params a list of parameter-name value pairs that will override the default values given above
     */
    public Params(Map<String, Object> params) {
        GOVERNMENT_LEGITIMACY = (double) ((params.containsKey("GOVERNMENT_LEGITIMACY"))
                ? params.get("GOVERNMENT_LEGITIMACY") : DefaultValues.GOVERNMENT_LEGITIMACY.value);
        MAX_JAIL_TERM = (int) ((params.containsKey("MAX_JAIL_TERM"))
                ? params.get("MAX_JAIL_TERM") : DefaultValues.MAX_JAIL_TERM.value);
        INITIAL_COP_DENSITY = (double) ((params.containsKey("INITIAL_COP_DENSITY"))
                ? params.get("INITIAL_COP_DENSITY") : DefaultValues.INITIAL_COP_DENSITY.value);
        INITIAL_AGENT_DENSITY = (double) ((params.containsKey("INITIAL_AGENT_DENSITY"))
                ? params.get("INITIAL_AGENT_DENSITY") : DefaultValues.INITIAL_AGENT_DENSITY.value);
        VISION = (int) ((params.containsKey("VISION"))
                ? params.get("VISION") : DefaultValues.VISION.value);
    }

    /**
     * Overload of default constructor that just uses all default values if no parameter map is supplied
     */
    public Params() {
        GOVERNMENT_LEGITIMACY = (double) DefaultValues.GOVERNMENT_LEGITIMACY.value;
        MAX_JAIL_TERM = (int) DefaultValues.MAX_JAIL_TERM.value;
        INITIAL_COP_DENSITY = (double) DefaultValues.INITIAL_COP_DENSITY.value;
        INITIAL_AGENT_DENSITY = (double) DefaultValues.INITIAL_AGENT_DENSITY.value;
        VISION = (int) DefaultValues.VISION.value;
    }
}
