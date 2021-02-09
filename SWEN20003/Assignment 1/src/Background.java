import bagel.Image;

/**
 * Background class used to display game background image
 *
 * Separated to better encapsulate with interface usage
 */
public class Background implements Drawable{
    private Image background;

    /**
     * initialize background image for game
     */
    public Background() {
        background = new Image("res/images/background.png");
    }

    /**
     * draw background onto window
     */
    public void draw() {
        background.drawFromTopLeft(0, 0);
    }
}
