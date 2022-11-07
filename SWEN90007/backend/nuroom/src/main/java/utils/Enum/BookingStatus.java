package utils.Enum;

import java.util.HashMap;
import java.util.Map;

public enum BookingStatus {
    PENDING("PENDING"),
    COMPLETED("COMPLETED"),
    CANCELLED("CANCELLED");

    private final String status;

    private static final Map<String,BookingStatus> lookup=new HashMap<>();

    static {
        for(BookingStatus b:BookingStatus.values()){
            lookup.put(b.getStatus(),b);
        }
    }

    BookingStatus(String status){this.status=status;}

    public String getStatus(){return status;}

    public static BookingStatus getBookingStatus(String status){
        return lookup.get(status);
    }
}

