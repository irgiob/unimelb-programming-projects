import java.util.Arrays;

/**
 * Abstract Mover class with extra features for actors to be updated every tick
 *
 * @author Irgio Basrewan
 */
public abstract class AbstractMover extends AbstractActor {
    /**
     * the size of one tile / the amount of pixels the actors move per tile
     */
    public static final int TILESIZE = 64;

    /**
     * the number of possible directions an actor can travel
     */
    public static final int NUM_DIRECTIONS = 4;

    /**
     * the numerical equivalent of rotating an actor 90 degrees using the rotate method
     */
    public static final int ROTATE90 = 1;

    /**
     * private attributes that control state of actor
     */
    private int direction;
    private boolean active;
    private boolean carrying;

    /**
     * abstract constructor used to initialize attributes common to all moving actors
     * @param x position actor will spawn on x axis
     * @param y position actor will spawn on y axis
     * @param image image used to draw actor on screen
     * @param type class type actor belongs to
     * @param dir initial direction actor shall be moving every tick
     */
    public AbstractMover(int x, int y, String image, String type, String dir) {
        super(x, y, image, type);
        this.direction = Arrays.asList(Sign.DIRECTIONS).indexOf(dir) - 1;
        active = true;
        carrying = false;
    }

    /**
     * checks if actor is still active (moving)
     * @return boolean state of active attribute
     */
    public boolean isActive() {return active;}

    /**
     * changes the state of the active attribute
     * @param state active attribute to set
     */
    public void setActive(boolean state) {active = state;}

    /**
     * checks if the actor is carrying fruit
     * @return boolean state of carrying attribute
     */
    public boolean isCarrying() {return carrying;}

    /**
     * set actor to start or stop carrying fruit
     * @param state carrying attribute set
     */
    public void setCarrying(boolean state) {carrying = state;}

    /**
     * gets the current direction the actor is moving
     * @return direction actor is currently going in
     */
    public int getDirection() {return direction;}

    /**
     * change direction the actor is moving
     * @param direction actor moving direction being set
     */
    public void setDirection(int direction) {this.direction = direction;}

    /**
     * update moving actors every tick and perform action if meet other actor
     */
    @Override
    public void update() {
        World world = World.getInstance();
        if (active) move();
        for(int i=0;i<world.getNumberOfActors();i++) {
            AbstractActor o = world.getActorAtIndex(i);
            if(this.samePosition(o)) o.runEvent(this);
        }
    }

    /**
     * rotate direction of moving actor by variable degrees
     * @param increment how far to rotate actor (in 90 degree increments)
     */
    public void rotate(int increment) {
        direction = (direction + 1 + NUM_DIRECTIONS - increment)
                % NUM_DIRECTIONS - 1;
    }

    /**
     * moves actor by 1 tile in its assigned direction
     */
    public void move() {
        setPosition(getX()+((direction-1)%2)*TILESIZE,
                getY()+(direction%2)*TILESIZE);
    }

    /**
     * create a deep copy of the moving actor
     * @return deep copy of current actor
     */
    public abstract AbstractMover copy();
}