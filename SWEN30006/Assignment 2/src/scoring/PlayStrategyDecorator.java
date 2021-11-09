package scoring;

import ch.aplu.jcardgame.Card;
import ch.aplu.jcardgame.Hand;
import java.util.ArrayList;
import java.util.Arrays;

/**
 * decorator that wraps scoring strategies during the play portion of the game
 *
 * necessary as points obtained during play must come from subsets that contain
 * the card that was just placed, instead of any of the cards that are placed
 */
public class PlayStrategyDecorator implements IScoringStrategy {
    private final IScoringStrategy wrapped;

    /**
     * @param wrapped scoring strategy that is being wrapped by the decorator
     */
    public PlayStrategyDecorator(IScoringStrategy wrapped) {
        this.wrapped = wrapped;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public ArrayList<Card[]> getQualifyingSubset(Hand hand) {
        int handSize=hand.getNumberOfCards();
        ArrayList<Card[]> out = new ArrayList<>();
        for (Card[] subset : wrapped.getQualifyingSubset(hand)) {
            // subsets must contain card just placed and all cards should be "touching" in the hand
            boolean contains = true;
            for (int i=handSize-1;i>=handSize-subset.length;i--) {
                if (!Arrays.asList(subset).contains(hand.get(i))) {
                    contains = false;
                    break;
                }
            }
            if (contains)
                out.add(subset);
        }
        return out;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public int getSubsetScore(Card[] subset) {
        return wrapped.getSubsetScore(subset);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String getScorerName() {
        return wrapped.getScorerName();
    }
}
