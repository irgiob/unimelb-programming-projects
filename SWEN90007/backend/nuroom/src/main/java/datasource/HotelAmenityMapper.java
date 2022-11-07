package datasource;

import domainObject.*;
import domainObject.amenity.HotelAmenity;
import domainObject.hotel.Hotel;
import utils.JDBCUtils;
import utils.KeyTable;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class HotelAmenityMapper extends DataMapper{
    public HotelAmenityMapper(Connection connection) {
        super(connection);
    }
    public HotelAmenityMapper(){}

    /**
     * inserts a hotel amenity into the database
     * @param obj HotelAmenity object
     * @return number of rows added to database
     */
    @Override
    public int insert(DomainObject obj) {
        HotelAmenity hotelAmenity = (HotelAmenity) obj;

        int count = 0;
        String sequenceTableName = "tb_hotel_amenity_id_seq";
        String sql = "insert into tb_hotel_amenity(id, tb_hotel_id, name, description, image_url) values (?,?,?,?,?)";

        try {
            connection.setAutoCommit(false);
            PreparedStatement pst = connection.prepareStatement(sql);
            KeyTable keyId = new KeyTable(connection);

            pst.setInt(1, keyId.getKey(sequenceTableName));
            pst.setInt(2, hotelAmenity.getHotelId());
            pst.setString(3, hotelAmenity.getName());
            pst.setString(4, hotelAmenity.getDescription());
            pst.setString(5, hotelAmenity.getImageUrl());

            count = pst.executeUpdate();
            connection.commit();
            pst.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            JDBCUtils.Rollback(connection);
            System.out.println("insert hotel amenity error error");
        }
        return count;
    }

    /**
     * updates a hotel amenity
     * @param obj hotel amenity
     * @return true if update successful, false otherwise
     */
    @Override
    public boolean update(DomainObject obj) {
        HotelAmenity hotelAmenity = (HotelAmenity) obj;

        String sql = "UPDATE tb_hotel_amenity SET name = ?, description = ?, image_url = ? WHERE id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setString(1, hotelAmenity.getName());
            pst.setString(2, hotelAmenity.getDescription());
            pst.setString(3, hotelAmenity.getImageUrl());
            pst.setInt(4, hotelAmenity.getId());

            pst.executeUpdate();
            pst.close();
            return true;
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.out.println("update hotel amenity error");
            JDBCUtils.Rollback(connection);
            return false;
        }
    }

    /**
     * deletes a hotel amenity
     * @param obj hotel amenity
     * @return true if delete was successful, false otherwise
     */
    @Override
    public boolean delete(DomainObject obj) {
        HotelAmenity hotelAmenity = (HotelAmenity) obj;

        String sql = "DELETE FROM tb_hotel_amenity WHERE id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, hotelAmenity.getId());

            pst.executeUpdate();
            pst.close();
            return true;
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            JDBCUtils.Rollback(connection);
            System.out.println("delete hotel amenity error");
            return false;
        }
    }

    public boolean deleteByHotel(Integer hotelId) {
        String sql = "DELETE FROM tb_hotel_amenity WHERE tb_hotel_id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, hotelId);

            pst.executeUpdate();
            pst.close();
            return true;
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.out.println("delete hotel amenity by hotel error");
            JDBCUtils.Rollback(connection);
            return false;
        }
    }

    /**
     * find a hotel amenity by its id
     * @param id of hotel amenity
     * @return HotelAmenity object
     */
    @Override
    public DomainObject findById(int id) {
        HotelAmenity hotelAmenity = null;

        String sql = "SELECT * FROM tb_hotel_amenity WHERE id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, id);
            ResultSet rs = pst.executeQuery();

            while (rs.next())
                hotelAmenity = amenityFromQueryResult(rs);

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find hotel amenity by id error");
        }

        return hotelAmenity;
    }

    /**
     * find all amenities for a specific hotel
     * @param hotelId id of hotel
     * @return list of hotel amenities
     */
    public List<HotelAmenity> findByHotel(int hotelId) {
        List<HotelAmenity> hotelAmenityList = new ArrayList<>();

        String sql = "SELECT * FROM tb_hotel_amenity WHERE tb_hotel_id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, hotelId);
            ResultSet rs = pst.executeQuery();

            while (rs.next())
                hotelAmenityList.add(amenityFromQueryResult(rs));

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find hotel amenity by hotel error");
        }

        return hotelAmenityList;
    }

    public List<HotelAmenity> findByHotelier(int hotelierId){
        List<HotelAmenity> hotelAmenityList = new ArrayList<>();

        String sql = "select t4.*\n" +
                "from tb_user t1\n" +
                "join tb_group t2\n" +
                "on t1.id=t2.tb_user_id\n" +
                "join tb_hotel t3\n" +
                "on t3.tb_hotelier_group_id=t2.tb_hotelier_group_id\n" +
                "join tb_hotel_amenity t4\n" +
                "on t3.id=t4.tb_hotel_id\n" +
                "where t1.id=?\n" +
                "group by t4.id,t4.tb_hotel_id";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, hotelierId);
            ResultSet rs = pst.executeQuery();

            while (rs.next())
                hotelAmenityList.add(amenityFromQueryResult(rs));

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find hotel amenity by hotel error");
        }

        return hotelAmenityList;
    }

    /**
     * helper function to convert result set into HotelAmenity object
     * @param rs result set from query
     * @return HotelAmenity object
     * @throws SQLException when getting cell value fails
     */
    public static HotelAmenity amenityFromQueryResult(ResultSet rs) throws SQLException {
        HotelAmenity hotelAmenity = new HotelAmenity();
        hotelAmenity.setId(rs.getInt("id"));
        hotelAmenity.setHotelId(rs.getInt("tb_hotel_id"));
        hotelAmenity.setName(rs.getString("name"));
        hotelAmenity.setDescription(rs.getString("description"));
        hotelAmenity.setImageUrl(rs.getString("image_url"));
        return hotelAmenity;
    }
}
