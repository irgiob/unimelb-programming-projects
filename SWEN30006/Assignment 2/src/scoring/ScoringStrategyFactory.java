package scoring;

/**
 * Singleton factory that creates the strategy for scoring cards in the game
 */
public class ScoringStrategyFactory {
    private static ScoringStrategyFactory _instance = null;

    public static ScoringStrategyFactory getInstance()
    {
        if (_instance == null)
            _instance = new ScoringStrategyFactory();
        return _instance;
    }

    /**
     * gets the scoring strategy to score the players during the play
     * @return a composite scoring strategy containing all the strategies
     * using during the play portion of the game. Each strategy is wrapped
     * with a PlayStrategyDecorator to handle slight variation in scoring
     */
    public IScoringStrategy getPlayScoringStrategy() {
        CompositeScoringStrategy strategy = new CompositeScoringStrategy();

        // add all relevant strategies below
        strategy.add(new PlayStrategyDecorator(new ShowStrategyDecorator(new SumScoringStrategy(15, "fifteen"))));
        strategy.add(new PlayStrategyDecorator(new ShowStrategyDecorator(new SumScoringStrategy(31, "thirtyone"))));
        strategy.add(new PlayStrategyDecorator(new RunScoringStrategy(3)));
        strategy.add(new PlayStrategyDecorator(new RunScoringStrategy(4)));
        strategy.add(new PlayStrategyDecorator(new RunScoringStrategy(5)));
        strategy.add(new PlayStrategyDecorator(new RunScoringStrategy(6)));
        strategy.add(new PlayStrategyDecorator(new RunScoringStrategy(7)));
        strategy.add(new PlayStrategyDecorator(new PairScoringStrategy(2)));
        strategy.add(new PlayStrategyDecorator(new PairScoringStrategy(3)));
        strategy.add(new PlayStrategyDecorator(new PairScoringStrategy(4)));

        return strategy;
    }

    /**
     * gets the scoring strategy to score the players during the show
     * @return a composite scoring strategy containing all the strategies
     * using during the show portion of the game
     */
    public IScoringStrategy getShowScoringStrategy() {
        CompositeScoringStrategy strategy = new CompositeScoringStrategy();

        // add all relevant strategies below
        strategy.add(new ShowStrategyDecorator(new SumScoringStrategy(15, "fifteen")));
        strategy.add(new ShowStrategyDecorator(new RunScoringStrategy(3)));
        strategy.add(new ShowStrategyDecorator(new RunScoringStrategy(4)));
        strategy.add(new ShowStrategyDecorator(new RunScoringStrategy(5)));
        strategy.add(new ShowStrategyDecorator(new PairScoringStrategy(2)));
        strategy.add(new PlayStrategyDecorator(new PairScoringStrategy(3)));
        strategy.add(new PlayStrategyDecorator(new PairScoringStrategy(4)));
        strategy.add(new ShowStrategyDecorator(new FlushScoringStrategy()));
        strategy.add(new ShowStrategyDecorator(new JackScoringStrategy()));

        return new ShowStrategyDecorator(strategy);
    }
}
