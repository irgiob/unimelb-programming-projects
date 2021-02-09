import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import bagel.Image;

/**
 * World Singleton class contains all actors and their positions
 * in charge of drawing and updating actors every tick
 *
 * @author Irgio Basrewan
 */
public class World {
    /**
     * private world attributes to store instance and actors
     */
    private static World worldInstance = null;
    private final Image background;
    private final ArrayList<AbstractActor> worldActors;

    /**
     * create new world and instantiate attributes
     */
    private World() {
        background = new Image("res/images/background.png");
        worldActors = new ArrayList<>();
    }

    /**
     * get single instance of World class
     * @return world instance of singleton class
     */
    public static World getInstance() {
        if (worldInstance == null) worldInstance = new World();
        return worldInstance;
    }

    /**
     * get the number of actors currently in the world
     * @return number of actors in the world
     */
    public int getNumberOfActors() {
        return worldActors.size();
    }

    /**
     * get actor object stored at specific index in actor array
     * @param index index to get actor from array
     * @return actor stored at that index in the array
     */
    public AbstractActor getActorAtIndex(int index) {
        return worldActors.get(index);
    }

    /**
     * load in world from text file or exit program if the file in invalid
     * @param worldFile text file storing data on world actors
     */
    public void loadWorldFile(String worldFile) {
        int lineNumber = 1, x = 0, y = 0;
        if(Files.exists(Path.of(worldFile))) {
            try (BufferedReader br =
                         new BufferedReader(new FileReader(worldFile))) {
                String text;
                while ((text = br.readLine()) != null) {
                    String[] actor = text.split(",");
                    // validates the correct number of arguments
                    if(actor.length != ShadowLife.NUM_ARGUMENTS) {
                        System.out.println("error: in file " + worldFile +
                                " at line " + lineNumber);
                        System.exit(-1);
                    }
                    // validate date types for world actor arguments
                    try {
                        x = Integer.parseInt(actor[1]);
                        y = Integer.parseInt(actor[2]);
                    } catch (NumberFormatException nfe) {
                        System.out.println("error: in file " + worldFile +
                                " at line " + lineNumber);
                        System.exit(-1);
                    }
                    addActor(actor[0], worldFile, lineNumber, x, y);
                    lineNumber++;
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            System.out.println("error: file " + worldFile + " not found");
            System.exit(-1);
        }
        worldActors.sort(AbstractActor::compareTo);
    }

    /**
     * draws all world actors on window
     */
    public void draw() {
        background.drawFromTopLeft(0,0);
        for(AbstractActor actor: worldActors) {
            actor.draw();
        }
    }

    /**
     * updates world actors every tick
     */
    public void update() {
        // updates every actor in array
        int numActors = getNumberOfActors();
        for(int i=0;i<numActors;i++) {
            getActorAtIndex(i).update();
        }
        // re-sorts array in case new actors added
        worldActors.sort(AbstractActor::compareTo);
    }

    /**
     * add actor to ArrayList or exit if actor type doesn't exist
     * @param type class actor belongs to (type of actor)
     * @param world the name of the world file to print out if invalid line
     * @param line line number to print out if invalid line
     * @param x position on x axis on screen to place new actor
     * @param y position on y axis on screen to place new actor
     */
    public void addActor(String type, String world, int line, int x, int y) {
        AbstractActor actor = null;
        switch (type) {
            case Gatherer.TYPE: actor = new Gatherer(x,y, Sign.LEFT); break;
            case Thief.TYPE: actor = new Thief(x,y, Sign.UP); break;
            case Tree.TYPE: actor = new Tree(x,y); break;
            case GoldenTree.TYPE: actor = new GoldenTree(x,y); break;
            case Stockpile.TYPE: actor = new Stockpile(x,y); break;
            case Hoard.TYPE: actor = new Hoard(x,y); break;
            case Pool.TYPE: actor = new Pool(x,y); break;
            case Pad.TYPE: actor = new Pad(x,y); break;
            case Fence.TYPE: actor = new Fence(x,y); break;
            case Sign.TYPE+Sign.UP: actor = new Sign(x,y,Sign.UP); break;
            case Sign.TYPE+Sign.DOWN: actor = new Sign(x,y,Sign.DOWN); break;
            case Sign.TYPE+Sign.LEFT: actor = new Sign(x,y,Sign.LEFT); break;
            case Sign.TYPE+Sign.RIGHT: actor = new Sign(x,y,Sign.RIGHT); break;
            default:
                System.out.println("error: in file "+world+" at line "+line);
                System.exit(-1);
        }
        worldActors.add(actor);
    }

    /**
     * overloading addActor method to directly add objects to array
     * @param actor to be added to array of actors
     */
    public void addActor(AbstractActor actor) {
        worldActors.add(actor);
    }

    /**
     * check if simulation is over (by checking active state)
     * @return true if all moving actors are inactive or false otherwise
     */
    public boolean isSimulationOver() {
        for (AbstractActor actor: worldActors) {
            if (actor.getType().equals(Gatherer.TYPE) ||
                    actor.getType().equals(Thief.TYPE)) {
                if (((AbstractMover) actor).isActive()) return false;
            }
        }
        return true;
    }
}