/**
 * Fence actor subclass
 *
 * @author Irgio Basrewan
 */
public class Fence extends AbstractActor {
    /**
     * fence type constant for comparison
     */
    public final static String TYPE = "Fence";

    /**
     * generate new actor with Fence image
     * @param x position fence will spawn in on x axis
     * @param y position fence will spawn in on y axis
     */
    public Fence(int x, int y) {
        super(x, y, "res/images/Fence.png", TYPE);
    }


    /**
     * event for actor standing on fence
     * @param actor moving actor that is standing on current actor
     */
    @Override
    public void runEvent(AbstractMover actor) {
        actor.setActive(false);
        actor.rotate(2*AbstractMover.ROTATE90);
        actor.move();
    }
}
