/**
 * Thief actor subclass
 *
 * @author Irgio Basrewan
 */
public class Thief extends AbstractMover {
    /**
     * thief type attribute for comparison
     */
    public final static String TYPE = "Thief";

    /**
     * private attribute to denote if thief is currently consuming fruit
     */
    private boolean consuming;

    /**
     * create new actor with gatherer image and initialize Random object
     * @param x position thief will spawn in on x axis
     * @param y position thief will spawn in on y axis
     * @param direction initial direction thief will move in
     */
    public Thief(int x, int y, String direction) {
        super(x, y, "res/images/thief.png", TYPE, direction);
        consuming = false;
    }

    /**
     * check if the thief is currently consuming fruit
     * @return whether thief is currently consuming or not
     */
    public boolean isConsuming() {return consuming;}

    /**
     * set thief to start or stop consuming fruit
     * @param state consuming attribute being set
     */
    public void setConsuming(boolean state){consuming = state;}

    /**
     * event for actor standing on thief (no action)
     * @param actor moving actor that is standing on current actor
     */
    @Override
    public void runEvent(AbstractMover actor) {}

    /**
     * returns a deep copy of the current thief
     * @return deep copy of current actor
     */
    @Override
    public AbstractMover copy() {
        return new Thief((int)getX(), (int)getY(),
                Sign.DIRECTIONS[getDirection() + 1]);
    }
}
