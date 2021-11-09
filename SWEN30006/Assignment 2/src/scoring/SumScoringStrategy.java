package scoring;

import ch.aplu.jcardgame.Card;
import ch.aplu.jcardgame.Hand;
import cribbage.Cribbage.Rank;
import java.util.ArrayList;

/**
 * scores a hand that has a subset of cards that sum up to a specific number
 */
public class SumScoringStrategy implements IScoringStrategy{
    public static final int SUM_SCORE = 2;
    private final int sum;
    private final String sumString;

    /**
     * @param sum the sum a subset of cards in the hand should equal to
     */
    public SumScoringStrategy(int sum,String sumString) {
        this.sum = sum;
        this.sumString = sumString;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public ArrayList<Card[]> getQualifyingSubset(Hand hand) {
        ArrayList<Card[]> out = new ArrayList<>();
        ArrayList<Card> cards = hand.getCardList();
        for(int i = 0; i < cards.size(); i++)
            getSumSets(i, cards, out, new ArrayList<>(), 0);
        return out;
    }

    /**
     * gets all subsets of cards that have a sum equal to object's sum attribute
     * @param currentIndex the current index being checked
     * @param cards the complete list of cards
     * @param out the final ArrayList of subsets equaling to sum
     * @param usedCards the cards used in the current subset being checked
     * @param sum the sum of the current subset being checked
     */
    private void getSumSets(int currentIndex, ArrayList<Card> cards,
                            ArrayList<Card[]> out, ArrayList<Card> usedCards, int sum) {
        if (currentIndex >= cards.size())
            return;

        sum = sum + ((Rank)cards.get(currentIndex).getRank()).value;
        usedCards.add(cards.get(currentIndex));
        if (sum == this.sum) {
            out.add(usedCards.toArray(new Card[0]));
            return;
        }

        if (sum > this.sum)
            return;

        for (int i = currentIndex + 1; i < cards.size(); i++)
            getSumSets(i, cards, out, new ArrayList<>(usedCards), sum);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public int getSubsetScore(Card[] subset) {
        return SUM_SCORE;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String getScorerName() {
        return sumString;
    }
}
