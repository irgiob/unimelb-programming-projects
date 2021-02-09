/**
 * Tree actor subclass
 *
 * @author Irgio Basrewan
 */
public class Tree extends AbstractStorage {
    /**
     * tree type constant for comparison
     */
    public final static String TYPE = "Tree";

    /**
     * initial stock for trees at the start of a simulation
     */
    private final static int INITIAL_STOCK = 3;

    /**
     * generate new storage actor with tree image
     * @param x position tree will spawn in on x axis
     * @param y position tree will spawn in on y axis
     */
    public Tree(int x, int y) {
        super(x, y, "res/images/tree.png", TYPE, INITIAL_STOCK);
    }

    /**
     * event for actor stand on tree
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
