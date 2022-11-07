/**
 * Irgio Ghazy Basrewan - 1086150
 * Submission for SWEN90004 Assignment 1a
 * 
 * A unique room that serves as the entrance and exit of the museum.
 * Has a security guard assigned that does security checks.
 * 
 * @author ibasrewan@student.unimelb.edu
 * 
 */ 
public class Foyer extends Room {
	/* ATTRIBUTES & CONSTRUCTOR */

	// denotes if the group currently in the room is leaving
	private volatile boolean isLeaving;

	// denotes if the foyer currently has the guard in it
	private volatile boolean hasGuard;

	// denotes the group (or lack thereof) waiting outside to enter
	private volatile Group waitingToEnter;

	// denotes the group (or lack thereof) waiting outside to leave
	private volatile Group waitingToLeave;

	// creates a new foyer
	public Foyer() {
		super(-1);
		this.isLeaving = false;
		this.hasGuard = true;
		this.waitingToEnter = null;
		this.waitingToLeave = null;
	}

	/* MUSEUM ARRIVAL AND DEPARTURE METHODS */

	// adds a new group to the entrance of the museum
	public synchronized void arriveAtMuseum(Group group) {
		while(waitingToEnter != null) {
			try {
				wait();
			} catch(InterruptedException e) {}
		}
		waitingToEnter = group;
	}
	
	// handles groups entering from outside the museum into the foyer
	public synchronized Group handleArrival(Group group) {
		super.addToRoom(group);
		waitingToEnter = null;
		isLeaving = false;
		notifyAll();
		return group;
	}

	// removes group currently waiting outside of the museum to leave
	public synchronized void departFromMuseum() {

		// waits until a group enters the foyer that is marked to leave
		while(waitingToLeave == null) {
			try {
				wait();
			} catch(InterruptedException e) {}
		}
		waitingToLeave = null;
	}
	
	// handles groups leaving from the foyer to outside the museum
	public synchronized Group handleDeparting() {
		Group group = super.removeFromRoom();
		waitingToLeave = group;
		isLeaving = false;
		notifyAll();
		return group;
	}

	/* GETTERS & SETTERS */

	// gets the group currently waiting to enter
	public Group waitingToEnter() {
		return waitingToEnter;
	}

	// denotes whether the group currently in the foyer is leaving
	public boolean isLeaving() {
		return isLeaving;
	}

	// changes the status of whether guard is in or out of the foyer
	public synchronized void setGuard(boolean hasGuard) {
		this.hasGuard = hasGuard;
		notifyAll();
	}

	/* OVERRIDDEN ROOM METHODS */ 

	// waits until the state of whether the foyer has a group or not
	// matches the state provided in the hasGroup argument
	@Override
	public synchronized void waitForHasGroupToBe(boolean hasGroup) {
		if (hasGroup) {
			super.waitForHasGroupToBe(hasGroup);
		} else {

			// if waiting for hasGroup to be false, 
			// add extra logic to also wait for guard to be inside
			while(super.hasGroup() != hasGroup || !hasGuard) {
				try {
					wait();
				} catch(InterruptedException e) {}
			}
		}
	}

	// add a group to the foyer
	@Override
	public synchronized void addToRoom(Group group) {
		super.addToRoom(group);
		
		// group that enters foyer but didn't just arrive means they're leaving
		isLeaving = true;
	}

	// remove a group from the foyer
	@Override
	public synchronized Group removeFromRoom() {

		// if leaving they can only depart museum, not moved to another room
		if (isLeaving) return null;
		Group group = super.removeFromRoom();
		return group;
	}

	// produce an identifying string for the foyer
	@Override
	public String toString() {
		return "the foyer";
	}
}