package datasource;

import domainObject.DomainObject;
import domainObject.hotel.Room;
import domainObject.amenity.RoomAmenity;
import utils.JDBCUtils;
import utils.KeyTable;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class RoomAmenityMapper extends DataMapper{
    public RoomAmenityMapper(Connection connection) {
        super(connection);
    }
    public RoomAmenityMapper() {}

    /**
     * inserts a room amenity into the database
     * @param obj RoomAmenity object
     * @return number of rows added to database
     */
    @Override
    public int insert(DomainObject obj) {
        RoomAmenity roomAmenity = (RoomAmenity) obj;
        int count = 0;

        String sequenceTableName = "tb_room_amenity_id_seq";
        String sql = "insert into tb_room_amenity(id, tb_room_id, name, description, image_url) values (?,?,?,?,?)";

        try {
            connection.setAutoCommit(false);
            PreparedStatement pst = connection.prepareStatement(sql);
            KeyTable keyId = new KeyTable(connection);

            pst.setInt(1, keyId.getKey(sequenceTableName));
            pst.setInt(2, roomAmenity.getRoomId());
            pst.setString(3, roomAmenity.getName());
            pst.setString(4, roomAmenity.getDescription());
            pst.setString(5, roomAmenity.getImageUrl());

            count = pst.executeUpdate();
            connection.commit();
            pst.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.out.println("insert room amenity error error");
            JDBCUtils.Rollback(connection);
        }
        return count;
    }

    /**
     * updates a room amenity
     * @param obj room amenity
     * @return true if update successful, false otherwise
     */
    @Override
    public boolean update(DomainObject obj) {
        RoomAmenity roomAmenity = (RoomAmenity) obj;

        String sql = "UPDATE tb_room_amenity SET name = ?, description = ?, image_url = ? WHERE id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setString(1, roomAmenity.getName());
            pst.setString(2, roomAmenity.getDescription());
            pst.setString(3, roomAmenity.getImageUrl());
            pst.setInt(4, roomAmenity.getId());

            pst.executeUpdate();
            pst.close();
            return true;
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.out.println("update room amenity error");
            JDBCUtils.Rollback(connection);
            return false;
        }
    }

    /**
     * deletes a room amenity
     * @param obj room amenity
     * @return true if delete was successful, false otherwise
     */
    @Override
    public boolean delete(DomainObject obj) {
        RoomAmenity roomAmenity = (RoomAmenity) obj;

        String sql = "DELETE FROM tb_room_amenity WHERE id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, roomAmenity.getId());

            pst.executeUpdate();
            pst.close();
            return true;
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.out.println("delete room amenity error");
            JDBCUtils.Rollback(connection);
            return false;
        }
    }

    public boolean deleteByRoom(int roomId) {
        String sql = "DELETE FROM tb_room_amenity WHERE tb_room_id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, roomId);

            pst.executeUpdate();
            pst.close();
            return true;
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.out.println("delete room amenity error");
            JDBCUtils.Rollback(connection);
            return false;
        }
    }

    /**
     * find a room amenity by its id
     * @param id of room amenity
     * @return room object
     */
    @Override
    public DomainObject findById(int id) {
        RoomAmenity roomAmenity = null;

        String sql = "SELECT * FROM tb_room_amenity WHERE id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, id);
            ResultSet rs = pst.executeQuery();

            while (rs.next())
                roomAmenity = amenityFromQueryResult(rs);

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find room amenity by id error");
        }

        return roomAmenity;
    }

    /**
     * find all amenities for a specific room
     * @param roomId id of room
     * @return list of room amenities
     */
    public List<RoomAmenity> findByRoom(int roomId) {
        List<RoomAmenity> roomAmenityList = new ArrayList<>();

        String sql = "SELECT * FROM tb_room_amenity WHERE tb_room_id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, roomId);
            ResultSet rs = pst.executeQuery();

            while (rs.next())
                roomAmenityList.add(amenityFromQueryResult(rs));

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find room amenity by room error");
        }

        return roomAmenityList;
    }

    /**
     * helper function to convert result set into RoomAmenity object
     * @param rs result set from query
     * @return RoomAmenity object
     * @throws SQLException when getting cell value fails
     */
    public static RoomAmenity amenityFromQueryResult(ResultSet rs) throws SQLException {
        RoomAmenity roomAmenity = new RoomAmenity();
        roomAmenity.setId(rs.getInt("id"));
        roomAmenity.setRoomId(rs.getInt("tb_room_id"));
        roomAmenity.setName(rs.getString("name"));
        roomAmenity.setDescription(rs.getString("description"));
        roomAmenity.setImageUrl(rs.getString("image_url"));
        return roomAmenity;
    }



    public List<RoomAmenity> findByHotel(int hotelId){
        List<RoomAmenity> roomAmenityList = new ArrayList<>();
        String sql = "select t1.*\n" +
                "from tb_room_amenity t1\n" +
                "join tb_room t2\n" +
                "on t1.tb_room_id=t2.id\n" +
                "join tb_hotel t3\n" +
                "on t3.id = t2.tb_hotel_id\n" +
                "and t3.id=?";
        try {
            PreparedStatement pst=connection.prepareStatement(sql);
            pst.setInt(1,hotelId);
            ResultSet rs=pst.executeQuery();

            while(rs.next())
                roomAmenityList.add(amenityFromQueryResult(rs));

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find room amenity by hotel error");
        }

        return roomAmenityList;
    }
}
