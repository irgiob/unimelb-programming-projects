package domainObject.booking;

import domainObject.DomainObject;
import domainObject.hotel.Room;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@ToString
@Getter
@Setter
public class BookingRoom extends DomainObject implements Serializable {
    Integer bookingId;
    Integer roomId;
    Integer numberOfRooms;
    Integer hotelId;
    Room room;

    public BookingRoom(Integer id) {
        super(id);
    }

    public BookingRoom() {
    }

    public BookingRoom(Integer id, Integer bookingId, Integer roomId, Integer numberOfRooms, Integer hotelId, Room room) {
        super(id);
        this.bookingId = bookingId;
        this.roomId = roomId;
        this.numberOfRooms = numberOfRooms;
        this.hotelId = hotelId;
        this.room = room;
    }

    public BookingRoom(Integer bookingId, Integer roomId, Integer numberOfRooms, Integer hotelId, Room room) {
        this.bookingId = bookingId;
        this.roomId = roomId;
        this.numberOfRooms = numberOfRooms;
        this.hotelId = hotelId;
        this.room = room;
    }

    public boolean checkParam(){
        return roomId!=null
                &&numberOfRooms!=null
                &&hotelId!=null;
    }
}
