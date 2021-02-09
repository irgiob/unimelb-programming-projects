/**
 * Tree actor subclass (no added functionality from abstract superclass)
 *
 * rather redundant as no added functionality, but kept for consistency
 */
public class Tree extends AbstractActor {
    /**
     * generate new actor with tree image
     */
    public Tree(int x, int y) {
        super(x, y, "res/images/tree.png");
    }
}
