package service.accountService;

import controllers.ViewObject.LoginVO;
import controllers.ViewObject.UserVO;
import domainObject.user.Customer;
import domainObject.user.Hotelier;
import domainObject.user.User;
import utils.Result;

import java.util.List;

public interface IAccountService {
    Result<LoginVO> UserLogin(User user);

    Result<String> customerSignUp(Customer customer);

    Result<String> onboardHotelier(Hotelier hotelier);

    Result<List<UserVO>> viewAllUserList();
}
