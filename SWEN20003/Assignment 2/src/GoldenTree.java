/**
 * Golden Tree actor subclass
 *
 * @author Irgio Basrewan
 */
public class GoldenTree extends AbstractStorage {
    /**
     * golden tree type constant for comparison
     */
    public final static String TYPE = "GoldenTree";

    /**
     * generate new storage actor with golden tree image
     * @param x position golden tree will spawn in on x axis
     * @param y position golden tree will spawn in on y axis
     */
    public GoldenTree(int x, int y) {
        super(x, y, "res/images/gold-tree.png", TYPE, -1);
    }

    /**
     * event for actor standing on golden tree
     * @param actor moving actor that is standing on current actor
     */
    @Override
    public void runEvent(AbstractMover actor) {
        if(!actor.isCarrying() && this.getStock() != 0) {
            this.decrementStock();
            actor.setCarrying(true);
            if(actor.getType().equals(Gatherer.TYPE)) {
                actor.rotate(2*AbstractMover.ROTATE90);
            }
        }
    }
}
