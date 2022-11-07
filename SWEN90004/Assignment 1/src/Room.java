/**
 * Irgio Ghazy Basrewan - 1086150
 * Submission for SWEN90004 Assignment 1a
 * 
 * A room in the museum, each with its own unique id, that holds the
 * tourist (and guides) that are in the museum.
 * 
 * @author ibasrewan@student.unimelb.edu.au
 *  
 */
public class Room {
	/* ATTRIBUTES & CONSTRUCTOR */

	// id of the room
	private int id;

	// the current group that is inside the room (or null if its empty)
	private volatile Group currentGroup;

	// create a new room
	public Room(int id) {
		this.id = id;
	}

	/* GROUP-MOVING METHODS */

	// add a group to a room
	public synchronized void addToRoom(Group group) {
		if (group != null) {
			currentGroup = group;
			notifyAll();
		}
	}

	// remove a group from a room
	public synchronized Group removeFromRoom() {
		Group group = currentGroup;
		currentGroup = null;
		notifyAll();
		return group;
	}

	/* OTHER METHODS */

	// waits until the state of whether the room has a group or not
	// matches the state provided in the hasGroup argument
	public synchronized void waitForHasGroupToBe(boolean hasGroup) {
		while(hasGroup() != hasGroup) {
			try {
				wait();
			} catch(InterruptedException e) {}
		}
	}

	// checks if the room currently has a group
	public boolean hasGroup() {
		return currentGroup != null;
	}

	// produce an identifying string for the room
	@Override
	public String toString() {
		return "room  " + id;
	}
}