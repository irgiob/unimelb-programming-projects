package scoring;

import ch.aplu.jcardgame.Card;
import ch.aplu.jcardgame.Hand;
import cribbage.Cribbage.Rank;
import java.util.ArrayList;

/**
 * scores a hand with a jack the same suit as the starter card
 * note: assumes starter card is the last card in the hand
 */
public class JackScoringStrategy implements IScoringStrategy{
    public static final String scoreName = "jack";

    /**
     * {@inheritDoc}
     */
    @Override
    public ArrayList<Card[]> getQualifyingSubset(Hand hand) {
        ArrayList<Card[]> out = new ArrayList<>();
        for (int i=0; i < hand.getNumberOfCards() - 1; i++)
            if (hand.get(i).getRank() == Rank.JACK &&
                    hand.get(i).getSuit() == hand.getLast().getSuit()) {
                Card[] cardArr = new Card[1];
                cardArr[0] = hand.get(i);
                out.add(cardArr);
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
        return scoreName;
    }
}
