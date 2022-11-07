package datasource;

import domainObject.*;
import domainObject.booking.Booking;
import domainObject.booking.BookingRoom;
import domainObject.hotel.Hotel;
import domainObject.hotel.Room;
import utils.JDBCUtils;
import utils.KeyTable;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BookingMapper extends DataMapper {

    public BookingMapper(Connection connection) {
        super(connection);
    }

    public BookingMapper() {
    }

    @Override
    public int insert(DomainObject obj) {
        Booking booking = (Booking) obj;

        int count = 0;
        String sequenceTableNameBooking = "tb_booking_id_seq";
        String sequenceTableNameBookingRoom = "tb_booking_room_id_seq";
        String sqlBooking = "insert into tb_booking(id, tb_user_id, start_date, end_date, number_of_total_guest, " +
                "is_cancelled, tb_hotel_id) VALUES (?,?,?,?,?,?,?)";
        String sqlBookingRoom = "insert into tb_booking_room(id, tb_booking_id, tb_room_id, number_of_rooms, tb_hotel_id) VALUES (?,?,?,?,?)";

        try {
            connection.setAutoCommit(false);
            KeyTable keyId = new KeyTable(connection);
            Integer bookingId = keyId.getKey(sequenceTableNameBooking);

            PreparedStatement pstBooking = connection.prepareStatement(sqlBooking);
            pstBooking.setInt(1, bookingId);
            pstBooking.setInt(2, booking.getUserId());
            pstBooking.setDate(3, new Date(booking.getStartDate().getTime()));
            pstBooking.setDate(4, new Date(booking.getEndDate().getTime()));
            pstBooking.setInt(5, booking.getTotalNumGuest());
            pstBooking.setInt(6, 0);
            pstBooking.setInt(7, booking.getHotel().getId());
            count = pstBooking.executeUpdate();
            connection.commit();

            PreparedStatement pstBookingRoom = connection.prepareStatement(sqlBookingRoom);
            for (BookingRoom bookingRoom: booking.getBookingRoomList()) {
                pstBookingRoom.setInt(1,keyId.getKey(sequenceTableNameBookingRoom));
                pstBookingRoom.setInt(2,bookingId);
                pstBookingRoom.setInt(3,bookingRoom.getRoomId());
                pstBookingRoom.setInt(4,bookingRoom.getNumberOfRooms());
                pstBookingRoom.setInt(5,bookingRoom.getHotelId());
                pstBookingRoom.executeUpdate();
            }
            connection.commit();

            pstBooking.close();
            pstBookingRoom.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.out.println("insert booking error");
            JDBCUtils.Rollback(connection);
        }
        return count;
    }

    @Override
    public boolean update(DomainObject obj) {
        Booking booking = (Booking) obj;

        String sql = "UPDATE tb_booking SET start_date = ?, end_date = ?, number_of_total_guest = ?, " +
                "tb_hotel_id = ? WHERE id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setDate(1,new Date(booking.getStartDate().getTime()));
            pst.setDate(2,new Date(booking.getEndDate().getTime()));
            pst.setInt(3,booking.getTotalNumGuest());
            pst.setInt(4,booking.getHotel().getId());
            pst.setInt(5,booking.getId());
            pst.executeUpdate();
            
            pst.close();
            return true;
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("cancel booking error");
            JDBCUtils.Rollback(connection);
            return false;
        }
    }

    @Override
    public boolean delete(DomainObject obj) {
        Booking booking = (Booking) obj;

        String sql = "UPDATE tb_booking SET is_cancelled = ? WHERE id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, 1);
            pst.setInt(2, booking.getId());
            pst.executeUpdate();
            pst.close();
            return true;
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.out.println("cancel booking error");
            JDBCUtils.Rollback(connection);
            return false;
        }
    }

    @Override
    public DomainObject findById(int id) {
        List<Booking> bookingList = new ArrayList<>();
        List<BookingRoom> bookingRoomList = new ArrayList<>();
        List<Hotel> hotelList = new ArrayList<>();

        // get all bookings, then get rooms and hotels associated to those bookings
        String sqlBookings = "SELECT * FROM tb_booking WHERE id = ?";
        String sqlRooms = "SELECT t1.*,t2.type_of_room,t2.price,t2.image_url,t2.description,\n" +
                "t2.number_of_bathrooms,t2.number_of_bedrooms,t2.number_of_beds\n" +
                "FROM tb_booking_room t1 JOIN tb_room t2 ON t2.id=t1.tb_room_id\n" +
                "WHERE tb_booking_id IN (" + sqlBookings.replace("*", "id") + ");";
        String sqlHotels = "SELECT * FROM tb_hotel WHERE id IN (" + sqlBookings.replace("*", "tb_hotel_id") + ");";

        try {
            // get bookings
            PreparedStatement pst = connection.prepareStatement(sqlBookings + ";");
            pst.setInt(1, id);
            ResultSet rs = pst.executeQuery();
            while (rs.next())
                bookingList.add(bookingFromQueryResult(rs));

            // get rooms
            pst = connection.prepareStatement(sqlRooms);
            pst.setInt(1, id);
            rs = pst.executeQuery();
            while (rs.next())
                bookingRoomList.add(bookingRoomInfoFromQueryResult(rs));

            // get hotels
            pst = connection.prepareStatement(sqlHotels);
            pst.setInt(1, id);
            rs = pst.executeQuery();
            while (rs.next())
                hotelList.add(HotelMapper.hotelFromQueryResult(rs));

            // pipe hotels into correct bookings
            for(Hotel hotel: hotelList) {
                bookingList
                        .stream()
                        .filter(booking -> hotel.getId().equals(booking.getHotel().getId()))
                        .forEach(bookingForHotel -> bookingForHotel.setHotel(hotel));
            }

            // pipe booking rooms into correct bookings
            for(BookingRoom bookingRoom: bookingRoomList) {
                Booking bookingForRoom = bookingList
                        .stream()
                        .filter(booking -> bookingRoom.getBookingId().equals(booking.getId()))
                        .findFirst()
                        .orElse(null);
                if (bookingForRoom != null) {
                    if (bookingForRoom.getBookingRoomList() == null) {
                        bookingForRoom.setBookingRoomList(new ArrayList<>());
                    }
                    bookingForRoom.getBookingRoomList().add(bookingRoom);
                }
            }
            
            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("get booking by id error");
        }

        // return list of bookings
        return bookingList.get(0);
    }

    public List<Booking> findByCustomer(int customerId) {
        List<Booking> bookingList = new ArrayList<>();
        List<BookingRoom> bookingRoomList = new ArrayList<>();
        List<Hotel> hotelList = new ArrayList<>();

        // get all bookings, then get rooms and hotels associated to those bookings
        String sqlBookings = "SELECT * FROM tb_booking WHERE tb_user_id = ?";
        String sqlRooms = "SELECT t1.*,t2.type_of_room,t2.price,t2.image_url,t2.description,\n" +
                "t2.number_of_bathrooms,t2.number_of_bedrooms,t2.number_of_beds\n" +
                "FROM tb_booking_room t1 JOIN tb_room t2 ON t2.id=t1.tb_room_id\n" +
                "WHERE tb_booking_id IN (" + sqlBookings.replace("*", "id") + ");";
        String sqlHotels = "SELECT * FROM tb_hotel WHERE id IN (" + sqlBookings.replace("*", "tb_hotel_id") + ");";

        try {
            // get bookings
            PreparedStatement pst = connection.prepareStatement(sqlBookings + ";");
            pst.setInt(1, customerId);
            ResultSet rs = pst.executeQuery();
            while (rs.next())
                bookingList.add(bookingFromQueryResult(rs));

            // get rooms
            pst = connection.prepareStatement(sqlRooms);
            pst.setInt(1, customerId);
            rs = pst.executeQuery();
            while (rs.next())
                bookingRoomList.add(bookingRoomInfoFromQueryResult(rs));

            // get hotels
            pst = connection.prepareStatement(sqlHotels);
            pst.setInt(1, customerId);
            rs = pst.executeQuery();
            while (rs.next())
                hotelList.add(HotelMapper.hotelFromQueryResult(rs));

            // pipe hotels into correct bookings
            for(Hotel hotel: hotelList) {
                bookingList
                        .stream()
                        .filter(booking -> hotel.getId().equals(booking.getHotel().getId()))
                        .forEach(bookingForHotel -> bookingForHotel.setHotel(hotel));
            }

            // pipe booking rooms into correct bookings
            for(BookingRoom bookingRoom: bookingRoomList) {
                Booking bookingForRoom = bookingList
                        .stream()
                        .filter(booking -> bookingRoom.getBookingId().equals(booking.getId()))
                        .findFirst()
                        .orElse(null);
                if (bookingForRoom != null) {
                    if (bookingForRoom.getBookingRoomList() == null) {
                        bookingForRoom.setBookingRoomList(new ArrayList<>());
                    }
                    bookingForRoom.getBookingRoomList().add(bookingRoom);
                }
            }
            
            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("get all bookings by customer error");
        }

        // return list of bookings
        return bookingList;
    }

    public List<Booking> findByHotel(int hotelId) {
        List<Booking> bookingList = new ArrayList<>();
        List<BookingRoom> bookingRoomList = new ArrayList<>();
        List<Hotel> hotelList = new ArrayList<>();

        // get all bookings, then get rooms and hotels associated to those bookings
        String sqlBookings = "SELECT * FROM tb_booking WHERE tb_hotel_id = ?";
        String sqlRooms = "SELECT t1.*,t2.type_of_room,t2.price,t2.image_url,t2.description,\n" +
                "t2.number_of_bathrooms,t2.number_of_bedrooms,t2.number_of_beds\n" +
                "FROM tb_booking_room t1 JOIN tb_room t2 ON t2.id=t1.tb_room_id\n" +
                "WHERE tb_booking_id IN (" + sqlBookings.replace("*", "id") + ");";
        String sqlHotels = "SELECT * FROM tb_hotel WHERE id IN (" + sqlBookings.replace("*", "tb_hotel_id") + ");";

        try {
            // get bookings
            PreparedStatement pst = connection.prepareStatement(sqlBookings + ";");
            pst.setInt(1, hotelId);
            ResultSet rs = pst.executeQuery();
            while (rs.next())
                bookingList.add(bookingFromQueryResult(rs));

            // get rooms
            pst = connection.prepareStatement(sqlRooms);
            pst.setInt(1, hotelId);
            rs = pst.executeQuery();
            while (rs.next())
                bookingRoomList.add(bookingRoomInfoFromQueryResult(rs));

            // get hotels
            pst = connection.prepareStatement(sqlHotels);
            pst.setInt(1, hotelId);
            rs = pst.executeQuery();
            while (rs.next())
                hotelList.add(HotelMapper.hotelFromQueryResult(rs));

            // pipe hotels into correct bookings
            for(Hotel hotel: hotelList) {
                bookingList
                        .stream()
                        .filter(booking -> hotel.getId().equals(booking.getHotel().getId()))
                        .forEach(bookingForHotel -> bookingForHotel.setHotel(hotel));
            }

            // pipe booking rooms into correct bookings
            for(BookingRoom bookingRoom: bookingRoomList) {
                Booking bookingForRoom = bookingList
                        .stream()
                        .filter(booking -> bookingRoom.getBookingId().equals(booking.getId()))
                        .findFirst()
                        .orElse(null);
                if (bookingForRoom != null) {
                    if (bookingForRoom.getBookingRoomList() == null) {
                        bookingForRoom.setBookingRoomList(new ArrayList<>());
                    }
                    bookingForRoom.getBookingRoomList().add(bookingRoom);
                }
            }
            
            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("get all bookings by hotel error");
        }

        // return list of bookings
        return bookingList;
    }

    public List<Booking> findAllBookings() {
        List<Booking> bookingList = new ArrayList<>();
        List<BookingRoom> bookingRoomList = new ArrayList<>();
        List<Hotel> hotelList = new ArrayList<>();

        // get all bookings, then get rooms and hotels associated to those bookings
        String sqlBookings = "SELECT * FROM tb_booking";
        String sqlRooms = "SELECT t1.*,t2.type_of_room,t2.price,t2.image_url,t2.description,\n" +
                "t2.number_of_bathrooms,t2.number_of_bedrooms,t2.number_of_beds\n" +
                "FROM tb_booking_room t1 JOIN tb_room t2 ON t2.id=t1.tb_room_id\n" +
                "WHERE tb_booking_id IN (" + sqlBookings.replace("*", "id") + ");";
        String sqlHotels = "SELECT * FROM tb_hotel WHERE id IN (" + sqlBookings.replace("*", "tb_hotel_id") + ");";

        try {
            // get bookings
            PreparedStatement pst = connection.prepareStatement(sqlBookings + ";");
            ResultSet rs = pst.executeQuery();
            while (rs.next())
                bookingList.add(bookingFromQueryResult(rs));

            // get rooms
            pst = connection.prepareStatement(sqlRooms);
            rs = pst.executeQuery();
            while (rs.next())
                bookingRoomList.add(bookingRoomInfoFromQueryResult(rs));

            // get hotels
            pst = connection.prepareStatement(sqlHotels);
            rs = pst.executeQuery();
            while (rs.next())
                hotelList.add(HotelMapper.hotelFromQueryResult(rs));

            // pipe hotels into correct bookings
            for(Hotel hotel: hotelList) {
                bookingList
                        .stream()
                        .filter(booking -> hotel.getId().equals(booking.getHotel().getId()))
                        .forEach(bookingForHotel -> bookingForHotel.setHotel(hotel));
            }

            // pipe booking rooms into correct bookings
            for(BookingRoom bookingRoom: bookingRoomList) {
                Booking bookingForRoom = bookingList
                        .stream()
                        .filter(booking -> bookingRoom.getBookingId().equals(booking.getId()))
                        .findFirst()
                        .orElse(null);
                if (bookingForRoom != null) {
                    if (bookingForRoom.getBookingRoomList() == null) {
                        bookingForRoom.setBookingRoomList(new ArrayList<>());
                    }
                    bookingForRoom.getBookingRoomList().add(bookingRoom);
                }
            }
            
            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("get all bookings error");
        }

        // return list of bookings
        return bookingList;
    }

    public List<Booking> findByHotelier(int hotelierId){
        List<Booking> bookingList = new ArrayList<>();
        List<BookingRoom> bookingRoomList = new ArrayList<>();
        List<Hotel> hotelList = new ArrayList<>();

        // get all bookings, then get rooms and hotels associated to those bookings
        String sqlBookings = "SELECT * \n" +
                "FROM tb_booking\n" +
                "WHERE tb_hotel_id IN (\n" +
                "\tSELECT th.id\n" +
                "\tFROM tb_group tg\n" +
                "\tINNER JOIN tb_hotel th\n" +
                "\tON tg.tb_hotelier_group_id = th.tb_hotelier_group_id \n" +
                "\tWHERE tb_user_id = ?\n" +
                ")";
        String sqlRooms = "SELECT t1.*,t2.type_of_room,t2.price,t2.image_url,t2.description,\n" +
                "t2.number_of_bathrooms,t2.number_of_bedrooms,t2.number_of_beds\n" +
                "FROM tb_booking_room t1 JOIN tb_room t2 ON t2.id=t1.tb_room_id\n" +
                "WHERE tb_booking_id IN (" + sqlBookings.replace("*", "id") + ");";
        String sqlHotels = "SELECT * FROM tb_hotel WHERE id IN (" + sqlBookings.replace("*", "tb_hotel_id") + ");";

        try {
            // get bookings
            PreparedStatement pst = connection.prepareStatement(sqlBookings + ";");
            pst.setInt(1, hotelierId);
            ResultSet rs = pst.executeQuery();
            while (rs.next())
                bookingList.add(bookingFromQueryResult(rs));

            // get rooms
            pst = connection.prepareStatement(sqlRooms);
            pst.setInt(1,hotelierId);
            rs = pst.executeQuery();
            while (rs.next())
                bookingRoomList.add(bookingRoomInfoFromQueryResult(rs));

            // get hotels
            pst = connection.prepareStatement(sqlHotels);
            pst.setInt(1,hotelierId);
            rs = pst.executeQuery();
            while (rs.next())
                hotelList.add(HotelMapper.hotelFromQueryResult(rs));

            // pipe hotels into correct bookings
            for(Hotel hotel: hotelList) {
                bookingList
                        .stream()
                        .filter(booking -> hotel.getId().equals(booking.getHotel().getId()))
                        .forEach(bookingForHotel -> bookingForHotel.setHotel(hotel));
            }

            // pipe booking rooms into correct bookings
            for(BookingRoom bookingRoom: bookingRoomList) {
                Booking bookingForRoom = bookingList
                        .stream()
                        .filter(booking -> bookingRoom.getBookingId().equals(booking.getId()))
                        .findFirst()
                        .orElse(null);
                if (bookingForRoom != null) {
                    if (bookingForRoom.getBookingRoomList() == null) {
                        bookingForRoom.setBookingRoomList(new ArrayList<>());
                    }
                    bookingForRoom.getBookingRoomList().add(bookingRoom);
                }
            }
            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("get all bookings by hotelier error");
        }

        // return list of bookings
        return bookingList;
    }

    public static Booking bookingFromQueryResult(ResultSet rs) throws SQLException {
        return new Booking(
                rs.getInt("id"),
                rs.getInt("tb_user_id"),
                rs.getInt("number_of_total_guest"),
                rs.getInt("is_cancelled"),
                new java.util.Date(rs.getDate("start_date").getTime()),
                new java.util.Date(rs.getDate("end_date").getTime()),
                null,
                rs.getInt("tb_hotel_id")
        );
    }

    public static BookingRoom bookingRoomFromQueryResult(ResultSet rs) throws SQLException {
        return new BookingRoom(
                rs.getInt("id"),
                rs.getInt("tb_booking_id"),
                rs.getInt("tb_room_id"),
                rs.getInt("number_of_rooms"),
                rs.getInt("tb_hotel_id"),
                null
        );
    }

    public static BookingRoom bookingRoomInfoFromQueryResult(ResultSet rs) throws SQLException {
        return new BookingRoom(
                rs.getInt("id"),
                rs.getInt("tb_booking_id"),
                rs.getInt("tb_room_id"),
                rs.getInt("number_of_rooms"),
                rs.getInt("tb_hotel_id"),
                new Room(
                        rs.getInt("tb_room_id"),
                        rs.getInt("tb_hotel_id"),
                        rs.getString("type_of_room"),
                        rs.getString("description"),
                        null,
                        rs.getFloat("price"),
                        rs.getInt("number_of_bedrooms"),
                        rs.getInt("number_of_bathrooms"),
                        rs.getInt("number_of_beds"),
                        rs.getString("image_url"),
                        null
                )
        );
    }
}
