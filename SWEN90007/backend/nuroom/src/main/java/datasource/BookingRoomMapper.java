package datasource;

import domainObject.booking.BookingRoom;
import domainObject.DomainObject;
import utils.JDBCUtils;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class BookingRoomMapper extends DataMapper{
    public BookingRoomMapper(Connection connection) {
        super(connection);
    }
    public BookingRoomMapper(){}

    @Override
    public int insert(DomainObject obj) {
        BookingRoom bookingRoom = (BookingRoom) obj;

        String sequenceTableNameBookingRoom = "tb_booking_room_id_seq";
        String sqlBookingRoom = "insert into tb_booking_room(id, tb_booking_id, tb_room_id, number_of_rooms, tb_hotel_id) VALUES (nextval(?),?,?,?,?)";
        PreparedStatement pstBookingRoom = null;
        try {
            pstBookingRoom = connection.prepareStatement(sqlBookingRoom);
            pstBookingRoom.setString(1,sequenceTableNameBookingRoom);
            pstBookingRoom.setInt(2,bookingRoom.getBookingId());
            pstBookingRoom.setInt(3,bookingRoom.getRoomId());
            pstBookingRoom.setInt(4,bookingRoom.getNumberOfRooms());
            pstBookingRoom.setInt(5,bookingRoom.getHotelId());
            pstBookingRoom.executeUpdate();
            connection.commit();
            pstBookingRoom.close();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
            try {
                connection.rollback();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        return 0;
    }

    @Override
    public boolean update(DomainObject obj) {
        BookingRoom bookingRoom=(BookingRoom) obj;
        String sql="update tb_booking_room set number_of_rooms=? where id=?";
        PreparedStatement pst=null;
        try {
            pst=connection.prepareStatement(sql);
            pst.setInt(1,bookingRoom.getNumberOfRooms());
            pst.setInt(2,bookingRoom.getId());
            if(pst.executeUpdate()>0)
                return true;
            pst.close();

        } catch (SQLException throwables) {
            throwables.printStackTrace();
            JDBCUtils.Rollback(connection);
            System.err.println("update booking room error");
        }
        return false;
    }

    @Override
    public boolean delete(DomainObject obj) {
        return false;
    }

    @Override
    public DomainObject findById(int id) {
        return null;
    }
}
