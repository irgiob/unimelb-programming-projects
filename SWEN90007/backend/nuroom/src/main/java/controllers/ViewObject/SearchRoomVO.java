package controllers.ViewObject;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

@Getter
@Setter
public class SearchRoomVO implements Serializable {
    String startDate;
    String endDate;
    String hotelName;
    String postcode;
    String country;
    String state;
    String streetNo;

    public SearchRoomVO() {
    }

    public SearchRoomVO(String startDate, String endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public SearchRoomVO(String startDate, String endDate, String hotelName, String postcode, String country, String state, String streetNo) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.hotelName = hotelName;
        this.postcode = postcode;
        this.country = country;
        this.state = state;
        this.streetNo = streetNo;
    }
}
