import java.util.Random;

/**
 * Gatherer actor subclass that has added (movement) functionality
 */
public class Gatherer extends AbstractActor {
    // constants and attributes (most for moving functionality)
    private static final int TILESIZE = 64;
    private static final int NUM_DIRECTIONS = 4;
    private static final int CHANGE_DIRECTION_FREQUENCY = 5;
    private Random random;
    private int direction;
    private int count;

    /**
     * create new actor with gatherer image and initialize Random object
     */
    public Gatherer(int x, int y) {
        super(x, y, "res/images/gatherer.png");
        random = new Random();
        count = 0;
    }

    /**
     * override update function with added movement functionality
     */
    public void update() {
        // generate number between -1 and 2 every 5 ticks to decide direction
        if (++count == CHANGE_DIRECTION_FREQUENCY) {
            direction = random.nextInt(NUM_DIRECTIONS) - 1;
            count = 0;
        }
        // each number creates unique direction for gatherer to travel
        setPosition(getX() + ((direction - 1) % 2) * TILESIZE,getY() + (direction % 2) * TILESIZE);
    }
}
