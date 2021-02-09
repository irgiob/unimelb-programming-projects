/**
 * Gatherer actor subclass
 *
 * @author Irgio Basrewan
 */
public class Gatherer extends AbstractMover {
    /**
     * gatherer type constant for comparison
     */
    public final static String TYPE = "Gatherer";

    /**
     * create new moving actor with gatherer image
     * @param x position gatherer will spawn in on x axis
     * @param y position gatherer will spawn in on y axis
     * @param direction initial direction gatherer will move in
     */
    public Gatherer(int x, int y, String direction) {
        super(x, y, "res/images/gatherer.png", TYPE, direction);
    }

    /**
     * event for actor (thief only) standing on gatherer
     * @param actor moving actor that is standing on current actor
     */
    @Override
    public void runEvent(AbstractMover actor) {
        if(actor.getType().equals(Thief.TYPE))actor.rotate(3*ROTATE90);
    }

    /**
     * returns a deep copy of the current gatherer
     * @return deep copy of current actor
     */
    @Override
    public AbstractMover copy() {
        return new Gatherer((int)getX(), (int)getY(),
                Sign.DIRECTIONS[getDirection() + 1]);
    }
}
