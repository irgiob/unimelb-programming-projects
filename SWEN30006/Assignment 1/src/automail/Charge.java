package automail;

import java.util.Map;

public class Charge {
    /* static attributes */
    public static double MARKUP_PERCENTAGE;
    public static double ACTIVITY_UNIT_PRICE;
    enum Activity {MOVEMENT, LOOKUP}
    public static final Map<Activity, Double> ACTIVITY_TABLE = Map.of(
            Activity.MOVEMENT, 5.0,
            Activity.LOOKUP, 0.1
    );

    /** most updated service fee for the delivery of this item */
    private MailItem mailItem;
    /** most updated service fee for the delivery of this item */
    private double serviceFee;
    /** the amount charged at point of delivery, stays at 0 until then */
    private double amountCharged;

    public Charge(MailItem mailItem) {
        this.amountCharged = 0;
        this.serviceFee = 0;
        this.mailItem = mailItem;
    }

    /**
     * @return the charge info as a string
     */
    public String getChargeInfo() {
        assert(amountCharged != 0);
        /* added output for charge data */
        return String.format(" | Charge: %.2f | Cost: %.2f | Fee: %.2f | Activity: %.2f",
                amountCharged, serviceFee + activityCost(), serviceFee, totalActivity());
    }

    /**
     * @return the total amount charged for the delivery
     */
    public double getChargeValue(double newServiceFee) {
        // service fee may be out of date
        this.serviceFee = newServiceFee;
        return (this.serviceFee + activityCost()) * (1 + MARKUP_PERCENTAGE);
    }

    /**
     * @return the total amount of activity units required for the delivery
     */
    public double totalActivity() {
        double activity = 0;
        activity += ACTIVITY_TABLE.get(Activity.MOVEMENT) * (mailItem.getDestFloor() - 1) * 2;
        activity += ACTIVITY_TABLE.get(Activity.LOOKUP);
        return activity;
    }

    /**
     * @return the total cost of the activity of the delivery in AUD
     */
    public double activityCost() {
        return totalActivity() * ACTIVITY_UNIT_PRICE;
    }

    /**
     * @return service fee of the mail item when it was delivered
     */
    public double getServiceFee() {
        return serviceFee;
    }

    /**
     * run when item is delivered. permanently sets the charge for this item
     * (charge no longer depends on future changes to service fee)
     */
    public void setItemAsCharged(double serviceFee) {
        this.amountCharged = getChargeValue(serviceFee);
    }
}
