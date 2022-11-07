package service.bookingService;

import datasource.UserMapper;
import domainObject.booking.Booking;
import domainObject.user.User;
import org.junit.Test;
import utils.HttpUtil;
import utils.JDBCUtils;
import utils.Result;

import java.sql.Connection;
import java.util.List;

import static org.junit.Assert.*;

public class BookingServiceTest {
    Connection connection= JDBCUtils.Connect();
    UserMapper userMapper =new UserMapper(connection);

    @Test
    public void bookHotel() {
    }

    @Test
    public void modifyBooking() {
    }

    @Test
    public void test_customer_view_bookings() {

        Connection connection= JDBCUtils.Connect();
        BookingService bookingService=new BookingService(connection);

        User test_user = userMapper.findByEmail("customer2@gmail.com");
        test_user.setPassword("Password2");

        Result<List<Booking>> response= bookingService.viewBookings(test_user);

        int response_error_code = response.getErrorCode();

        assertEquals(response_error_code,200);
    }

    @Test
    public void test_hotelier_view_bookings() {
        Connection connection= JDBCUtils.Connect();
        BookingService bookingService=new BookingService(connection);

        User test_user = userMapper.findByEmail("zhongyib@student.unimelb.edu.au");
        test_user.setPassword("P@ssword2");

        Result<List<Booking>> response= bookingService.viewBookings(test_user);

        int response_error_code = response.getErrorCode();

        assertEquals(response_error_code,200);
    }

    @Test
    public void test_administrator_view_All_BookedStays() {
        Connection connection= JDBCUtils.Connect();
        BookingService bookingService=new BookingService(connection);

        Result<List<Booking>> response= bookingService.viewAllBookedStays();

        int response_error_code = response.getErrorCode();

        assertEquals(response_error_code,200);
    }

    @Test
    public void cancelBooking() {
    }
}