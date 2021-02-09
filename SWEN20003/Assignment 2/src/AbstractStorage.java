import bagel.Font;

/**
 * Abstract Storage class for all actors that store and display fruit
 *
 * @author Irgio Basrewan
 */
public abstract class AbstractStorage extends AbstractActor{
    /**
     * private attributes for storing and printing fruit stock
     */
    private static final int FONT_SIZE = 24;
    private final Font stockFont;
    private int stock;

    /**
     * create an actor that stores fruit
     * @param x position actor will spawn in on a axis
     * @param y position actor will spawn in on y axis
     * @param image image of actor that will be drawn on screen
     * @param type class type that actor belongs to
     * @param stock initial stock of fruit of the actor
     */
    public AbstractStorage(int x, int y, String image, String type, int stock) {
        super(x, y, image, type);
        stockFont = new Font("res/VeraMono.ttf", FONT_SIZE);
        this.stock = stock;
    }

    /**
     * draws actor on screen (and draws stock of fruit on top left corner of actor)
     */
    @Override
    public void draw() {
        super.draw();
        if (stock >= 0) stockFont.drawString(String.valueOf(stock),getX(),getY());
    }

    /**
     * get the current amount of fruit the actor has
     * @return current stock of the actor
     */
    public int getStock() {return stock;}

    /**
     * increments stock by 1 if stock is 0 or more
     */
    public void incrementStock() {if (stock >= 0) stock++;}

    /**
     * decrements stock by one only if stock is more than 0
     */
    public void decrementStock() {if (stock > 0) stock--;}
}
