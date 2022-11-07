package utils;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import java.sql.*;

public class JDBCUtils {

    public static Connection Connect(){
        Connection c=null;
        try {
            Class.forName("org.postgresql.Driver");
            c = DriverManager
                    .getConnection(Constants.URL, Constants.USERNAME, Constants.PASSWORD);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println(e.getClass().getName()+": "+e.getMessage());
            return null;
        }
        System.out.println("database opened");
        return c; //return connection
    }

    public static Connection getConnection(){
        Connection conn=null;
        Context ctx = null;
        try {
            ctx = new InitialContext();//初始化上下文
            DataSource ds= (DataSource)ctx.lookup("java:comp/env/jdbc/message");//date对象
            conn = ds.getConnection();
        } catch (NamingException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return conn;
    }


    public static void Rollback(Connection c){

        try {
            c.close();
            c.rollback();
            UnitOfWork.newCurrent();
            System.out.println("database rollback");
        } catch (SQLException throwables) {
            System.err.println("JDBC close or rollback fail");
            throwables.printStackTrace();
        }
    }

    public static void Close(Connection connection){
        try {
            connection.close();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
            System.err.println("database closed fail");
        }
        System.out.println("database closed");
    }

}
