package service.hotelService;

import domainObject.hotel.Hotel;
import org.junit.Test;
import utils.JDBCUtils;
import utils.Result;

import java.sql.Connection;
import java.util.List;

import static org.junit.Assert.*;

public class HotelServiceTest {

    @Test
    public void createHotel() {
    }

    @Test
    public void modifyHotel() {
    }

    @Test
    public void viewHotelierHotels() {
    }

    @Test
    public void removeHotel() {
    }

    @Test
    public void test_administrator_viewAllHotels() {
        Connection connection= JDBCUtils.Connect();
        HotelService hotelService=new HotelService(connection);

        Result<List<Hotel>> response=hotelService.viewAllHotels();

        int response_error_code = response.getErrorCode();

        assertEquals(response_error_code,200);
    }

    @Test
    public void searchValidRoom() {
    }
}