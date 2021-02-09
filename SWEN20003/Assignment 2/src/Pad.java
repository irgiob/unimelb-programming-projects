/**
 * Pad actor subclass
 *
 * @author Irgio Basrewan
 */
public class Pad extends AbstractActor {
    /**
     * pad type constant for comparison
     */
    public final static String TYPE = "Pad";

    /**
     * generate new actor with Pad image
     * @param x position pad will spawn in on x axis
     * @param y position pad will spawn in on y axis
     */
    public Pad(int x, int y) {
        super(x, y, "res/images/pad.png", TYPE);
    }

    /**
     * event for actor standing on pad
     * @param actor moving actor that is standing on current actor
     */
    @Override
    public void runEvent(AbstractMover actor) {
        if(actor.getType().equals(Thief.TYPE)) {
            ((Thief) actor).setConsuming(true);
        }
    }
}
