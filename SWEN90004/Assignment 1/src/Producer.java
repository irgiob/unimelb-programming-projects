/**
 * Irgio Ghazy Basrewan - 1086150
 * Submission for SWEN90004 Assignment 1a
 * Note: this was provided scaffold code, no changes were made to this file
 * 
 * Produces new tour groups at the base of the mountain park.
 * 
 * @author ngeard@unimelb.edu.au
 *
 */

public class Producer extends Thread {

	// the cable car to which the groups will be sent.
	private Foyer foyer;
	
	// create a new producer
	Producer(Foyer foyer) {
		this.foyer = foyer;
	}
	
	// groups are sent to the cable car at random intervals
	public void run() {
		while(!isInterrupted()) {
			try {
				// send a new group to the cable car
				Group group = Group.getNewGroup();
				foyer.arriveAtMuseum(group);
				
				// wait for the cable car to operate
				sleep(Params.WALKING_TIME + Params.SECURITY_TIME);
				
				// let some time pass before the next group arrives
				sleep(Params.arrivalPause());
			}
			catch (InterruptedException e) {
				this.interrupt();
			}
		}
	}
}
