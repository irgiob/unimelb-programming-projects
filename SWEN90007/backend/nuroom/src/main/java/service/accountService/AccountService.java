package service.accountService;

import controllers.ViewObject.LoginVO;
import controllers.ViewObject.UserVO;
import datasource.UserMapper;
import domainObject.user.Customer;
import domainObject.user.Hotelier;
import domainObject.user.User;
import utils.Constants;
import utils.Enum.UserRole;
import utils.HttpUtil;
import utils.JDBCUtils;
import utils.Result;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

public class AccountService implements IAccountService{
    Connection connection;
    UserMapper userMapper;

    public AccountService(Connection connection) {
        this.connection = connection;
        userMapper=new UserMapper(connection);
    }

    @Override
    public Result<LoginVO> UserLogin(User user) {

        User userDTO=new User(user.getEmail());
        // 1. check password
        if (!HttpUtil.isNotEmpty(user.getPassword()) ||
                !HttpUtil.isNotEmpty(userDTO.getPassword()) ||
                !userDTO.getPassword().equals(HttpUtil.encryptPassword(user.getPassword()))) {
            return new Result<>(null, 400, "wrong password or user not exists");
        }
        // 3. check role
        if (user.getRole() == null || !userDTO.getRole().equals(user.getRole())) {
            return new Result<>(null, 400, "login with wrong role");
        }

        //get token
        String token = HttpUtil.getToken(userDTO);
        LoginVO loginVO = new LoginVO(userDTO);
        loginVO.setToken(token);
        loginVO.setPassword(null);

        // return result which contains the class, code, and message
        return new Result<>(loginVO, 200, Constants.SUCCESS);

    }

    @Override
    public Result<String> customerSignUp(Customer customer) {
        if(!customer.checkParam()){
            return new Result<>("param cannot be empty",3100, Constants.CUSTOMER_CODE3100_ERROR);
        }

        //check role
        if(customer.getRole()!= UserRole.CUSTOMER){
            return new Result<>("sign up in wrong role",3110,Constants.CUSTOMER_CODE3100_ERROR);
        }

        User customerDTO= new User(customer.getEmail());
        if(customerDTO.getId() != null){
            return new Result<>("user has signed up",3120,Constants.CUSTOMER_CODE3100_ERROR);
        }

        if(userMapper.insert(customer)==0){
            return new Result<>("sign up error",3130,Constants.CUSTOMER_CODE3100_ERROR);
        }

        return new Result<>("sign up success",200,Constants.SUCCESS);
    }

    @Override
    public Result<String> onboardHotelier(Hotelier hotelier) {
        if(!hotelier.checkParam()){
            return new Result<>("param cannot be empty",1300, Constants.ADMIN_CODE1300_ERROR);
        }

        User hotelierDTO= new User(hotelier.getEmail());
        if(hotelierDTO.getId() != null){
            return new Result<>("user has signed up",1310,Constants.ADMIN_CODE1300_ERROR);
        }

        if(userMapper.insert(hotelier)==0){
            return new Result<>("no user created",1320,Constants.ADMIN_CODE1100_ERROR);
        }

        return new Result<>("sign up success",200,Constants.SUCCESS);
    }

    @Override
    public Result<List<UserVO>> viewAllUserList() {
        List<User> userList=userMapper.findAllUsers();
        List<UserVO> userVOList=new ArrayList<>();
        userList.forEach(e->userVOList.add(new UserVO(e)));
        return new Result<>(userVOList,200,Constants.SUCCESS);
    }
}
