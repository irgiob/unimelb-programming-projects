package automail;

import java.util.LinkedList;
import java.util.Comparator;
import java.util.ListIterator;

import exceptions.ItemTooHeavyException;

/**
 * addToPool is called when there are mail items newly arrived at the building to add to the MailPool or
 * if a robot returns with some undelivered items - these are added back to the MailPool.
 * The data structure and algorithms used in the MailPool is your choice.
 * 
 */
public class MailPool {

	private class Item {
		int destination;
		MailItem mailItem;
		// Use stable sort to keep arrival time relative positions
		
		public Item(MailItem mailItem) {
			destination = mailItem.getDestFloor();
			this.mailItem = mailItem;
		}
		private boolean isPriorityItem() {
			assert serviceFeeLookup != null;
			// whenever this is queried for sorting it will always have the most up-to-date service fee
			double serviceFee = serviceFeeLookup.getServiceFee(mailItem.destination_floor);
			if (mailItem.charge.getChargeValue(serviceFee)>=CHARGE_THRESHOLD) return true;
			return false;
		}
	}

	public class ItemComparator implements Comparator<Item> {
		@Override
		public int compare(Item i1, Item i2) {
			if (i1.isPriorityItem() == i2.isPriorityItem()) {
				// if both have same priority
				if (i1.destination < i2.destination) {
					return 1;
				} else if (i1.destination > i2.destination) {
					return -1;
				}
				return 0;

			} else if (i1.isPriorityItem()) {
				// if item1 has higher priority
				return -1;
			} else {
				// if item2 has higher priority
				return 1;
			}
		}
	}
	
	private LinkedList<Item> pool;
	private LinkedList<Robot> robots;

	public static double CHARGE_THRESHOLD;
	private ServiceFeeLookup serviceFeeLookup;

	public MailPool(int nrobots){
		// Start empty
		this.CHARGE_THRESHOLD = CHARGE_THRESHOLD;
		pool = new LinkedList<Item>();
		robots = new LinkedList<Robot>();
	}

	/**
     * Adds an item to the mail pool
     * @param mailItem the mail item being added.
     */
	public void addToPool(MailItem mailItem) {
		Item item = new Item(mailItem);
		pool.add(item);
		pool.sort(new ItemComparator());
	}

	/**
	 * @param lookupTable table of most updated service fees
	 */
	public void setServiceFeeLookup(ServiceFeeLookup lookupTable) {
		serviceFeeLookup = lookupTable;
	}
	
	/**
     * load up any waiting robots with mailItems, if any.
     */
	public void loadItemsToRobot() throws ItemTooHeavyException {
		//List available robots
		ListIterator<Robot> i = robots.listIterator();
		while (i.hasNext()) loadItem(i);
	}
	
	//load items to the robot
	private void loadItem(ListIterator<Robot> i) throws ItemTooHeavyException {
		Robot robot = i.next();
		assert(robot.isEmpty());
		// System.out.printf("P: %3d%n", pool.size());
		ListIterator<Item> j = pool.listIterator();
		if (pool.size() > 0) {
			try {
			robot.addToHand(j.next().mailItem); // hand first as we want higher priority delivered first
			j.remove();
			if (pool.size() > 0) {
				robot.addToTube(j.next().mailItem);
				j.remove();
			}
			robot.dispatch(); // send the robot off if it has any items to deliver
			i.remove();       // remove from mailPool queue
			} catch (Exception e) { 
	            throw e; 
	        } 
		}
	}

	/**
     * @param robot refers to a robot which has arrived back ready for more mailItems to deliver
     */	
	public void registerWaiting(Robot robot) { // assumes won't be there already
		robots.add(robot);
	}

}
