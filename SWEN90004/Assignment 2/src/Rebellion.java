import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.TimeUnit;

/**
 * Class that handles running a single rebellion simulation
 */
public class Rebellion {
    /**
     * @param args command line arguments (not used in this case)
     * @throws Exception if cop and agent densities are invalid
     */
    public static void main(String[] args) throws Exception {
        Params params = new Params();
        Logger logger = Rebellion.runSimulation(params);
        if (Params.PRINT_TO_STDOUT) System.out.print(logger.dataToString());
        if (Params.SAVE_TO_CSV) logger.exportDataToCSV();
    }

    /**
     * Run's a single instance of the rebellion simulation
     * @param params the parameters the simulation will be run under
     * @return an instance of the {@link Logger} class that contains the data of the simulation that was run
     * @throws Exception if cop and agent densities are invalid
     */
    public static Logger runSimulation(Params params) throws Exception {
        // check if densities are valid, if not throw exception
        if (params.INITIAL_AGENT_DENSITY + params.INITIAL_COP_DENSITY > 1) {
            throw new Exception("Sum of INITIAL-COP-DENSITY and INITIAL-AGENT-DENSITY should be less than 1.");
        }

        // initialize helper classes
        Random random = new Random();
        Logger logger = new Logger();

        // initialize world by creating 2d grid array of cells
        Cell[][] world = new Cell[Params.GRID_SIZE][Params.GRID_SIZE];
        for(int i=0;i<Params.GRID_SIZE;i++)
            for(int j=0;j<Params.GRID_SIZE;j++)
                world[i][j] = new Cell(i,j);

        // calculate the visible cells for every cell on the grid
        for(int i=0;i<Params.GRID_SIZE;i++)
            for(int j=0;j<Params.GRID_SIZE;j++)
                world[i][j].calculateVisibleCells(world, params.VISION);

        // initialize agents with random values for attributes
        int nAgents = (int)Math.floor(params.INITIAL_AGENT_DENSITY*(Params.GRID_SIZE*Params.GRID_SIZE));
        Agent[] agents = new Agent[nAgents];
        for(int i=0;i<nAgents;i++)
            agents[i] = new Agent(random.nextDouble(1),random.nextDouble(1), params.GOVERNMENT_LEGITIMACY);

        // initialize cops
        int nCops = (int)Math.floor(params.INITIAL_COP_DENSITY*(Params.GRID_SIZE*Params.GRID_SIZE));
        Cop[] cops = new Cop[nCops];
        for (int i=0;i<nCops;i++)
            cops[i] = new Cop(params.MAX_JAIL_TERM);

        // randomly assign every person to a cell in the grid
        ArrayList<Cell> filledCells = new ArrayList<>();
        Person[] people = new Person[nAgents + nCops];
        System.arraycopy(agents, 0, people, 0, nAgents);
        System.arraycopy(cops, 0, people, nAgents, nCops);
        for (Person person : people) {
            int row = random.nextInt(Params.GRID_SIZE);
            int col = random.nextInt(Params.GRID_SIZE);
            while(filledCells.contains(world[row][col])) {
                row = random.nextInt(Params.GRID_SIZE);
                col = random.nextInt(Params.GRID_SIZE);
            }
            Cell cell = world[row][col];
            filledCells.add(cell);
            cell.addOccupant(person);
            person.setCell(cell);
        }

        // run simulation
        for(int turn=0;turn<Params.N_TURNS;turn++) {
            if (Params.PRETTY_PRINT) prettyPrint(world);
            logger.logAgents(agents);
            for (Person person : people) person.move();
            for (Agent agent : agents) agent.determineBehaviour();
            for (Cop cop : cops) cop.enforce();
            for (Agent agent : agents) agent.decrementJailTimeLeft();
        }

        // return simulation data
        return logger;
    }

    /**
     * Prints a visual representation of the world grid to standard output
     * @param world the cells of the world grid
     * @throws InterruptedException if the sleep method is interrupted
     */
    private static void prettyPrint(Cell[][] world) throws InterruptedException {
        System.out.print("\n\n\n\n\n");
        for (Cell[] row : world) {
            for (Cell cell : row) {
                String single = "   ";
                if (cell.getOccupant() instanceof Cop)
                    single = "\u001B[44m" + " C ";
                else if (cell.getOccupant() instanceof Agent agent && agent.isActive())
                    single = "\u001B[41m" + " A ";
                else if (cell.getOccupant() instanceof Agent agent && !agent.isActive())
                    single = "\u001B[43m" + " Q ";
                System.out.print(single + "\u001B[0m");
            }
            System.out.println();
        }
        TimeUnit.MILLISECONDS.sleep(Params.PRETTY_PRINT_SPEED);
    }
}
