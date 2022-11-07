package service.bookingService;

import datasource.BookingMapper;
import datasource.HotelMapper;
import datasource.RoomMapper;
import domainObject.booking.Booking;
import domainObject.hotel.Hotel;
import domainObject.hotel.Room;
import domainObject.user.User;
import utils.Constants;
import utils.JDBCUtils;
import utils.Result;
import utils.UnitOfWork;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import static utils.Enum.UserRole.CUSTOMER;
import static utils.Enum.UserRole.HOTELIER;

public class BookingService implements IBookingService{
    Connection connection;
    BookingMapper bookingMapper;
    RoomMapper roomMapper;
    HotelMapper hotelMapper;

    public BookingService(Connection connection) {
        this.connection = connection;
        bookingMapper=new BookingMapper(connection);
        roomMapper=new RoomMapper(connection);
        hotelMapper=new HotelMapper(connection);
    }

    @Override
    public Result<List<Booking>> viewAllBookedStays() {
        return new Result<>(bookingMapper.findAllBookings(),200, Constants.SUCCESS);
    }

    @Override
    public Result<String> bookHotel(Booking booking) {
        //1. check param
        if(booking.checkParam()){
            return new Result<>("param cannot be empty",3210,Constants.CUSTOMER_CODE3200_ERROR);
        }
        //3. check hotel active
        Hotel hotelDTO= (Hotel) hotelMapper.findById(booking.getHotel().getId());
        if(hotelDTO.getIsActive()==0){
            return new Result<>("Hotel is been removed",3220,Constants.CUSTOMER_CODE3200_ERROR);
        }

        //2. check still valid
        List<Room> roomList=roomMapper.findByAvailabilityByHotel(booking.getStartDate(),booking.getEndDate(),booking.getHotel().getId());

        if(booking.checkRoomInValid(roomList)){
            return new Result<>("no enough rooms",3220,Constants.CUSTOMER_CODE3200_ERROR);
        }

        UnitOfWork.getCurrent().registerNew(booking);

        return new Result<>(null,200,Constants.SUCCESS);
    }

    @Override
    public Result<String> modifyBooking(Booking booking) {
        //1. check param
        if(booking.checkParam() || booking.getId()==null){
            return new Result<>("param cannot be empty",4100,Constants.USER_CODE4100_ERROR);
        }
        //2. check date
        if(booking.checkRoomInValid(roomMapper.findByAvailabilityByBooking(booking))){
            return new Result<>("invalid date",4110,Constants.USER_CODE4100_ERROR);
        }

        UnitOfWork.getCurrent().registerDirty(booking);
        booking.getBookingRoomList().forEach(e->UnitOfWork.getCurrent().registerDirty(e));
        return new Result<>("true",200,Constants.SUCCESS);
    }

    @Override
    public Result<List<Booking>> viewBookings(User user) {
        List<Booking> bookingList = new ArrayList<>();

        //1. param check
        if(user.getRole()==null){
            return new Result<>(bookingList,4210,Constants.USER_CODE4200_ERROR);
        }

        if(user.getRole().equals(CUSTOMER))
            bookingList= bookingMapper.findByCustomer(user.getId());

        if(user.getRole().equals(HOTELIER)){
            bookingList=bookingMapper.findByHotelier(user.getId());
        }

        return new Result<>(bookingList,200, Constants.SUCCESS);
    }

    @Override
    public Result<String> cancelBooking(Booking booking) {
        if(booking.getId()==null){
            return new Result<>("param cannot be empty",4300,Constants.USER_CODE4300_ERROR);
        }
        bookingMapper.delete(booking);
        return new Result<>(null,200,Constants.SUCCESS);
    }
}
