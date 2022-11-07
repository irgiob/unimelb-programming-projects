package controllers.ViewObject;

import domainObject.booking.BookingRoom;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@ToString
public class BookingVO implements Serializable {
    Integer id;
    Integer userId;
    Integer totalNumGuest;
    String status;
    String startDate;
    String endDate;
    Integer hotelId;
    List<BookingRoom> bookingRoomList;

    public BookingVO() {
    }

    public BookingVO(Integer userId, Integer totalNumGuest, String status, String startDate, String endDate, Integer hotelId, List<BookingRoom> bookingRoomList) {
        this.userId = userId;
        this.totalNumGuest = totalNumGuest;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.hotelId = hotelId;
        this.bookingRoomList = bookingRoomList;
    }
}
