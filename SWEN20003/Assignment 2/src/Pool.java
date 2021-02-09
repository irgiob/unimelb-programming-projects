/**
 * Mitosis Pool actor subclass
 *
 * @author Irgio Basrewan
 */
public class Pool extends AbstractActor {
    /**
     * pool type constant for comparison
     */
    public final static String TYPE = "Pool";

    /**
     * generate new actor with pool image
     * @param x position mitosis pool will spawn in on x axis
     * @param y position mitosis pool will spawn in on y axis
     */
    public Pool(int x, int y) {
        super(x, y, "res/images/pool.png", TYPE);
    }

    /**
     * event for actor standing on mitosis pool
     * @param actor moving actor that is standing on current actor
     */
    @Override
    public void runEvent(AbstractMover actor) {
        // creates new copy of actor
        AbstractMover newMover = actor.copy();
        World.getInstance().addActor(newMover);

        //rotate both in opposite directions
        newMover.rotate(AbstractMover.ROTATE90);
        newMover.move();
        actor.rotate(-AbstractMover.ROTATE90);
        actor.move();
    }
}
