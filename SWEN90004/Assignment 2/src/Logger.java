import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;

/**
 * A helper class that's used to log and export the simulation data across multiple turns
 */
public class Logger {
    /**
     * A list of how many active agents there are at every turn of the simulation
     */
    private final ArrayList<Integer> dataActive = new ArrayList<>();

    /**
     * A list of how many quiet agents there are at every turn of the simulation
     */
    private final ArrayList<Integer> dataQuiet = new ArrayList<>();

    /**
     * A list of how many jailed agents there are at every turn of the simulation
     */
    private final ArrayList<Integer> dataJailed = new ArrayList<>();

    /**
     * The column headers of the logger data
     */
    public final static String COLUMN_HEADERS = "Turn,Active,Quiet,Jailed";

    /**
     * Logs agent statistics at the current point in time
     * @param agents of the simulation
     */
    public void logAgents(Agent[] agents) {
        int nActive = 0;
        int nQuiet = 0;
        int nJailed = 0;
        for (Agent agent : agents) {
            if (agent.isActive())
                nActive += 1;
            else {
                if (agent.getJailTimeLeft() <= 0)
                    nQuiet += 1;
                else
                    nJailed += 1;
            }
        }
        dataActive.add(nActive);
        dataQuiet.add(nQuiet);
        dataJailed.add(nJailed);
    }

    /**
     * Exports all the logger's data as a CSV file
     */
    public void exportDataToCSV() {
        try {
            String time = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS).toString();
            FileWriter myWriter = new FileWriter("ModelData_" + time + ".csv");
            myWriter.write(dataToString());
            myWriter.close();
            System.out.println("Model has been run. Run data saved to csv file.");
        } catch (IOException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }
    }

    /**
     * Converts all the logger's data into a single string
     * @return simulation data as string
     */
    public String dataToString() {
        StringBuilder out = new StringBuilder(COLUMN_HEADERS + "\n");
        for(int i=0;i<dataActive.size();i++) {
            out.append(dataAtTurn(i)).append("\n");
        }
        return out.toString();
    }

    /**
     * Gets the data of the simulation at a specific turn
     * @param turn what turn of the simulation to get data of
     * @return the data of the simulation at that turn in string form
     */
    public String dataAtTurn(int turn) {
        return String.format("%d,%d,%d,%d", turn, dataActive.get(turn), dataQuiet.get(turn), dataJailed.get(turn));
    }
}
