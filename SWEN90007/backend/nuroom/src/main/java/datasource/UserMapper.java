package datasource;

import domainObject.DomainObject;
import domainObject.user.Hotelier;
import domainObject.user.User;
import utils.Enum.UserRole;
import utils.HttpUtil;
import utils.KeyTable;
import utils.JDBCUtils;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Highly recommend to write sql query to extract from DB only and without any other logic in DAO layer
 * Because all the logic will be handled in Service layer
 * And for this function, userList should better be declared as single User
 * Here I just show how to collect multiple records as list.
 */
public class UserMapper extends DataMapper {

    public UserMapper(Connection connection) {
        super(connection);
    }
    public UserMapper() {}

    /**
     * inserts a user into the table
     * @param obj User object
     * @return number of rows inserted into table
     */
    @Override
    public int insert(DomainObject obj) {
        User user = (User) obj;
        int count = 0;

        String sequenceTableName = "tb_user_id_seq";
        String sql = "insert into tb_user(id, email, password, first_name, last_name,phone_number,date_of_birth,role_level) values (?,?,?,?,?,?,?,?)";

        try {
            connection.setAutoCommit(false);
            PreparedStatement pst = connection.prepareStatement(sql);
            KeyTable keyId = new KeyTable(connection);

            pst.setInt(1, keyId.getKey(sequenceTableName));
            pst.setString(2, user.getEmail());
            pst.setString(3, HttpUtil.encryptPassword(user.getPassword()));
            pst.setString(4, user.getFirstName());
            pst.setString(5, user.getLastName());
            pst.setString(6, user.getPhoneNumber());
            pst.setDate(7, user.getDateOfBirth() == null ? null : new Date(user.getDateOfBirth().getTime()));
            pst.setInt(8,user.getRole().getRoleLevel());

            count = pst.executeUpdate();
            connection.commit();
            pst.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.out.println("insertUser error");
            JDBCUtils.Rollback(connection);
        }
        return count;
    }

    /**
     * updates a user in the table
     * @param obj User object
     * @return true if successful update, false otherwise
     */
    @Override
    public boolean update(DomainObject obj) {
        User user = (User) obj;

        String sql = "UPDATE tb_user SET phone_number = ?, first_name = ?, last_name = ?, email = ?, " +
                "password = ?, date_of_birth = ?, role_level = ? WHERE id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setString(1, user.getPhoneNumber());
            pst.setString(2, user.getFirstName());
            pst.setString(3, user.getLastName());
            pst.setString(4, user.getEmail());
            pst.setString(5, HttpUtil.encryptPassword(user.getPassword()));
            pst.setDate(6, new Date(user.getDateOfBirth().getTime()));
            pst.setInt(7, user.getRole().getRoleLevel());
            pst.setInt(8, user.getId());

            pst.executeUpdate();
            pst.close();
            return true;
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.out.println("update user error");
            JDBCUtils.Rollback(connection);
            return false;
        }
    }

    /**
     * deletes a user from the table
     * @param obj User object
     * @return true if delete successful, false otherwise
     */
    @Override
    public boolean delete(DomainObject obj) {
        User user = (User) obj;

        String sql = "DELETE FROM tb_user WHERE id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, user.getId());

            pst.executeUpdate();
            pst.close();
            return true;
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.out.println("delete user error");
            JDBCUtils.Rollback(connection);
            return false;
        }
    }

    /**
     * find a user by their id
     * @param id of user
     * @return User object
     */
    @Override
    public DomainObject findById(int id) {
        DomainObject user = new User();

        String sql = "SELECT * FROM tb_user WHERE id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, id);
            ResultSet rs = pst.executeQuery();

            while (rs.next())
                user = userFromQueryResult(rs);

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find user by id error");
        }

        return user;
    }

    /**
     * find a user by their email address
     * @param email address
     * @return User object
     */
    public User findByEmail(String email) {
        User user = null;

        String sql = "SELECT * FROM tb_user WHERE email = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setString(1,email);
            ResultSet rs = pst.executeQuery();

            while (rs.next()){
                user = userFromQueryResult(rs);
            }

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find user by email error");
        }

        return user;
    }

    /**
     * finds all users of a specific role
     * @param role role of user
     * @return List of User objects
     */
    public List<User> findByRole(UserRole role) {
        List<User> userList = new ArrayList<>();

        String sql = "SELECT * FROM tb_user WHERE role_level = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, role.getRoleLevel());
            ResultSet rs = pst.executeQuery();

            while (rs.next())
                userList.add(userFromQueryResult(rs));

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find users by role error");
        }

        return userList;
    }

    /**
     * finds all users that work for a hotelier group
     * @param hotelierGroupId id of hotelier group
     * @return List of Hotelier objects
     */
    public List<Hotelier> findByHotelierGroup(Integer hotelierGroupId) {
        List<Hotelier> hotelierList = new ArrayList<>();

        String sql = "SELECT * FROM tb_user tu INNER JOIN tb_group tg ON tu.id = tg.tb_user_id WHERE tg.tb_hotelier_group_id = ?";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setInt(1, hotelierGroupId);
            ResultSet rs = pst.executeQuery();

            while (rs.next())
                hotelierList.add(new Hotelier(
                        rs.getInt("id"),
                        rs.getString("first_name"),
                        rs.getString("last_name"),
                        rs.getString("email"),
                        rs.getString("password"),
                        rs.getString("phone_number"),
                        rs.getDate("date_of_birth")==null?null:
                                new java.util.Date(rs.getDate("date_of_birth").getTime()),
                        UserRole.getUserRole(rs.getInt("role_level"))
                ));

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("find users by role error");
        }

        return hotelierList;
    }

    /**
     * @return all users in the table
     */
    public List<User> findAllUsers() {
        List<User> userList = new ArrayList<>();

        String sql = "SELECT * FROM tb_user";

        try {
            PreparedStatement pst = connection.prepareStatement(sql);
            ResultSet rs = pst.executeQuery();

            while (rs.next())
                userList.add(userFromQueryResult(rs));

            pst.close();
            rs.close();
        } catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("select all user error");
        }

        return userList;
    }

    /**
     * helper function to convert result set into User object
     * @param rs result set from query
     * @return User object
     * @throws SQLException when getting cell value fails
     */
    private User userFromQueryResult(ResultSet rs) throws SQLException {
        return new User(
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
}
