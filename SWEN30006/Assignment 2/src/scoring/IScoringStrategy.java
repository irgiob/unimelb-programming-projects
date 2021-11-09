package scoring;

import ch.aplu.jcardgame.Card;
import ch.aplu.jcardgame.Hand;
import java.util.ArrayList;

/**
 * interface for applying scoring strategies
 */
public interface IScoringStrategy {

    /**
     * checks hand and returns all subsets of cards that qualify
     * for this type of scoring
     * @param hand the hand/set of cards to be checked
     * @return subset(s) of cards that can be scored with this strategy
     */
    ArrayList<Card[]> getQualifyingSubset(Hand hand);

    /**
     * score a single valid subset of this strategy
     * @param subset a subset of cards already confirmed to be valid
     * @return the score value for one subset of this type
     */
    int getSubsetScore(Card[] subset);

    /**
     * get the score for a hand based on a strategy
     * @param hand the hand/set of cards to be checked
     * @return the total score based on the strategy
     */
    default Score[] getScore(Hand hand) {
        ArrayList<Score> scores = new ArrayList<>();
        for (Card[] subset : getQualifyingSubset(hand)) {
            int subsetScore = getSubsetScore(subset);
            scores.add(new Score(getScorerName(), subsetScore, subset));
        }
        return scores.toArray(Score[]::new);
    }

    /**
     * gets the name of the scoring strategy implementing this interface
     * @return the name of type of score that was given
     */
    default String getScorerName() {
        return getClass().getName();
    }
}
