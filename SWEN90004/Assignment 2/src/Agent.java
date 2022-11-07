import java.util.ArrayList;
import java.util.Random;
import static java.lang.Math.exp;
import static java.lang.Math.floor;

/**
 * A person subclass that based on certain factors can start rebelling or be jailed
 */
public class Agent extends Person{
    /**
     * Determines whether the agent is currently rebelling or not
     */
    private boolean isActive = false;

    /**
     * How much does the agent trust the government
     */
    private final double governmentLegitimacy;

    /**
     * How much personal struggle does the agent have
     */
    private final double perceivedHardship;

    /**
     * How much risk is the agent willing to take to rebel
     */
    private final double riskAversion;

    /**
     * How much time left the agent is stuck in jail
     */
    private int jailTimeLeft = 0;

    /**
     * Initialize a new agent
     * @param perceivedHardship How much personal struggle does the agent have
     * @param riskAversion How much risk is the agent willing to take to rebel
     * @param governmentLegitimacy How much does the agent trust the government
     */
    public Agent(double perceivedHardship, double riskAversion, double governmentLegitimacy) {
        this.perceivedHardship = perceivedHardship;
        this.riskAversion = riskAversion;
        this.governmentLegitimacy = governmentLegitimacy;
    }

    /**
     * @return the current rebelling state of the agent
     */
    public boolean isActive() {
        return isActive;
    }

    /**
     * Checks if the agent's circumstances are right for them to rebel, and makes them rebel if they are
     */
    public void determineBehaviour() {
        if (jailTimeLeft <= 0 & grievance() - netRisk() > Params.THRESHOLD)
            isActive = true;
    }

    /**
     * Calculates how much dissatisfaction an agent has with the government
     * @return the agent's personal level of grievance with the government
     */
    private double grievance() {
        return perceivedHardship * (1 - governmentLegitimacy);
    }

    /**
     * Calculates how likely the agent feels they will be arrested by a cop
     * @return the estimated arrest probability
     */
    private double estimatedArrestProbability() {
        // count number of visible cops and agents within field of vision
        double rebelsInVision = 0;
        double copsInVision = 0;
        for (Cell cell : getCell().getVisibleCells()) {
            Person occupant = cell.getOccupant();
            if (occupant instanceof Cop)
                copsInVision += 1;
            else if (occupant instanceof Agent agent && agent.isActive) {
                rebelsInVision += 1;
            }
        }

        // calculate estimated arrest probability
        return 1 - exp(-Params.K * floor(copsInVision / rebelsInVision));
    }

    /**
     * Calculates the total risk an agent feels they have if they rebel
     * @return the arrest probability influenced by the agent's personal risk aversion
     */
    private double netRisk() {
        return riskAversion * estimatedArrestProbability();
    }

    /**
     * @return the amount of time left the agent is stuck in jail
     */
    public int getJailTimeLeft() {
        return jailTimeLeft;
    }

    /**
     * Sets an agent to be jailed on the current cell they're on
     * @param turns the number of turns the agent will be jailed
     */
    public void jailAgent(int turns) {
        isActive = false;
        jailTimeLeft = turns;
    }

    /**
     * Decrease the agent's jail time by a single turn
     */
    public void decrementJailTimeLeft() {
        if (jailTimeLeft > 0) jailTimeLeft -= 1;
    }

    /**
     * Determines how the agent moves around the world grid and moves them based on those rules
     */
    @Override
    public void move() {
        // if agent is in jail do not move
        if (getJailTimeLeft() > 0) return;

        // if extension is enabled use extension move method
        if (Params.MOVE_TOWARDS_REBELS_EXT) {
            moveExtension();
            return;
        }

        // else use default move system from parent class
        super.move();
    }

    /**
     * A variation of the way the agent moves around the world grid for the model's extension
     * Moves the agent in the general direction of other rebels rather than randomly
     */
    private void moveExtension() {
        // identify cells that are unoccupied and cells that have rebels
        ArrayList<Cell> availableCells = new ArrayList<>();
        ArrayList<Cell> rebelCells = new ArrayList<>();
        for (Cell cell : getCell().getVisibleCells()) {
            Person occupant = cell.getOccupant();
            if (occupant == null)
                availableCells.add(cell);
            else if (occupant instanceof Agent && ((Agent) occupant).isActive())
                rebelCells.add(cell);
        }

        // if agent can move
        if (availableCells.size() > 0) {

            // for all available cells, find cells with most visible rebels
            ArrayList<Cell> options = new ArrayList<>();
            double bestScore = 0;
            for (Cell cell : availableCells) {

                // scoring algorithm: Calculate visibility intersection between agent and potential cell to move to
                // score of the cell is determined based on the number of rebels within that visibility intersection
                ArrayList<Cell> cellArea = new ArrayList<>(cell.getVisibleCells());
                cellArea.retainAll(rebelCells);
                double score = cellArea.size();

                // update variables with current best scoring cells to move to
                if (score >= bestScore) {
                    if (score > bestScore) {
                        options = new ArrayList<>();
                        bestScore = score;
                    }
                    options.add(cell);
                }
            }

            // choose random cell from cells with most visible rebels and move to it
            Random random = new Random();
            Cell dest = options.get(random.nextInt(options.size()));
            if (getCell().getOccupant() == this) getCell().removeOccupant();
            setCell(dest);
            getCell().addOccupant(this);
        }
    }
}
