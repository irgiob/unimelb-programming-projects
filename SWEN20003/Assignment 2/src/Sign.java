import java.util.Arrays;

/**
 * Sign actor subclass
 *
 * @author Irgio Basrewan
 */
public class Sign extends AbstractActor {
    /**
     * sign type constant for comparison
     */
    public final static String TYPE = "Sign";

    /**
     * constant to identify signs pointing upward
     */
    public final static String UP = "Up";

    /**
     * constant to identify signs pointing downward
     */
    public final static String DOWN = "Down";

    /**
     * constant to identify signs pointing left
     */
    public final static String LEFT = "Left";

    /**
     * constant to identify signs pointing right
     */
    public final static String RIGHT = "Right";

    /**
     * string array to convert between int and string directions
     */
    public final static String[] DIRECTIONS = {UP,LEFT,DOWN,RIGHT};

    /**
     * private attribute to store the direction of the sign
     */
    private final int direction;

    /**
     * generate new actor with sign image
     * @param x position sign will spawn in on x axis
     * @param y position sign will spawn in on y axis
     * @param direction direction of the sign
     */
    public Sign(int x, int y, String direction) {
        super(x, y, "res/images/" + direction.toLowerCase() + ".png", TYPE);
        this.direction = Arrays.asList(DIRECTIONS).indexOf(direction) - 1;
    }

    /**
     * event for actor standing on sign
     * @param actor moving actor that is standing on current actor
     */
    @Override
    public void runEvent(AbstractMover actor) {
        actor.setDirection(direction);
    }
}
