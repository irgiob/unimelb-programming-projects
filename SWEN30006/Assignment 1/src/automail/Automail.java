package automail;

import simulation.IMailDelivery;

public class Automail {
	      
    public Robot[] robots;
    public MailPool mailPool;
    private ServiceFeeLookup serviceFeeLookup;
    
    public Automail(MailPool mailPool, IMailDelivery delivery, int numRobots) {
        /** Initialize service fee lookup table */

        serviceFeeLookup = new ServiceFeeLookup();

    	/** Initialize the MailPool (with serviceFee lookup table) */
    	
    	this.mailPool = mailPool;
    	this.mailPool.setServiceFeeLookup(serviceFeeLookup);
    	
    	/** Initialize robots (with serviceFee lookup tables) */

    	robots = new Robot[numRobots];
    	for (int i = 0; i < numRobots; i++) {
    	    robots[i] = new Robot(delivery, mailPool, i);
    	    robots[i].setServiceFeeLookup(serviceFeeLookup);
        }
    }

    public Robot[] getRobots() {
        return robots;
    }
}
