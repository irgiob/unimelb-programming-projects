import java.io.FileReader;
import java.io.BufferedReader;
import java.util.ArrayList;

/**
 * World class contains all actors and their positions, and updates them
 */
public class World {
    // world attributes
    private Background background;
    private ArrayList<AbstractActor> worldActors;

    /**
     * create new world using data from world file
     */
    public World(String worldFile) {
        background = new Background();
        worldActors = new ArrayList<>();

        try (BufferedReader br =
                     new BufferedReader(new FileReader(worldFile))) {
            String text;
            while ((text = br.readLine()) != null) {
                String[] actor = text.split(",");
                int x = Integer.parseInt(actor[1]);
                int y = Integer.parseInt(actor[2]);

                switch (actor[0]) {
                    case "Tree": {worldActors.add(new Tree(x,y)); break;}
                    case "Gatherer": {worldActors.add(new Gatherer(x,y)); break;}
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * draws all world actors on window
     */
    public void draw() {
        background.draw();
        for(AbstractActor actor: worldActors) {
            actor.draw();
        }
    }

    /**
     * updates world actors
     */
    public void update() {
        for(AbstractActor actor: worldActors) {
            actor.update();
        }
    }

}
