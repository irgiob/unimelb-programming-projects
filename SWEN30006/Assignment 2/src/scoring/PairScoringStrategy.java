package scoring;

import ch.aplu.jcardgame.Card;
import ch.aplu.jcardgame.Hand;
import cribbage.Cribbage.Rank;
import java.util.ArrayList;

/**
 * scores a hand with multiple cards of the same rank
 */
public class PairScoringStrategy implements IScoringStrategy {
    public static final String scoreName = "pair";
    private final int pairSize;

    /**
     * @param pairSize the size of the set of cards of same rank to look for
     */
    public PairScoringStrategy(int pairSize) {
        this.pairSize = pairSize;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public ArrayList<Card[]> getQualifyingSubset(Hand hand) {
        ArrayList<Card[]> out = new ArrayList<>();
        for (Rank rank : Rank.values()) {
            Card[] cardSet = hand.getCardsWithRank(rank).toArray(new Card[0]);
            if (cardSet.length == pairSize) {
                out.add(cardSet);
            }
        }
        return out;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public int getSubsetScore(Card[] subset) {
        return subset.length * (subset.length - 1);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String getScorerName() {
        return scoreName + pairSize;
    }
}
