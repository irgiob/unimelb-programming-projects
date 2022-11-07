package service.accountService;

import controllers.ViewObject.LoginVO;
import controllers.ViewObject.UserVO;
import datasource.UserMapper;
import domainObject.user.User;
import org.junit.Test;
import utils.JDBCUtils;
import utils.Result;

import java.sql.Connection;
import java.util.List;

import static org.junit.Assert.*;

public class AccountServiceTest {
    Connection connection= JDBCUtils.Connect();
    UserMapper userMapper =new UserMapper(connection);

    @Test
    public void test_customer_login_success() {
        User test_user = userMapper.findByEmail("customer2@gmail.com");
        test_user.setPassword("Password2");

        Connection connection= JDBCUtils.Connect();
        AccountService user_service = new AccountService(connection);

        Result<LoginVO> response = user_service.UserLogin(test_user);
        int response_error_code = response.getErrorCode();

        assertEquals(response_error_code,200);
    }

    @Test
    public void test_hotelier_login_success() {
        User test_user = userMapper.findByEmail("zhongyib@student.unimelb.edu.au");
        test_user.setPassword("P@ssword2");

        Connection connection= JDBCUtils.Connect();
        AccountService user_service = new AccountService(connection);

        Result<LoginVO> response = user_service.UserLogin(test_user);
        int response_error_code = response.getErrorCode();

        assertEquals(response_error_code,200);
    }

    @Test
    public void test_administrator_login_success() {
        User test_user = userMapper.findByEmail("xiaguo2@student.unimelb.edu.au");
        test_user.setPassword("P@ssword2");

        Connection connection= JDBCUtils.Connect();
        AccountService user_service = new AccountService(connection);

        Result<LoginVO> response = user_service.UserLogin(test_user);
        int response_error_code = response.getErrorCode();

        assertEquals(response_error_code,200);
    }

    @Test
    public void test_customer_login_password_incorrect() {
        User test_user = userMapper.findByEmail("customer2@gmail.com");
        test_user.setPassword("Password");

        Connection connection= JDBCUtils.Connect();
        AccountService user_service = new AccountService(connection);

        Result<LoginVO> response = user_service.UserLogin(test_user);
        int response_error_code = response.getErrorCode();

        assertEquals(response_error_code,400);
    }

    @Test
    public void test_hotelier_login_password_incorrect() {
        User test_user = userMapper.findByEmail("zhongyib@student.unimelb.edu.au");
        test_user.setPassword("P@ssword");

        Connection connection= JDBCUtils.Connect();
        AccountService user_service = new AccountService(connection);

        Result<LoginVO> response = user_service.UserLogin(test_user);
        int response_error_code = response.getErrorCode();

        assertEquals(response_error_code,400);
    }

    @Test
    public void test_administrator_password_incorrect() {
        User test_user = userMapper.findByEmail("xiaguo2@student.unimelb.edu.au");
        test_user.setPassword("P@ssword");

        Connection connection= JDBCUtils.Connect();
        AccountService user_service = new AccountService(connection);

        Result<LoginVO> response = user_service.UserLogin(test_user);
        int response_error_code = response.getErrorCode();

        assertEquals(response_error_code,400);
    }

    @Test
    public void customerSignUp() {
    }

    @Test
    public void onboardHotelier() {
    }

    @Test
    public void viewAllUserList() {
        Connection connection= JDBCUtils.Connect();
        AccountService accountService=new AccountService(connection);

        Result<List<UserVO>> response=accountService.viewAllUserList();

        int response_error_code = response.getErrorCode();

        assertEquals(response_error_code,200);
    }
}