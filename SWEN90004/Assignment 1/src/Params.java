import java.util.Random;

/**
 * Irgio Ghazy Basrewan - 1086150
 * Submission for SWEN90004 Assignment 1a
 * Note: this was provided scaffold code, no changes were made to this file
 * 
 * Parameters that influence the behaviour of the system.
 * 
 * @author ngeard@unimelb.edu.au
 *
 */

public class Params {

  //the number of rooms in the museum
  public final static int ROOMS = 6;

  //the time interval at which Main checks threads are alive
  public final static int MAIN_INTERVAL = 50;

  //the time it takes for the security guard to move through the security check
  public final static int SECURITY_TIME = 400;

  //the time it takes for a guide to walk from one room to the next
  public final static int WALKING_TIME = 800;

  //the maximum amount of time between group arrivals
  public final static int MAX_ARRIVE_INTERVAL = 1200;

  //the maximum amount of time between group departures
  public final static int MAX_DEPART_INTERVAL = 1200;

  //the maximum amount of time before the security guard moves
  public final static int MAX_SECURITY_INTERVAL = 200;

/**
 * For simplicity, we assume uniformly distributed time lapses.
 * An exponential distribution might be a fairer assumption.
 */

  public static int arrivalPause() {
    Random random = new Random();
    return random.nextInt(MAX_ARRIVE_INTERVAL);
  }

  public static int departurePause() {
    Random random = new Random();
    return random.nextInt(MAX_DEPART_INTERVAL);
  }

  public static int operatePause() {
    Random random = new Random();
    return random.nextInt(MAX_SECURITY_INTERVAL);
  }
}

