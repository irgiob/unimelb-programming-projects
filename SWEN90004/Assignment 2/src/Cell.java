import java.util.ArrayList;

/**
 * Single cell in the world grid
 */
public class Cell {
    /**
     * Which row on the world grid the cell is located
     */
    public final int row;

    /**
     * Which column on the world grid the cell is located
     */
    public final int col;

    /**
     * The person currently residing in the cell
     */
    private Person occupant;

    /**
     * The list of cells that are visible from the current cell
     */
    private final ArrayList<Cell> visibleCells;

    /**
     * Initializes a new cell
     * @param row that cell will be located at
     * @param col that cell will be located at
     */
    public Cell(int row, int col) {
        this.row = row;
        this.col = col;
        visibleCells = new ArrayList<>();
    }

    /**
     * Calculates all the cells that would be visible from the current cell
     * @param world entire grid of cells of the world
     * @param vision how far can cells still be visible from
     */
    // identify all cells visible from current cell
    public void calculateVisibleCells(Cell[][] world, int vision) {
        bfs(vision, row, col, world);
        visibleCells.remove(this);
    }

    /**
     * A recursive limited breadth-first search algorithm that is used to
     * Add cells within visible range to ArrayList
     * @param depth how far away from the cell are we currently search
     * @param row of the cell currently being searched
     * @param col of the cell currently being search
     * @param world entire grid of cells of the world
     */
    private void bfs(int depth, int row, int col, Cell[][] world) {
        if (depth > 0) {
            // coordinates of adjacent cells
            int[][] neighbours = {{row-1,col},{row,col-1},{row+1,col},{row,col+1}};
            for (int[] neighbour : neighbours) {
                int newRow = neighbour[0];
                int newCol = neighbour[1];

                // handle wrap around logic when on edge of world
                if (newRow < 0) newRow = world.length - 1;
                if (newRow >= world.length) newRow = 0;
                if (newCol < 0) newCol = world.length - 1;
                if (newCol >= world.length) newCol = 0;

                // add cell if not yet visited and recurse deeper
                Cell cell = world[newRow][newCol];
                if (!visibleCells.contains(cell)) {
                    visibleCells.add(cell);
                    bfs(depth-1, newRow, newCol, world);
                }
            }
        }
    }

    /**
     * Get a list of all cells visible from the current cell
     * @return list of visible cells
     */
    public ArrayList<Cell> getVisibleCells() {
        return visibleCells;
    }

    /**
     * Add a person to the current cell
     * @param person to be added to the cell
     */
    public void addOccupant(Person person) {
        occupant = person;
    }

    /**
     * Remove the person currently residing in the cell
     */
    public void removeOccupant() {
        occupant = null;
    }

    /**
     * Get the person currently residing in the cell
     * @return the cell's current occupant
     */
    public Person getOccupant() {
        return occupant;
    }
}
