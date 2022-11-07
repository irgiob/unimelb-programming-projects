package datasource;

import controllers.ViewObject.SearchRoomVO;
import domainObject.*;
import domainObject.amenity.RoomAmenity;
import domainObject.booking.Booking;
import domainObject.booking.BookingRoom;
import domainObject.hotel.Room;
import utils.DataConvertUtil;
import utils.JDBCUtils;
import utils.KeyTable;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class RoomMapper extends DataMapper {

    public RoomMapper(Connection connection) {
        super(connection);
    }
    public RoomMapper() {}

    @Override
    public int insert(DomainObject obj) {
        Room room = (Room) obj;
        int count = 0;

        String sequenceTableName = "tb_room_id_seq";
        String sql = "INSERT INTO tb_room(id, tb_hotel_id, type_of_room, total_number, price, number_of_bedrooms, " +
                "number_of_bathrooms, image_url, number_of_beds, description) VALUES (?,?,?,?,?,?,?,?,?,?)";

        try {
            connection.setAutoCommit(false);
            PreparedStatement pst = connection.prepareStatement(sql);
            KeyTable keyId = new KeyTable(connection);
            Integer roomId=keyId.getKey(sequenceTableName);

            pst.setInt(1, roomId);
            pst.setInt(2,room.getHotelId());
            pst.setString(3,room.getRoomType());
            pst.setInt(4,room.getQuantity());
            pst.setFloat(5,room.getPrice());
            pst.setInt(6,room.getNumBedrooms());
            pst.setInt(7,room.getNumBathrooms());
            pst.setString(8,room.getImageURL());
            pst.setInt(9,room.getNumBeds());
            pst.setString(10,room.getDescription());
            count = pst.executeUpdate();
            connection.commit();

            RoomAmenityMapper roomAmenityMapper = new RoomAmenityMapper(connection);
            if(room.getRoomAmenityList()!=null){
                for (RoomAmenity roomAmenity: room.getRoomAmenityList()) {
                    roomAmenity.setRoomId(roomId);
                    roomAmenityMapper.insert(roomAmenity);
                }
            }

            pst.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.out.println("insert room error");
            JDBCUtils.Rollback(connection);
        }
        return count;
    }

    @Override
    public boolean update(DomainObject obj) {
        Room room = (Room) obj;

        String sql = "UPDATE tb_room SET type_of_room = ?, total_number = ?, price = ?, number_of_bedrooms = ?, " +
                "number_of_bathrooms = ?, image_url = ?, number_of_beds = ?, description = ? WHERE id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setString(1,room.getRoomType());
            pst.setInt(2,room.getQuantity());
            pst.setFloat(3,room.getPrice());
            pst.setInt(4,room.getNumBedrooms());
            pst.setInt(5,room.getNumBathrooms());
            pst.setString(6,room.getImageURL());
            pst.setInt(7,room.getNumBeds());
            pst.setString(8,room.getDescription());
            pst.setInt(9,room.getId());

            pst.executeUpdate();
            pst.close();
            return true;
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.out.println("update room error");
            JDBCUtils.Rollback(connection);
            return false;
        }
    }

    @Override
    public boolean delete(DomainObject obj) {
        Room room = (Room) obj;

        String sql = "DELETE FROM tb_room WHERE id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, room.getId());

            pst.executeUpdate();
            pst.close();
            return true;
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.out.println("delete room error");
            JDBCUtils.Rollback(connection);
            return false;
        }
    }

    @Override
    public DomainObject findById(int id) {
        Room room = null;

        String sql = "SELECT * FROM tb_room WHERE id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, id);
            ResultSet rs = pst.executeQuery();

            while (rs.next())
                room = roomFromQueryResult(rs);

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find room by id error");
        }

        return room;
    }

    public Room findByRoomType(String roomType, Integer hotelId) {
        Room room = new Room();

        String sql = "SELECT * FROM tb_room WHERE type_of_room = ? AND tb_hotel_id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setString(1, roomType);
            pst.setInt(2, hotelId);
            ResultSet rs = pst.executeQuery();

            while (rs.next())
                room = roomFromQueryResult(rs);

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find room by room type error");
        }

        return room;
    }

    public List<Room> findByHotel(int hotelId) {
        List<Room> roomList = new ArrayList<>();

        String sql = "SELECT * FROM tb_room WHERE tb_hotel_id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, hotelId);
            ResultSet rs = pst.executeQuery();

            while (rs.next())
                roomList.add(roomFromQueryResult(rs));

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find rooms by hotel error");
        }

        return roomList;
    }

    public List<BookingRoom> findByBooking(int bookingId) {
        List<BookingRoom> roomList = new ArrayList<>();

        String sql = "SELECT * FROM tb_booking_room WHERE tb_booking_id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, bookingId);
            ResultSet rs = pst.executeQuery();

            while (rs.next()) {
                BookingRoom bookingRoom = new BookingRoom(
                        rs.getInt("id"),
                        rs.getInt("tb_booking_id"),
                        rs.getInt("tb_room_id"),
                        rs.getInt("number_of_rooms"),
                        rs.getInt("tb_hotel_id"),
                        null
                );
                roomList.add(bookingRoom);
            }

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find rooms by booking error");
        }

        return roomList;
    }

    public List<Room> findByAvailability(SearchRoomVO searchRoomVO)  {
        List<Room> roomList = new ArrayList<>();

        String sql="SELECT * \n" +
                "FROM tb_room tr\n" +
                "LEFT JOIN (\n" +
                "    SELECT tbr.tb_room_id AS tb_room_id, SUM(number_of_rooms) AS booking_count\n" +
                "    FROM tb_booking_room tbr\n" +
                "    INNER JOIN tb_booking tb on tbr.tb_booking_id = tb.id\n" +
                "    WHERE (? <= end_date) AND (? >= start_date)\n" +
                "    AND is_cancelled = 0\n" +
                "    GROUP BY tb_room_id\n" +
                ") cr ON tr.id = cr.tb_room_id\n" +
                "INNER JOIN tb_hotel th on tb_hotel_id = th.id\n" +
                "WHERE total_number - COALESCE(booking_count,0) > 0\n" +
                "AND is_active = 1\n" +
                "AND name ILIKE COALESCE(?, name)\n" +
                "AND postcode = COALESCE(?, postcode)\n" +
                "AND country ILIKE COALESCE(?, country)\n" +
                "AND state ILIKE COALESCE(?, state)\n" +
                "AND streetno = COALESCE(?, streetno);";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setDate(1,DataConvertUtil.stringConvertSqlDate(searchRoomVO.getStartDate()));
            pst.setDate(2,DataConvertUtil.stringConvertSqlDate(searchRoomVO.getEndDate()));
            pst.setString(3,
                    searchRoomVO.getHotelName() == null ? null : "%" + searchRoomVO.getHotelName().toLowerCase().trim() + "%");
            pst.setString(4,searchRoomVO.getPostcode());
            pst.setString(5,
                    searchRoomVO.getCountry() == null ? null : "%" + searchRoomVO.getCountry().toLowerCase().trim() + "%");
            pst.setString(6,
                    searchRoomVO.getState() == null ? null : "%" + searchRoomVO.getState().toLowerCase().trim() + "%");
            pst.setString(7,searchRoomVO.getStreetNo());
            ResultSet rs = pst.executeQuery();

            while (rs.next()) {
                Room room = roomFromQueryResult(rs);
                room.setQuantity(rs.getInt("total_number") - rs.getInt("booking_count"));
                roomList.add(room);
            }

            pst.close();
            rs.close();
        } catch (SQLException | ParseException throwable) {
            throwable.printStackTrace();
            System.err.println("find rooms by availability error");
        }

        return roomList;
    }

    public List<Room> findByAvailabilityByHotel(Date startDate, Date endDate, int hotelId)  {
        List<Room> roomList = new ArrayList<>();

        String sql="SELECT * FROM tb_room tr \n" +
                "                LEFT JOIN ( \n" +
                "                SELECT tbr.tb_room_id AS tb_room_id, SUM(number_of_rooms) AS booking_count  \n" +
                "                FROM tb_booking_room tbr\n" +
                "                INNER JOIN tb_booking tb on tbr.tb_booking_id = tb.id AND tb.is_cancelled = 0\n" +
                "\t\t\t\tWHERE ? <= end_date AND ? >= start_date\n" +
                "                AND tb.tb_hotel_id = ? \n" +
                "                GROUP BY tb_room_id \n" +
                "                ) cr\n" +
                "                ON id = cr.tb_room_id\n" +
                "                WHERE total_number - COALESCE(booking_count,0) > 0\n" +
                "\t\t\t\tAND tb_hotel_id=?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setDate(1,new java.sql.Date(startDate.getTime()));
            pst.setDate(2,new java.sql.Date(endDate.getTime()));
            pst.setInt(3,hotelId);
            pst.setInt(4,hotelId);
            ResultSet rs = pst.executeQuery();
            while (rs.next()) {
                Room room = roomFromQueryResult(rs);
                room.setQuantity(rs.getInt("total_number") - rs.getInt("booking_count"));
                roomList.add(room);
            }

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find rooms by availability (hotel) error");
        }

        return roomList;
    }

    public List<Room> findByAvailabilityByBooking(Booking booking)  {
        List<Room> roomList = new ArrayList<>();

        String sql= "SELECT * FROM tb_room tr \n" +
                "LEFT JOIN ( \n" +
                "SELECT tbr.tb_room_id AS tb_room_id, SUM(number_of_rooms) AS booking_count  \n" +
                "FROM tb_booking_room tbr  \n" +
                "INNER JOIN tb_booking tb on tbr.tb_booking_id = tb.id AND tb.is_cancelled = 0\n" +
                "WHERE (? <= end_date) AND (? >= start_date)  \n" +
                "AND tb.tb_hotel_id = ? \n" +
                "AND tbr.tb_booking_id not in(?)\n" +
                "GROUP BY tb_room_id \n" +
                ") cr  \n" +
                "ON id = cr.tb_room_id \n" +
                "WHERE tb_hotel_id=?;";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setDate(1,new java.sql.Date(booking.getStartDate().getTime()));
            pst.setDate(2,new java.sql.Date(booking.getEndDate().getTime()));
            pst.setInt(3,booking.getHotel().getId());
            pst.setInt(4,booking.getId());
            pst.setInt(5,booking.getHotel().getId());
            ResultSet rs = pst.executeQuery();

            while (rs.next()) {
                Room room = roomFromQueryResult(rs);
                room.setQuantity(rs.getInt("total_number") - rs.getInt("booking_count"));
                roomList.add(room);
            }

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find rooms by availability (booking) error");
        }

        return roomList;
    }

    public List<Room> addRoomAmenitiesToRoomList(List<Room> roomList)  {
        List<RoomAmenity> roomAmenityList = new ArrayList<>();
        String sql = "SELECT * FROM tb_room_amenity WHERE tb_room_id IN (?)";
        try {
            for(Room room: roomList)
                sql = sql.replaceFirst("\\?", "?,?");
            sql = sql.replaceFirst(",\\?","");

            PreparedStatement pst = connection.prepareStatement(sql);
            int count = 1;
            for(Room room: roomList)
                pst.setInt(count++, room.getId());

            ResultSet rs = pst.executeQuery();
            while (rs.next()) {
                RoomAmenity roomAmenity = RoomAmenityMapper.amenityFromQueryResult(rs);
                Room roomForAmenity = roomList
                        .stream()
                        .filter(room -> roomAmenity.getRoomId().equals(room.getId()))
                        .findFirst()
                        .orElse(null);
                if (roomForAmenity != null) {
                    if (roomForAmenity.getRoomAmenityList() == null) {
                        roomForAmenity.setRoomAmenityList(new ArrayList<>());
                    }
                    roomForAmenity.getRoomAmenityList().add(roomAmenity);
                }
            }
            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find room amenity by room list error");
        }
        return roomList;
    }

    private Room roomFromQueryResult(ResultSet rs) throws SQLException {
        return new Room(
                rs.getInt("id"),
                rs.getInt("tb_hotel_id"),
                rs.getString("type_of_room"),
                rs.getString("description"),
                rs.getInt("total_number"),
                rs.getFloat("price"),
                rs.getInt("number_of_bedrooms"),
                rs.getInt("number_of_bathrooms"),
                rs.getInt("number_of_beds"),
                rs.getString("image_url"),
                null
        );
    }
}
