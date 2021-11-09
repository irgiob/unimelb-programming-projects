package simulation;

public class Clock {
	
	/** Represents the current time **/
    private static int Time = 0;
    
    /** The threshold for the latest time for mail to arrive **/
    public static int MAIL_RECEVING_LENGTH;

    public static int Time() {
    	return Time;
    }
    
    public static void Tick() {
    	Time++;
    }
}
