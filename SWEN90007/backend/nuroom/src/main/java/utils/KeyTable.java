package utils;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class KeyTable {
    Connection connection;

    public KeyTable(Connection connection) {
        this.connection = connection;
    }

    /**
     * @param sequenceTableName Name of the corresponding Database sequence table
     * @return List of generated table-unique keys
     */
    public Integer getKey(String sequenceTableName) {
        int key = -1;

        // 2. write sql
        String sql = "SELECT nextval(?)";

        try {
            // 3. set params and execute sql
            PreparedStatement pst = connection.prepareStatement(sql);
            pst.setString(1,sequenceTableName);
            ResultSet rs = pst.executeQuery();

            // 4. collect data
            while (rs.next())
            {
                key = rs.getInt("nextval");
            }
            pst.close();

        }catch (SQLException throwable) {
            throwable.printStackTrace();
            System.err.println("getKey error");
        }
        return key;
    }
}
