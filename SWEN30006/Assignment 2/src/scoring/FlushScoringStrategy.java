package scoring;

import ch.aplu.jcardgame.Card;
import ch.aplu.jcardgame.Hand;
import java.util.ArrayList;

/**
 * scores a hand with a flush (multiple cards with same suit)
 */
public class FlushScoringStrategy implements IScoringStrategy {
    public static final String scoreName = "flush";
    public static final int minFlushSize = 4;
    private int flushSize = 0;

    /**
     * {@inheritDoc}
     */
    @Override
    public ArrayList<Card[]> getQualifyingSubset(Hand hand) {
        ArrayList<Card[]> out = new ArrayList<>();
        int flushLength = 0;
        for (Card card : hand.getCardList()) {
            if (card.getSuit() != hand.get(0).getSuit())
                break;
            flushLength++;
        }
        if (flushLength >= minFlushSize) {
            out.add(hand.getCardList().subList(0, flushLength).toArray(new Card[0]));
            flushSize = flushLength;
        }
        return out;
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
        return scoreName + flushSize;
    }
}
