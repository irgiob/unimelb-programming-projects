package service.bookingService;

import domainObject.booking.Booking;
import domainObject.user.User;
import utils.Result;

import java.util.List;

public interface IBookingService {

    Result<List<Booking>> viewAllBookedStays();

    Result<String> bookHotel(Booking booking);

    Result<String> modifyBooking(Booking booking);

    Result<List<Booking>> viewBookings(User user);

    Result<String> cancelBooking(Booking booking);
}
