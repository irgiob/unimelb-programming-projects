/**
 * Irgio Ghazy Basrewan - 1086150
 * Submission for SWEN90004 Assignment 1a
 * 
 * The security guard is assigned to the foyer where they periodically
 * go in and out to escort groups in or out of the museum. 
 * They also perform security checks when groups come and leave.
 * 
 * @author ibasrewan@student.unimelb.edu.au
 * 
 */ 
public class SecurityGuard extends Thread {
	// the foyer the security guard is assigned to
	private Foyer foyer;

	// create a new security guard
	public SecurityGuard(Foyer foyer) {
		this.foyer = foyer;
	}

	public void run() {
		while(!isInterrupted()) {
			try {

				// go inside and if a group is waiting to leave escort them out
				foyer.setGuard(true);
				sleep(Params.WALKING_TIME);
				if (foyer.hasGroup() && foyer.isLeaving()) {
					handleImplicitExit();
				} else {

					// if not then just wait inside for a bit then check again
					sleep(Params.operatePause());
					if (foyer.hasGroup() && foyer.isLeaving()) {
						handleImplicitExit();
					} else {

						// if still no group just go back out explicitly
						System.out.println("security guard goes out");
						System.out.flush();
					}
				}

				// go outside and if a group is waiting to enter escort them in
				foyer.setGuard(false);
				sleep(Params.WALKING_TIME);
				if (foyer.waitingToEnter() != null) {
					handleImplicitEntrance();
				} else {

					// if not just wait outside for a bit then check again
					sleep(Params.operatePause());
					if (foyer.waitingToEnter() != null) {
						handleImplicitEntrance();
					} else {

						// if still no group just go back in explicitly
						System.out.println("security guard goes in");
						System.out.flush();
					}
				}
			}
			catch (InterruptedException e) {
				this.interrupt();
			}
		}
	}

	/* HELPER METHODS */

	// handles escorting of group from outside museum to foyer
	private void handleImplicitEntrance() {
		try {
			sleep(Params.SECURITY_TIME);
		} catch (InterruptedException e) {}
		Group group = foyer.handleArrival(foyer.waitingToEnter());
		System.out.printf("%s arrives at the museum\n", group);
		System.out.flush();
	}

	// handles escorting of group from the foyer to out of the museum
	private void handleImplicitExit() {
		Group group = foyer.handleDeparting();
		System.out.printf("%s departs from the museum\n", group);
		System.out.flush();
		try {
			sleep(Params.SECURITY_TIME);
		} catch (InterruptedException e) {}
	}
}