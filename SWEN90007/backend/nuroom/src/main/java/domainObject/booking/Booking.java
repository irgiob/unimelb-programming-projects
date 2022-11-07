package domainObject.booking;

import controllers.ViewObject.BookingVO;
import domainObject.DomainObject;
import domainObject.hotel.Hotel;
import domainObject.hotel.Room;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import utils.DataConvertUtil;
import utils.Enum.BookingStatus;

import java.io.Serializable;
import java.text.ParseException;
import java.util.Date;
import java.util.List;

@ToString
@Getter
@Setter
public class Booking extends DomainObject implements Serializable {
    Integer userId;
    Integer totalNumGuest;
    BookingStatus status;
    Date startDate;
    Date endDate;
    Hotel hotel;
    List<BookingRoom> bookingRoomList;

    public Booking(BookingVO bookingVO) throws ParseException {
        this.id = bookingVO.getId();
        this.userId = bookingVO.getUserId();
        this.totalNumGuest = bookingVO.getTotalNumGuest();
        this.startDate = DataConvertUtil.stringConvertUtilDate(bookingVO.getStartDate());
        this.endDate = DataConvertUtil.stringConvertUtilDate(bookingVO.getEndDate());
        this.hotel=new Hotel(bookingVO.getHotelId());
        this.bookingRoomList = bookingVO.getBookingRoomList();
        this.status=BookingStatus.getBookingStatus(bookingVO.getStatus());
    }

    public Booking(Integer id) {
        super(id);
    }

    public Booking() {
    }

    public Booking(Integer id, Integer userId, Integer totalNumGuest, Integer isCancelled, Date startDate, Date endDate, List<BookingRoom> bookingRoomList, Integer hotelId) {
        this.id = id;
        this.userId = userId;
        this.totalNumGuest = totalNumGuest;
        this.startDate = startDate;
        this.endDate = endDate;
        this.hotel = new Hotel(hotelId);
        this.bookingRoomList = bookingRoomList;
        if (isCancelled == 1) {
            this.status = BookingStatus.CANCELLED;
        } else {
            if (new Date().after(endDate)) {
                this.status = BookingStatus.COMPLETED;
            } else {
                this.status = BookingStatus.PENDING;
            }
        }

    }

    public boolean checkParam(){
       if(userId==null || hotel.getId()==null){
           return true;
       }

       if(bookingRoomList==null || bookingRoomList.size()==0){
           return true;
       }

       for(BookingRoom b:bookingRoomList)
           if(!b.checkParam()) return true;

       return false;
    }

    public boolean checkRoomInValid(List<Room> roomList){

        if(roomList==null || roomList.size()==0){
            return true;
        }

        for(BookingRoom b:bookingRoomList){
            Room room=roomList.stream().filter(e-> b.getRoomId().equals(e.getId())).findAny().orElse(null);
            if(room==null || room.getQuantity()<b.getNumberOfRooms()){
                return true;
            }
        }

        return false;
    }

}
