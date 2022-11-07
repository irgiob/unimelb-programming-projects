package service.roomService;

import controllers.ViewObject.SearchRoomVO;
import datasource.RoomAmenityMapper;
import datasource.RoomMapper;
import domainObject.amenity.RoomAmenity;
import domainObject.booking.Booking;
import domainObject.booking.BookingRoom;
import domainObject.hotel.Hotel;
import domainObject.hotel.Room;
import utils.Constants;
import utils.JDBCUtils;
import utils.Result;
import utils.UnitOfWork;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;
import java.util.jar.JarEntry;
import java.util.stream.Collectors;

public class RoomService implements IRoomService{
    Connection connection;
    RoomMapper roomMapper;
    RoomAmenityMapper roomAmenityMapper;

    public RoomService(Connection connection) {
        this.connection = connection;
        roomMapper=new RoomMapper(connection);
        roomAmenityMapper=new RoomAmenityMapper(connection);
    }

    @Override
    public Result<String> createRoom(Room room) {
        //1. check param
        if(!room.checkParam()){
            return new Result<>("param cannot be empty",2200, Constants.HOTELIER_CODE2200_ERROR);
        }
        //2. check same room
        if(room.checkSameRoom(roomMapper.findByRoomType(room.getRoomType(),room.getHotelId()))){
            return new Result<>("room has existed",2210,Constants.HOTELIER_CODE2200_ERROR);
        }

        UnitOfWork.getCurrent().registerNew(room);
        return new Result<>(null,200,Constants.SUCCESS);
    }


    @Override
    public Result<List<Room>> viewHotelRooms(Integer hotelId) {
        //1. param check
        if(hotelId==null){
            return new Result<>(null,2600,Constants.HOTELIER_CODE2600_ERROR);
        }
        List<Room> roomList=roomMapper.findByHotel(hotelId);
        List<RoomAmenity> roomAmenityList=roomAmenityMapper.findByHotel(hotelId);
        roomList.forEach(e->e.setRoomAmenityList(
                roomAmenityList.stream().filter(
                        r->r.getRoomId().equals(e.getId())).collect(Collectors.toList())));


        return new Result<>(roomList,200,Constants.SUCCESS);
    }

    @Override
    public Result<List<Room>> searchAvailableNum(Booking booking) {
        if(booking.checkParam()){
            return new Result<>(null,2000,null);
        }
        List<Room> roomDTOList=new ArrayList<>();
        for(BookingRoom b:booking.getBookingRoomList()){
            roomDTOList.add(
                    roomMapper.findByAvailabilityByBooking(booking)
                    .stream().filter(e-> b.getRoomId().equals(e.getId()))
                    .findAny().orElse(null)
            );
        }

        return new Result<>(roomDTOList,200,Constants.SUCCESS);
    }

}
