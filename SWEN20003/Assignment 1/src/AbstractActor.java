import bagel.util.Point;
import bagel.Image;

/**
 * Abstract Actor class holds common attributes & methods of all actors
 *
 * allows simple addition of any future actor types in the future
 */
public abstract class AbstractActor implements Drawable{
    private Point position;
    private Image actor;

    /**
     * create new actor with appropriate position and image
     */
    public AbstractActor(int x, int y, String actorImage) {
        setPosition(x, y);
        actor = new Image(actorImage);
    }

    /**
     * getter methods to get center position of actor
     */
    public double getX() {
        return position.x;
    }
    public double getY() {
        return position.y;
    }

    /**
     * setter method to change position of actor
     */
    public void setPosition(double x, double y) {
        position = new Point(x, y);
    }

    /**
     * redraw actor on window
     */
    public void draw() {
        actor.drawFromTopLeft(getX(), getY());
    }

    /**
     * update actor attributes (different behavior per subclass)
     */
    public void update() {}
}
