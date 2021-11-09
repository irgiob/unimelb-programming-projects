package cribbage;

import ch.aplu.jcardgame.Deck;
import ch.aplu.jcardgame.Card;
import ch.aplu.jcardgame.CardAdapter;
import ch.aplu.jcardgame.CardListener;
import ch.aplu.jcardgame.Hand;

public class HumanPlayer extends IPlayer {
	Card selected;
	
	final CardListener cardListener = new CardAdapter()  // Player plays card
		    {
		      public void leftDoubleClicked(Card card) { selected = card; hand.setTouchEnabled(false); }
		    };
	
	@Override
	public void startSegment(Deck deck, Hand hand) {
		super.startSegment(deck, hand);
		hand.addCardListener(cardListener);
	}
	
	@Override
	public Card discard() {
		selected = null;
		hand.setTouchEnabled(true);
		Cribbage.setStatus("Player " + id + " double-click card to discard.");
		while (null == selected) Cribbage.delay(100);
		return selected;
	}

	@Override
	Card selectToLay() {
		if (hand.isEmpty()) {
			return null;
		} else {
			selected = null;
			hand.setTouchEnabled(true);
			Cribbage.setStatus("Player " + id + " double-click card to lay.");
			while (null == selected) Cribbage.delay(100);
			return selected;
		}
	}

}