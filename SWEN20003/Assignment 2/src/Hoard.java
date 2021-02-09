/**
 * Hoard actor subclass
 *
 * @author Irgio Basrewan
 */
public class Hoard extends AbstractStorage {
    /**
     * hoard type constant for comparison
     */
    public final static String TYPE = "Hoard";

    /**
     * generate new storage actor with hoard image
     * @param x position hoard will spawn in on x axis
     * @param y position hoard will spawn in on y axis
     */
    public Hoard(int x, int y) {
        super(x, y, "res/images/hoard.png", TYPE, 0);
    }

    /**
     * event for actor standing on hoard
     * @param actor moving actor that is standing on current actor
     */
    @Override
    public void runEvent(AbstractMover actor) {
        switch (actor.getType()) {
            case Gatherer.TYPE:
                // if gatherer is carrying, add it to stock
                if (actor.isCarrying()) {
                    actor.setCarrying(false);
                    this.incrementStock();
                }
                // turn around afterwards
                actor.rotate(2 * AbstractMover.ROTATE90);
                break;
            case Thief.TYPE:
                // if thief is consuming & not carrying, take stock & rotate
                if (((Thief) actor).isConsuming()) {
                    ((Thief) actor).setConsuming(false);
                    if (!actor.isCarrying()) {
                        if (this.getStock() > 0) {
                            actor.setCarrying(true);
                            this.decrementStock();
                        } else {
                            actor.rotate(AbstractMover.ROTATE90);
                        }
                    }
                    // if thief is carrying, add it to the stock and rotate
                } else if (actor.isCarrying()) {
                    actor.setCarrying(false);
                    this.incrementStock();
                    actor.rotate(AbstractMover.ROTATE90);
                }
        }
    }
}
