import bagel.*;
import java.nio.file.*;
import java.nio.charset.Charset;
import java.io.IOException;

/**
 * main class where simulation is initialized and ran from
 *
 * @author Irgio Basrewan
 */
public class ShadowLife extends AbstractGame {
    /**
     * number of arguments that should be passed in from command line
     */
    public static final int NUM_ARGUMENTS = 3;

    /**
     * private attributes to store tick information and World instance
     */
    private final World world;
    private final int tickFrequency;
    private int tickCount;
    private long tickLast;
    private final int tickMax;

    /**
     * constructs game using constants and world file
     * @param args command line arguments
     */
    public ShadowLife(String[] args) {
        super();
        tickFrequency = Integer.parseInt(args[0]);
        tickMax = Integer.parseInt(args[1]);
        world = World.getInstance();
        world.loadWorldFile(args[2]);
        tickLast = System.currentTimeMillis();
    }

    /**
     * main function for program (runs game if args valid)
     * @param args command line arguments
     */
    public static void main(String[] args) {
        String[] arg = argsFromFile();
        if (arg != null && argsAreValid(arg)) {
            ShadowLife game = new ShadowLife(arg);
            game.run();
        }
    }

    /**
     * updates game every frame (and exits when appropriate)
     * @param input input class for bagel functionality
     */
    @Override
    public void update(Input input) {
        // run simulation tick
        if(System.currentTimeMillis() - tickLast >= tickFrequency) {
            // exit if max tick amount reached
            if (tickCount++ > tickMax) {
                System.out.println("Timed out");
                System.exit(-1);
            } else {
                world.update();
                tickLast = System.currentTimeMillis();
            }
        }
        world.draw();

        // checks for end of simulation and exits program if yes
        if(world.isSimulationOver()) {
            System.out.println(tickCount + " ticks");
            // print stock of all hoards and stockpiles
            for (int i=0;i<world.getNumberOfActors();i++) {
                AbstractActor actor = world.getActorAtIndex(i);
                if (actor.getType().equals(Stockpile.TYPE) ||
                        actor.getType().equals(Hoard.TYPE)) {
                    System.out.println(((AbstractStorage) actor).getStock());
                }
            }
            System.exit(0);
        }
    }

    /**
     * reads command line arguments for args.txt file
     * @return arguments in String array or null if reading arguments fails
     */
    private static String[] argsFromFile() {
        try {
            return Files.readString(Path.of("args.txt"),
                    Charset.defaultCharset()).split(" ");
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * checks that all the command line arguments are valid
     * @param arg command line arguments
     * @return true if all arguments are valid and exits otherwise
     */
    private static boolean argsAreValid(String[] arg) {
        String errorString = "usage: ShadowLife <tick rate> <max ticks> <world file>";
        // checks for correct number of arguments
        if (arg.length != NUM_ARGUMENTS) {
            System.out.println(errorString);
            System.exit(-1);
        // checks for correct data types
        } try {
            Integer.parseInt(arg[0]);
            Integer.parseInt(arg[1]);
        } catch (NumberFormatException nfe) {
            System.out.println(errorString);
            System.exit(-1);
        // checks for positive integers
        } if (Integer.parseInt(arg[0]) < 0 || Integer.parseInt(arg[1]) < 0) {
            System.out.println(errorString);
            System.exit(-1);
        }
        return true;
    }
}

