package simulation;

import automail.Robot;

public class Statistic {
    /** Recorded Statistics */
    private int delivered_items;
    private double billable_activity;
    private double activity_cost;
    private double service_cost;
    private int total_lookups;
    private int successful_lookups;
    private int failed_lookups;

    /**
     * Constructor for a Statistic
     */
    public Statistic() {
        /** Initialize the attributes */
        this.delivered_items = 0;
        this.billable_activity = 0.0;
        this.activity_cost = 0.0;
        this.service_cost = 0.0;
        this.total_lookups = 0;
        this.successful_lookups = 0;
        this.failed_lookups = 0;
    }

    /**
     * Increments the total number of delivered items by 1
     */
    public void incrementDeliveredItems() {
        this.delivered_items++;
    }

    /**
     * Adds the billable activity of a delivery to the total billable activity
     * @param value the total activity units used during a delivery
     */
    public void addBillableActivity(double value) {
        this.billable_activity += value;
    }

    /**
     * Adds the activity cost of a delivery to the total activity cost
     * @param value the activity cost required for a delivery
     */
    public void addActivityCost(double value) {
        this.activity_cost += value;
    }

    /**
     * Adds the service fee of a delivery to the total service cost
     * @param value the service fee during a delivery session
     */
    public void addServiceCost(double value) {
        this.service_cost += value;
    }

    /**
     * Adds the number of failed lookups for an item to the total number of failed lookups
     * @param value the number of failed lookups performed for a particular mail item
     */
    private void addLookUpFails(int value) { this.failed_lookups += value;}

    /**
     * Adds a successful lookup for an item to the total number of successful lookups
     * @param value a successful lookup performed for a particular mail item
     */
    private void addSuccessfulLookUps(int value) { this.successful_lookups += value; }

    /**
     * Calculates the total number of lookups performed during the mail run
     */
    public void calculateTotalLookUps(Robot[] robots) {
        for (Robot robot:robots) {
             addSuccessfulLookUps(robot.getTotalLookupSuccesses());
             addLookUpFails(robot.getTotalLookupFails());
        }
        total_lookups = successful_lookups+failed_lookups;
    }

    /**
     * Called to output statistics at the end of the mail run
     */
    public void printStatistics() {
        System.out.println("\nStatistics:");
        System.out.printf("Total Items Delivered: %d\n", delivered_items);
        System.out.printf("Total Billable Activity: %.2f\n", billable_activity);
        System.out.printf("Total Activity Cost: %.2f\n", activity_cost);
        System.out.printf("Total Service Cost: %.2f\n", service_cost);
        System.out.printf("Total Number of Lookups: %d\n", total_lookups);
        System.out.printf("Successful Lookups: %d\n", successful_lookups);
        System.out.printf("Failed Lookups: %d\n\n", failed_lookups);
    }

}

