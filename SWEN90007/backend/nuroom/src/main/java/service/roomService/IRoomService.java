package service.roomService;

import controllers.ViewObject.SearchRoomVO;
import domainObject.booking.Booking;
import domainObject.hotel.Hotel;
import domainObject.hotel.Room;
import utils.Result;

import java.util.List;

public interface IRoomService {
    Result<String> createRoom(Room room);

    Result<List<Room>> viewHotelRooms(Integer hotelId);

    Result<List<Room>> searchAvailableNum(Booking booking);

}
