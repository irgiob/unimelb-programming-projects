/**
 * Irgio Ghazy Basrewan - 1086150
 * Submission for SWEN90004 Assignment 1a
 * 
 * A guide is assigned two neighbouring rooms and serves the purpose
 * of moving groups between said rooms. While doing so it ensures
 * the room the group is moving to is empty before moving them.
 * 
 * @author ibasrewan@student.unimelb.edu.au
 * 
 */
public class Guide extends Thread{
	// the main room the guide is assigned and the room they move groups to
	private Room current;
	private Room next;

	// creates a new guide
	public Guide(Room current, Room next) {
		this.current = current;
		this.next = next;
	}

	public void run() {
		while(!isInterrupted()) {
			try {

				// waits for new group to arrive at assigned main room
				current.waitForHasGroupToBe(true);
				
				// begins moving to the next room
				Group group = current.removeFromRoom();
				System.out.printf("%s leaves %s\n", group, current);
				System.out.flush();
				sleep(Params.WALKING_TIME);

				// waits for the next room to be empty before entering
				next.waitForHasGroupToBe(false);
				
				// finishes moving group to next room then walks back
				next.addToRoom(group);
				System.out.printf("%s enters %s\n", group, next);
				System.out.flush();
				sleep(Params.WALKING_TIME);
			} catch (InterruptedException e) {
				this.interrupt();
			}
		}
	}
}