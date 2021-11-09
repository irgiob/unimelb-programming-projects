package scoring;

import ch.aplu.jcardgame.Card;
import ch.aplu.jcardgame.Hand;
import java.util.ArrayList;

/**
 * scores a hand that contains a continuous sequence (run) of cards
 */
public class RunScoringStrategy implements IScoringStrategy {
    public static final String scoreName = "run";
    private final int runLength;

    /**
     * @param runLength length of run to look for
     */
    public RunScoringStrategy(int runLength) {
        this.runLength = runLength;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public ArrayList<Card[]> getQualifyingSubset(Hand hand) {
        return hand.getSequences(runLength);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public int getSubsetScore(Card[] subset) {
        return subset.length;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String getScorerName() {
        return scoreName + runLength;
    }
}
