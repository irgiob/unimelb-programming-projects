package scoring;

import ch.aplu.jcardgame.Card;

public class Score {
    private final String scoreName;
    private final int score;
    private final Card[] scoredCards;

    public Score(String scoreName, int score, Card[] scoredCards) {
        this.scoreName = scoreName;
        this.score = score;
        this.scoredCards = scoredCards;
    }

    public String getScoreName() {
        return scoreName;
    }

    public int getScore() {
        return score;
    }

    public Card[] getScoredCards() {
        return scoredCards;
    }
}
