package scoring;

import ch.aplu.jcardgame.Card;
import ch.aplu.jcardgame.Hand;
import java.util.ArrayList;
import java.util.Collections;

/**
 * combines multiple scoring strategies together
 */
public class CompositeScoringStrategy implements IScoringStrategy{
    ArrayList<IScoringStrategy> strategies = new ArrayList<>();

    /**
     * {@inheritDoc}
     */
    @Override
    public ArrayList<Card[]> getQualifyingSubset(Hand hand) {
        return null;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public int getSubsetScore(Card[] subset) {
        return 0;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Score[] getScore(Hand hand) {
        ArrayList<Score> scores = new ArrayList<>();
        for (IScoringStrategy strategy : strategies) {
            Collections.addAll(scores, strategy.getScore(hand));
        }
        return scores.toArray(Score[]::new);
    }

    /**
     * adds a strategy to the composite strategy
     * @param strategy to be added in composite strategy
     */
    void add(IScoringStrategy strategy) {
        strategies.add(strategy);
    }
}
