import bagel.*;

/**
 * Object Oriented Software Development Project 1
 *
 * @author Irgio Basrewan
 */
public class ShadowLife extends AbstractGame {
    // constant & attribute
    private static final int TICK_FREQUENCY = 500;
    private World world;
    private long lastTick;

    /**
     * constructs game using constants and world file
     */
    public ShadowLife(String worldFile) {
        super();
        world = new World(worldFile);
        lastTick = System.currentTimeMillis();
    }

    /**
     * main function for program
     */
    public static void main(String[] args) {
        ShadowLife game = new ShadowLife("res/worlds/test.csv");
        game.run();
    }

    /**
     * updates game every frame
     */
    @Override
    public void update(Input input) {
        if(System.currentTimeMillis() - lastTick >= TICK_FREQUENCY) {
            world.update();
            lastTick = System.currentTimeMillis();
        }
        world.draw();
    }
}

