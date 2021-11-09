package logging;

import java.io.*;

public class Logger {

    private static Logger _instance;

    private static final String filePath = "cribbage.log";
    private final int nPlayers = 2;
    private final int[] scores = new int[nPlayers];
    private int playerId = 0;
    private PrintWriter printWriter;

    private Logger() {
        try {
            printWriter = new PrintWriter(new FileWriter(filePath));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static Logger get_instance() {
        if (_instance == null) _instance = new Logger();
        return _instance;
    }

    public void logScore(int score, String scoreType, String scoredCards) {
        scores[playerId] += score;
        if (scoredCards != "")
            scoredCards = "," + scoredCards;

        writeMessageToLog(String.format(
                "score,P%d,%d,%d,%s%s",
                playerId,
                scores[playerId],
                score,
                scoreType,
                scoredCards
        ));
    }

    public void logPlayer(String playerType, int playerId) {
        writeMessageToLog(String.format("%s,P%d",playerType,playerId));
    }

    public void logSeed(int seed) {
        writeMessageToLog(String.format("seed,%d",seed));
    }

    public void logDeal(String hand,int playerId) {
        writeMessageToLog(String.format("deal,P%d,%s",playerId,hand));
    }

    public void logDiscard(String crib, int playerId) {
        writeMessageToLog(String.format("discard,P%d,%s",playerId,crib));
    }
    public void logStarter(String starter) {
        writeMessageToLog(String.format("starter,%s",starter));
    }
    public void logPlay(int playerId,int sum, String card){
        writeMessageToLog(String.format("play,P%d,%d,%s",playerId,sum,card));
    }
    public void logShowHand(int playerId,String starter, String hand) {
        writeMessageToLog(String.format("show,P%d,%s+%s",playerId,starter,hand));
    }
    public void logGo(int playerId,int score) {
        writeMessageToLog(String.format("score,P%d,%d,%d,go",playerId,score,1));
    }

    public void updateInfo(int playerId,int p0Score,int p1Score) {
        this.playerId = playerId;
        this.scores[0] = p0Score;
        this.scores[1] = p1Score;
    }

    private void writeMessageToLog(String message) {
        printWriter.println(message);
        printWriter.flush();
    }
}
