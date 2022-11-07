package datasource;

import controllers.ViewObject.SearchRoomVO;
import domainObject.*;
import domainObject.amenity.HotelAmenity;
import domainObject.hotel.Hotel;
import domainObject.hotel.Room;
import utils.JDBCUtils;
import utils.KeyTable;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class HotelMapper extends DataMapper {

    public HotelMapper(Connection connection) {
        super(connection);
    }
    public HotelMapper() {}

    @Override
    public int insert(DomainObject obj) {
        Hotel hotel = (Hotel) obj;
        int count = 0;

        String sequenceTableName = "tb_hotel_id_seq";
        String sql = "INSERT INTO tb_hotel(id, tb_hotelier_group_id, name, image_url, is_active, country, state, " +
                "street, postcode, streetno) VALUES (?,?,?,?,?,?,?,?,?,?)";

        try {
            connection.setAutoCommit(false);
            PreparedStatement pst = connection.prepareStatement(sql);
            KeyTable keyId = new KeyTable(connection);
            Integer hotelId=keyId.getKey(sequenceTableName);

            pst.setInt(1, hotelId);
            pst.setInt(2,hotel.getHotelierGroupId());
            pst.setString(3,hotel.getName());
            pst.setString(4,hotel.getImageURL());
            pst.setInt(5,hotel.getIsActive());
            pst.setString(6,hotel.getCountry());
            pst.setString(7,hotel.getState());
            pst.setString(8,hotel.getStreet());
            pst.setString(9,hotel.getPostcode());
            pst.setString(10,hotel.getStreetNo());

            count = pst.executeUpdate();
            connection.commit();

            HotelAmenityMapper hotelAmenityMapper = new HotelAmenityMapper(connection);
            if(hotel.getHotelAmenityList()!=null){
                for (HotelAmenity hotelAmenity: hotel.getHotelAmenityList()) {
                    hotelAmenity.setHotelId(hotelId);
                    hotelAmenityMapper.insert(hotelAmenity);
                }
            }

            pst.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.out.println("insert hotel error");
            JDBCUtils.Rollback(connection);
        }
        return count;
    }

    @Override
    public boolean update(DomainObject obj) {
        Hotel hotel = (Hotel) obj;

        String sql = "UPDATE tb_hotel SET name = ?, image_url = ?, country = ?, state = ?, " +
                     "street = ?, postcode = ?, streetno = ?, version_no=version_no+1, tb_hotelier_group_id = ? WHERE id = ? AND version_no=?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setString(1,hotel.getName());
            pst.setString(2,hotel.getImageURL());
            pst.setString(3,hotel.getCountry());
            pst.setString(4,hotel.getState());
            pst.setString(5,hotel.getStreet());
            pst.setString(6,hotel.getPostcode());
            pst.setString(7,hotel.getStreetNo());
            pst.setInt(8,hotel.getHotelierGroupId());
            pst.setInt(9,hotel.getId());
            pst.setInt(10,hotel.getVersionNo());

            int updateCount=pst.executeUpdate();
            pst.close();
            return updateCount != 0;
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            JDBCUtils.Rollback(connection);
            System.out.println("update hotel error");
            return false;
        }
    }

    /**
     * sets a hotel to be de-listed (note: doesn't actually delete the hotel)
     * this is will be used in UoW
     * @param obj id of hotel
     * @return true if de-listing successful, false otherwise
     */
    @Override
    public boolean delete(DomainObject obj) {
        Hotel hotel = (Hotel) obj;
        // set hotel to inactive
        hotel.setIsActive(0);

        String sql="UPDATE tb_hotel SET is_active = 0 WHERE id = ?";
        String sql1="UPDATE tb_booking SET is_cancelled = 1 WHERE tb_hotel_id = ? AND start_date >= ?";

        try {
            PreparedStatement pst=connection.prepareStatement(sql);
            pst.setInt(1,hotel.getId());
            pst.executeUpdate();

            pst=connection.prepareStatement(sql1);
            pst.setInt(1, hotel.getId());
            pst.setDate(2, new Date(System.currentTimeMillis()));
            pst.executeUpdate();

            pst.close();
            return true;
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            JDBCUtils.Rollback(connection);
            System.out.println("remove hotel error");
            return false;
        }
    }

    /**
     * finds a hotel using its id
     * @param id of hotel
     * @return Hotel object
     */
    @Override
    public DomainObject findById(int id) {
        Hotel hotel = null;

        String sql = "SELECT * FROM tb_hotel WHERE id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, id);
            ResultSet rs = pst.executeQuery();

            while (rs.next())
                hotel = hotelFromQueryResult(rs);

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find hotel by id error");
        }

        return hotel;
    }

    /**
     * finds all hotels managed by a hotelier group
     * @param groupId id of hotelier group
     * @return list of hotels
     */
    public List<Hotel> findByHotelierGroup(int groupId) {
        List<Hotel> hotelList = new ArrayList<>();

        String sql = "SELECT th.*,thg.name as tb_hotelier_group_name " +
                "FROM tb_hotel th " +
                "JOIN tb_hotelier_group thg " +
                "ON th.tb_hotelier_group_id = thg.id " +
                "AND th.tb_hotelier_group_id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, groupId);
            ResultSet rs = pst.executeQuery();

            while (rs.next())
                hotelList.add(hotelWithGroupFromQueryResult(rs));

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find hotels by group error");
        }

        return hotelList;
    }

    /**
     * finds the hotel related to a specific booking
     * @param bookingId id of booking
     * @return Hotel object
     */
    public Hotel findByBooking(int bookingId) {
        Hotel hotel = null;

        String sqlBooking = "SELECT * FROM tb_booking WHERE id = ?";
        String sqlHotel = "SELECT * FROM tb_hotel WHERE id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sqlBooking);
            pst.setInt(1, bookingId);
            ResultSet rs = pst.executeQuery();
            int hotelId = 0;
            while (rs.next())
                hotelId = rs.getInt("tb_hotel_id");

            pst = connection.prepareStatement(sqlHotel);
            pst.setInt(1, hotelId);
            rs = pst.executeQuery();
            while (rs.next())
                hotel = hotelFromQueryResult(rs);

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find hotel by id error");
        }

        return hotel;
    }

    /**
     * finds a hotel by its name
     * @param name of hotel
     * @return Hotel object
     */
    public List<Hotel> findByName(String name) {
        List<Hotel> hotelList = new ArrayList<>();

        String sql = "SELECT * FROM tb_hotel WHERE name = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setString(1, name);
            ResultSet rs = pst.executeQuery();

            while (rs.next())
                hotelList.add(hotelFromQueryResult(rs));

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find hotel by name error");
        }

        return hotelList;
    }

    /**
     * finds a hotel by the id of one of is room types
     * @param roomId id of room
     * @return Hotel object
     */
    public Hotel findByRoom(int roomId) {
        Hotel hotel = null;

        String sqlRoom = "SELECT * FROM tb_room WHERE id = ?";
        String sqlHotel = "SELECT * FROM tb_hotel WHERE id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sqlRoom);
            pst.setInt(1, roomId);
            ResultSet rs = pst.executeQuery();
            int hotelId = 0;
            while (rs.next())
                hotelId = rs.getInt("tb_hotel_id");

            pst = connection.prepareStatement(sqlHotel);
            pst.setInt(1, hotelId);
            rs = pst.executeQuery();
            while (rs.next())
                hotel = hotelFromQueryResult(rs);

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find hotel by room error");
        }

        return hotel;
    }

    /**
     * @return list of all hotels
     */
    public List<Hotel> findAllHotels() {
        List<Hotel> hotelList = new ArrayList<>();

        String sql = "SELECT th.*,thg.name as tb_hotelier_group_name FROM tb_hotel th JOIN tb_hotelier_group thg on th.tb_hotelier_group_id = thg.id";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            ResultSet rs = pst.executeQuery();

            while (rs.next())
                hotelList.add(hotelWithGroupFromQueryResult(rs));

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find all hotels error");
        }

        return hotelList;
    }

    public List<Hotel> findByAvailability(SearchRoomVO searchRoomVO) {
        RoomMapper roomMapper = new RoomMapper(connection);

        List<Hotel> hotelList = findAllHotels();
        hotelList = addHotelAmenitiesToHotelList(hotelList);
        List<Room> roomList = roomMapper.findByAvailability(searchRoomVO);
        roomList = roomMapper.addRoomAmenitiesToRoomList(roomList);
        List<Hotel> result = new ArrayList<>();

        for(Room room: roomList) {
            Hotel hotelForRoom = hotelList
                    .stream()
                    .filter(hotel -> room.getHotelId().equals(hotel.getId()))
                    .findFirst()
                    .orElse(null);
            if (hotelForRoom != null) {
                if (hotelForRoom.getRoomList() == null) {
                    hotelForRoom.setRoomList(new ArrayList<>());
                }
                hotelForRoom.getRoomList().add(room);
                if (result.stream().noneMatch(hotel -> hotel.getId().equals(hotelForRoom.getId()))) {
                    result.add(hotelForRoom);
                }
            }
        }

        return result;
    }

    public List<Hotel> addHotelAmenitiesToHotelList(List<Hotel> hotelList)  {
        List<HotelAmenity> hotelAmenityList = new ArrayList<>();
        String sql = "SELECT * FROM tb_hotel_amenity WHERE tb_hotel_id IN (?)";
        try {
            for(Hotel hotel: hotelList)
                sql = sql.replaceFirst("\\?", "?,?");
            sql = sql.replaceFirst(",\\?","");

            PreparedStatement pst = connection.prepareStatement(sql);
            int count = 1;
            for(Hotel hotel: hotelList)
                pst.setInt(count++, hotel.getId());

            ResultSet rs = pst.executeQuery();
            while (rs.next()) {
                HotelAmenity hotelAmenity = HotelAmenityMapper.amenityFromQueryResult(rs);
                Hotel hotelForAmenity = hotelList
                        .stream()
                        .filter(hotel -> hotelAmenity.getHotelId().equals(hotel.getId()))
                        .findFirst()
                        .orElse(null);
                if (hotelForAmenity != null) {
                    if (hotelForAmenity.getHotelAmenityList() == null) {
                        hotelForAmenity.setHotelAmenityList(new ArrayList<>());
                    }
                    hotelForAmenity.getHotelAmenityList().add(hotelAmenity);
                }
            }
            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find room amenity by room list error");
        }
        return hotelList;
    }

    public static Hotel hotelFromQueryResult(ResultSet rs) throws SQLException {
        return new Hotel(
                rs.getInt("id"),
                rs.getString("name"),
                rs.getString("country"),
                rs.getString("state"),
                rs.getString("street"),
                rs.getString("postcode"),
                rs.getInt("is_active"),
                rs.getString("streetno"),
                rs.getString("image_url"),
                rs.getInt("version_no"),
                rs.getInt("tb_hotelier_group_id"),
                null,
                null,
                null,
                null
        );
    }
    public static Hotel hotelWithGroupFromQueryResult(ResultSet rs) throws SQLException {
        return new Hotel(
                rs.getInt("id"),
                rs.getString("name"),
                rs.getString("country"),
                rs.getString("state"),
                rs.getString("street"),
                rs.getString("postcode"),
                rs.getInt("is_active"),
                rs.getString("streetno"),
                rs.getString("image_url"),
                rs.getInt("version_no"),
                rs.getInt("tb_hotelier_group_id"),
                rs.getString("tb_hotelier_group_name"),
                null,
                null,
                null
        );
    }
}
