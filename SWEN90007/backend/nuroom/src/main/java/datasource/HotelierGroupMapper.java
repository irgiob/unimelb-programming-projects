package datasource;

import domainObject.*;
import domainObject.hotel.Hotel;
import domainObject.user.Hotelier;
import utils.Enum.UserRole;
import utils.JDBCUtils;
import utils.KeyTable;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class HotelierGroupMapper extends DataMapper{

    public HotelierGroupMapper(Connection connection) {
        super(connection);
    }
    private HotelierGroupMapper(){}

    /**
     * inserts a hotelier group into the database
     * optionally also inserts any hoteliers already associated to it
     * @param obj HotelierGroup object
     * @return number of rows inserted into database
     */
    @Override
    public int insert(DomainObject obj) {
        HotelierGroup group = (HotelierGroup) obj;
        int count = 0;

        String sequenceTableNameHotelierGroup = "tb_hotelier_group_id_seq";
        String sqlHotelierGroup = "insert into tb_hotelier_group(id, name) values (?,?)";

        try {
            KeyTable keyId = new KeyTable(connection);
            connection.setAutoCommit(false);

            PreparedStatement pst = connection.prepareStatement(sqlHotelierGroup);
            pst.setInt(1, keyId.getKey(sequenceTableNameHotelierGroup));
            pst.setString(2, group.getName());
            count = pst.executeUpdate();

            connection.commit();
            pst.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.out.println("insert hotelier group error");
            JDBCUtils.Rollback(connection);
        }
        return count;
    }

    /**
     * updates a HotelierGroup
     * only used to update the name, not the list of hotels or hoteliers
     * for updating list of hoteliers see methods below
     * for updating list of hotels view HotelMapper
     * @param obj HotelierGroup object
     * @return true if successful update, false otherwise
     */
    @Override
    public boolean update(DomainObject obj) {
        HotelierGroup group = (HotelierGroup) obj;

        String sql = "UPDATE tb_hotelier_group SET name = ? WHERE id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setString(1, group.getName());
            pst.setInt(2, group.getId());

            pst.executeUpdate();
            pst.close();
            return true;
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.out.println("update hotelier group error");
            JDBCUtils.Rollback(connection);
            return false;
        }
    }

    /**
     * deletes a Hotelier Group
     * hotel's managed by this group will be de-listed
     * hoteliers will no longer be associated to this group
     * @param obj HotelierGroup object
     * @return true if successful delete, false otherwise
     */
    @Override
    public boolean delete(DomainObject obj) {
        HotelierGroup group = (HotelierGroup) obj;

        String sql = "DELETE FROM tb_hotelier_group WHERE id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, group.getId());

            HotelMapper hotelMapper = new HotelMapper(connection);
            for (Hotel hotel : group.getHotelList())
                hotelMapper.delete(hotel);

            pst.executeUpdate();
            pst.close();
            return true;
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.out.println("delete hotelier group error");
            JDBCUtils.Rollback(connection);
            return false;
        }
    }

    /**
     * finds a hotelier group by its id
     * @param id of a HotelierGroup
     * @return HotelierGroup object
     */
    @Override
    public DomainObject findById(int id) {
        DomainObject group = new HotelierGroup();

        String sql = "SELECT * FROM tb_hotelier_group WHERE id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, id);
            ResultSet rs = pst.executeQuery();

            while (rs.next())
                group = hotelierGroupFromQueryResult(rs);

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find hotelier group by id error");
        }
        return group;
    }

    /**
     * adds a hotelier to a hotelier group
     * @param hotelierId id of hotelier
     * @param hotelierGroupId id of hotelier's new group
     * @return number of rows added to database
     */
    public int insertHotelierToGroup(int hotelierId, int hotelierGroupId) {
        int count = 0;

        String sequenceTableNameGroup = "tb_group_id_seq";
        String sql = "insert into tb_group(id, tb_hotelier_group_id, tb_user_id) values (?,?,?)";

        try {
            KeyTable keyId = new KeyTable(connection);
            connection.setAutoCommit(false);

            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, keyId.getKey(sequenceTableNameGroup));
            pst.setInt(2, hotelierGroupId);
            pst.setInt(3, hotelierId);
            pst.executeUpdate();

            connection.commit();
            pst.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.out.println("insert hotelier into hotelier group error");
            JDBCUtils.Rollback(connection);
        }
        return count;
    }

    /**
     * remove a hotelier from a hotelier group
     * @param hotelierId the id of the hotelier being removed
     * @param hotelierGroupId the id of the group the hotelier is being remove from
     * @return true is removal successful, false otherwise
     */
    public boolean removeHotelierFromGroup(int hotelierId, int hotelierGroupId) {
        String sqlFind = "SELECT * FROM tb_group WHERE tb_hotelier_group_id = ? AND tb_user_id = ?";
        String sqlDelete = "DELETE FROM tb_group WHERE id = ?";

        try {
            // check to see if hotelier is indeed in hotelier group
            PreparedStatement pst = connection.prepareStatement(sqlFind);
            pst.setInt(1, hotelierGroupId);
            pst.setInt(2, hotelierId);
            ResultSet rs = pst.executeQuery();
            int group_id = 0;
            while (rs.next())
                group_id = rs.getInt("id");
            if (group_id == 0)
                return false;

            // delete hotelier from hotelier group if hotelier in hotelier group
            pst = connection.prepareStatement(sqlDelete);
            pst.setInt(1, group_id);
            pst.executeUpdate();

            pst.close();
            rs.close();
            return true;
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.out.println("remove hotelier from hotelier group error");
            JDBCUtils.Rollback(connection);
            return false;
        }
    }

    /**
     * find hotelier group that manages a specific hotel
     * @param hotelId id of hotel
     * @return HotelierGroup object
     */
    public HotelierGroup findByHotel(int hotelId) {
        HotelierGroup group = null;

        String sql = "SELECT thg.id AS id, thg.name as name " +
                     "FROM tb_hotelier_group thg " +
                     "INNER JOIN tb_hotel th on thg.id = th.tb_hotelier_group_id " +
                     "WHERE th.id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, hotelId);
            ResultSet rs = pst.executeQuery();

            while (rs.next())
                group = hotelierGroupFromQueryResult(rs);

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find hotelier group by hotel error");
        }

        return group;
    }

    /**
     * find all hotelier groups a specific hotelier is in
     * @param hotelierId the id of the hotelier
     * @return a list of hotelier groups
     */
    public List<HotelierGroup> findByHotelier(int hotelierId) {
        List<HotelierGroup> groups = new ArrayList<>();

        String sql = "SELECT thg.id AS id, thg.name as name " +
                "FROM tb_hotelier_group thg " +
                "INNER JOIN tb_group tg on thg.id = tg.tb_hotelier_group_id " +
                "WHERE tg.tb_user_id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, hotelierId);
            ResultSet rs = pst.executeQuery();

            while (rs.next())
                groups.add(hotelierGroupFromQueryResult(rs));

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find hotelier group by hotelier error");
        }

        return groups;
    }

    /**
     * find hotelier group with specific name
     * @param groupName name of hotelier group
     * @return HotelierGroup object
     */
    public HotelierGroup findByName(String groupName){
        HotelierGroup group = null;

        String sql = "SELECT * FROM tb_hotelier_group WHERE name = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setString(1, groupName);
            ResultSet rs = pst.executeQuery();

            while (rs.next())
                group = hotelierGroupFromQueryResult(rs);

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find hotelier group by name error");
        }

        return group;
    }

    public List<HotelierGroup> findAll(){
        List<HotelierGroup> hotelierGroupList=new ArrayList<>();

        String sql="SELECT * FROM tb_hotelier_group";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            ResultSet rs = pst.executeQuery();

            while(rs.next()){
                HotelierGroup hotelierGroup=hotelierGroupFromQueryResult(rs);
                String sql1="SELECT th.*,thg.name as tb_hotelier_group_name " +
                        "FROM tb_hotel th JOIN tb_hotelier_group thg on th.tb_hotelier_group_id = thg.id " +
                        "where tb_hotelier_group_id=?";

                pst=connection.prepareStatement(sql1);
                pst.setInt(1,hotelierGroup.getId());
                ResultSet rs1=pst.executeQuery();

                List<Hotel> hotelList=new ArrayList<>();
                while(rs1.next()){
                    hotelList.add(hotelFromQueryResult(rs1));
                }
                hotelierGroup.setHotelList(hotelList);

                //hotelierList
                String sql2 = "SELECT * FROM tb_user tu INNER JOIN tb_group tg ON tu.id = tg.tb_user_id WHERE tg.tb_hotelier_group_id = ?";
                pst = connection.prepareStatement(sql2);
                pst.setInt(1, hotelierGroup.getId());
                ResultSet rs2 = pst.executeQuery();

                List<Hotelier> hotelierList=new ArrayList<>();
                while(rs2.next()){
                    hotelierList.add(hotelierFromQueryResult(rs2));
                }
                hotelierGroup.setHotelierList(hotelierList);

                hotelierGroupList.add(hotelierGroup);
            }

            pst.close();
            rs.close();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
            System.err.println("get all hotelier groups error");
        }
        return hotelierGroupList;
    }

    private Hotel hotelFromQueryResult(ResultSet rs) throws SQLException {
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
    private Hotelier hotelierFromQueryResult(ResultSet rs) throws SQLException {
        return new Hotelier(
                rs.getInt("id"),
                rs.getString("first_name"),
                rs.getString("last_name"),
                rs.getString("email"),
                rs.getString("password"),
                rs.getString("phone_number"),
                rs.getDate("date_of_birth")==null?null:
                        new java.util.Date(rs.getDate("date_of_birth").getTime()),
                UserRole.getUserRole(rs.getInt("role_level"))
        );
    }

    /**
     * helper function to convert result set into User object
     * @param rs result set from query
     * @return User object
     * @throws SQLException when getting cell value fails
     */
    private HotelierGroup hotelierGroupFromQueryResult(ResultSet rs) throws SQLException {
        return new HotelierGroup(
                rs.getInt("id"),
                rs.getString("name"),
                null,
                null
        );
    }
}
