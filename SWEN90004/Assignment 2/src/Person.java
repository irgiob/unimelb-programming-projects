import java.util.ArrayList;
import java.util.Random;

/**
 * Entity that exist and can move between the cells of the world grid
 */
public abstract class Person {
    /**
     * The current cell the person is residing in
     */
    private Cell cell;

    /**
     * @return the current cell the person is residing in
     */
    public Cell getCell() {
        return cell;
    }

    /**
     * Changes the cell the person resides in
     * @param cell new cell for person to reside in
     */
    public void setCell(Cell cell) {
        this.cell = cell;
    }

    /**
     * Determines how a person moves around the world grid and moves them based on those rules
     */
    public void move() {
        // identify all the unoccupied cells that can be moved to
        ArrayList<Cell> availableCells = new ArrayList<>();
        Random random = new Random();
        for (Cell cell : cell.getVisibleCells())
            if (cell.getOccupant() == null)
                availableCells.add(cell);
        // pick an available cell at random and move to it
        if (availableCells.size() > 0) {
            Cell dest = availableCells.get(random.nextInt(availableCells.size()));
            if (cell.getOccupant() == this) cell.removeOccupant();
            cell = dest;
            cell.addOccupant(this);
        }
    }
}
