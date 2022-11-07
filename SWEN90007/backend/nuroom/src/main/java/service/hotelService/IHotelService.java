package service.hotelService;

import controllers.ViewObject.SearchRoomVO;
import domainObject.hotel.Hotel;
import domainObject.hotel.Room;
import domainObject.user.User;
import utils.Result;

import java.util.List;

public interface IHotelService {
    Result<String> createHotel(Hotel hotel, User hotelier);

    Result<String> modifyHotel(Hotel hotel, User hotelier);

    Result<List<Hotel>> viewHotelierHotels(Integer hotelierId);

    Result<String> removeHotel(Hotel hotel);

    Result<List<Hotel>> viewAllHotels();

    Result<List<Hotel>> searchValidRoom(SearchRoomVO searchRoomVO);
}
