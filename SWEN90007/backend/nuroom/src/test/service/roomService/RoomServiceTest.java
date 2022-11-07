package service.roomService;

import domainObject.hotel.Hotel;
import domainObject.hotel.Room;
import org.junit.Test;
import utils.JDBCUtils;
import utils.Result;

import java.sql.Connection;
import java.util.List;

import static org.junit.Assert.*;

public class RoomServiceTest {

    @Test
    public void createRoom() {
    }

    @Test
    public void test_hotelier_viewHotelRooms() {
        Hotel hotel =  new Hotel(100011);
        Connection connection= JDBCUtils.Connect();
        RoomService roomService=new RoomService(connection);

        Result<List<Room>> response=roomService.viewHotelRooms(hotel.getId());

        int response_error_code = response.getErrorCode();

        assertEquals(response_error_code,200);
    }
}