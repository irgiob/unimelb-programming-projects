import java.util.ArrayList;
import java.util.Random;

/**
 * A person subclass that has the ability to search for active agents and jail them
 */
public class Cop extends Person{
    /**
     * The maximum amount of time a cop can jail an agent
     */
    private final int maxJailTerm;

    /**
     * Initialize a new cop
     * @param maxJailTerm The maximum amount of time a cop can jail an agent
     */
    public Cop(int maxJailTerm) {
        this.maxJailTerm = maxJailTerm;
    }

    /**
     * Find all active agents within the cop's field of vision
     * @return ArrayList of rebels within cop's field of vision
     */
    private ArrayList<Agent> findRebels() {
        ArrayList<Agent> rebels = new ArrayList<>();
        for (Cell cell : getCell().getVisibleCells())
            if (cell.getOccupant() instanceof Agent agent && agent.isActive()) {
                rebels.add(agent);
            }
        return rebels;
    }

    /**
     * Move to the cell the agent is on and jail them to that cell
     * @param agent the agent to be jailed
     */
    private void jailAgent(Agent agent) {
        Random random = new Random();
        agent.jailAgent(random.nextInt(maxJailTerm));
        Cell cell = agent.getCell();
        getCell().removeOccupant();
        setCell(cell);
        cell.addOccupant(this);
    }

    /**
     * Finds all rebels within field of vision and randomly jails one of them
     */
    public void enforce() {
        Random random = new Random();
        ArrayList<Agent> rebels = findRebels();
        if (rebels.size() > 0)
            jailAgent(rebels.get(random.nextInt(rebels.size())));
    }
}
