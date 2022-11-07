/**
 * Irgio Ghazy Basrewan - 1086150
 * Submission for SWEN90004 Assignment 1a
 * Note: this was provided scaffold code, no changes were made to this file
 * 
 * The top-level component of the museum simulator.
 * 
 * It is responsible for:
 *  - creating all the components of the system; 
 *  - starting all of the processes; 
 *  - supervising processes regularly to check that all are alive.
 *  
 * @author ngeard@unimelb.edu.au
 * 
 */ 

public class Main {

	/**
	 * The driver of the museum simulator system:
	 */

	public static void main(String [] args) {
		int n = Params.ROOMS;

		// generate the cable car
		Foyer foyer = new Foyer();

		// create an array to hold the villages
		Room[] room = new Room[n];

		// generate the individual villages
		for (int i = 0; i < n; i++) {
			room[i] = new Room(i);
		}

		// generate the producer, the consumer and the operator
		Producer producer = new Producer(foyer);
		Consumer consumer = new Consumer(foyer);
		SecurityGuard securityGuard = new SecurityGuard(foyer);

		// create an array trains to hold the guides
		Guide[] guide = new Guide[n-1];

		// generate the individual guides
		for (int i = 0; i < n-1; i++) {
			guide[i] = new Guide(room[i], room[i+1]);
			guide[i].start();
		}

		// generate guides that pick up and deliver between 
		// the rooms and the security check
		Guide firstGuide = new Guide(foyer, room[0]);
		Guide lastGuide = new Guide(room[n-1], foyer);

		//start up all the components
		firstGuide.start();
		lastGuide.start();
		producer.start();
		consumer.start();
		securityGuard.start();

		//regularly check on the status of threads
		boolean guides_alive = true;
		for (int i = 0; i < n-1; i++) {
			guides_alive = guides_alive && guide[i].isAlive();
		}
		while (producer.isAlive() && consumer.isAlive()
				&& securityGuard.isAlive() && guides_alive) {
			try {
				Thread.sleep(Params.MAIN_INTERVAL);
			}
			catch (InterruptedException e) {
				System.out.println("Main was interrupted");
				break;
			}
			for (int i = 0; i < n-1; i++) {
				guides_alive = guides_alive && guide[i].isAlive();
			}
		}

		//if some thread died, interrupt all other threads and halt
		producer.interrupt();    
		consumer.interrupt();
		securityGuard.interrupt();

		for (int i = 0; i < n-1; i++) {
			guide[i].interrupt();
		}
		firstGuide.interrupt();
		lastGuide.interrupt();

		System.out.println("Main terminates, all threads terminated");
		System.exit(0);
	}
}
