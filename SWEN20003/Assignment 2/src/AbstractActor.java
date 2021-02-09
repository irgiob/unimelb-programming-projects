import bagel.util.Point;
import bagel.Image;

/**
 * Abstract Actor class holds common attributes and methods of all actors
 * and allows simple addition of any future actor types in the future
 *
 * @author Irgio Basrewan
 */
public abstract class AbstractActor implements Comparable<AbstractActor>{
    /**
     * class attributes
     */
    private Point position;
    private final Image actor;
    private final String type;

    /**
     * constructor: create new actor with appropriate position and image
     * @param x position on x axis on screen to place new actor
     * @param y position on y axis on screen to place new actor
     * @param actorImage image file to be drawn on screen
     * @param type concrete sub class the actor belongs to
     */
    public AbstractActor(int x, int y, String actorImage, String type) {
        setPosition(x, y);
        actor = new Image(actorImage);
        this.type = type;
    }

    /**
     * obtain x coordinate of actor on screen
     * @return current position of actor on x axis
     */
    public double getX() {
        return position.x;
    }

    /**
     * obtain y coordinate of actor on screen
     * @return current position of actor on y axis
     */
    public double getY() {
        return position.y;
    }

    /**
     * obtain concrete actor type
     * @return concrete class type actor belongs to
     */
    public String getType() {
        return type;
    }

    /**
     * event method for when moving actors are standing on other actors
     * @param actor moving actor that is standing on current actor
     */
    public abstract void runEvent(AbstractMover actor);

    /**
     * move actor to new position on screen
     * @param x set position of actor on x axis
     * @param y set position of actor on y axis
     */
    public void setPosition(double x, double y) {
        position = new Point(x, y);
    }

    /**
     * draw actor on window
     */
    public void draw() {
        actor.drawFromTopLeft(getX(), getY());
    }

    /**
     * update actor attributes (different behavior per subclass)
     */
    public void update() {}

    /**
     * checks whether two actors are in the same position/tile on screen
     * @param other abstract actor to compare with current actor
     * @return true if both actors are in the same position and false otherwise
     */
    public boolean samePosition(AbstractActor other) {
        return getX() == other.getX() && getY() == other.getY();
    }

    /**
     * compareTo method for sorting list of actors
     * @param o abstract actor to compare with current actor
     * @return 0 if same, less than 0 if smaller, or more than 0 if larger
     */
    @Override
    public int compareTo(AbstractActor o) {
        return getTypeOrder(this) - getTypeOrder(o);
    }

    /**
     * ensures movers are drawn last and gatherers are updated before thieves
     * @param actor actor to be assigned an order in an array
     * @return 1 if not a mover, 2 if a gatherer, and 3 if a thief
     */
    private int getTypeOrder(AbstractActor actor) {
        if (actor.getType().equals(Gatherer.TYPE)) return 2;
        else if (actor.getType().equals(Thief.TYPE)) return 3;
        else return 1;
    }
}
