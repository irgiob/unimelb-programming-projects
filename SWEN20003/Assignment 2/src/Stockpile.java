/**
 * Stockpile actor subclass
 *
 * @author Irgio Basrewan
 */
public class Stockpile extends AbstractStorage {
    /**
     * stockpile type constant for comparison
     */
    public final static String TYPE = "Stockpile";

    /**
     * generate new storage actor with stockpile image
     * @param x position stockpile will spawn in on x axis
     * @param y position stockpile will spawn in on y axis
     */
    public Stockpile(int x, int y) {
        super(x, y, "res/images/cherries.png", TYPE, 0);
    }

    /**
     * event for actor standing on stockpile
     * @param actor moving actor that is standing on current actor
     */
    @Override
    public void runEvent(AbstractMover actor) {
        switch (actor.getType()) {
            case Gatherer.TYPE:
                // if gatherer is carrying fruit, add it to stock
                if(actor.isCarrying()) {
                    actor.setCarrying(false);
                    this.incrementStock();
                }
                // turn around afterwards
                actor.rotate(2*AbstractMover.ROTATE90);
                break;
            case Thief.TYPE:
                // if thief isn't carrying & theres stock, take stock & rotate
                if (!actor.isCarrying()) {
                    if (this.getStock() > 0) {
                        actor.setCarrying(true);
                        ((Thief)actor).setConsuming(false);
                        this.decrementStock();
                        actor.rotate(AbstractMover.ROTATE90);
                    }
                // if thief isn't carrying, just rotate
                } else {
                    actor.rotate(AbstractMover.ROTATE90);
                }
        }
    }
}
