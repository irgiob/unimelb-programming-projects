package scoring;

import ch.aplu.jcardgame.Card;
import ch.aplu.jcardgame.Hand;
import java.util.ArrayList;

/**
 * decorator that wraps scoring strategies during the show portion of the game
 *
 * necessary as points obtained during show must come from hands (& crib)
 * that also include the starter card. This decorator changes getScore to
 * pass in both a hand and the starter card
 */
public class ShowStrategyDecorator implements IScoringStrategy {
    private final IScoringStrategy wrapped;

    /**
     * @param wrapped scoring strategy that is being wrapped by the decorator
     */
    public ShowStrategyDecorator(IScoringStrategy wrapped) {
        this.wrapped = wrapped;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public ArrayList<Card[]> getQualifyingSubset(Hand hand) {
        return wrapped.getQualifyingSubset(hand);
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
     *
     * Overloaded version of getScore that takes in the stater card as well.
     * The starter card is added as the final card of the hand.
     * Scoring strategies that use the starter assume it is the last card in
     * the hand in order to confirm with the requirements of the interface.
     */
    public Score[] getScore(Hand hand, Hand starter) {
        hand.insert(starter, false);
        return wrapped.getScore(hand);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String getScorerName() {
        return wrapped.getScorerName();
    }
}
