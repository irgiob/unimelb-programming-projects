package cribbage;

import ch.aplu.jcardgame.Card;
// import ch.aplu.jcardgame.Hand;

public class RandomPlayer extends IPlayer {

	@Override
	public Card discard() {
		return Cribbage.randomCard(hand);
	}

	@Override
	Card selectToLay() {
		return hand.isEmpty() ? null : Cribbage.randomCard(hand);
	}

}
