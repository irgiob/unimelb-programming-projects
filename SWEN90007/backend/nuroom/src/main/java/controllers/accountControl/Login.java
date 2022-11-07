package controllers.accountControl;


import controllers.ViewObject.LoginVO;
import controllers.ViewObject.UserVO;
import domainObject.user.User;
import lombok.SneakyThrows;
import service.accountService.AccountService;
import utils.Constants;
import utils.JDBCUtils;
import utils.Result;
import utils.HttpUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * The controller layer will only design API and receive values from FE
 * And controller will call Service layer
 */
@WebServlet("/login")
public class Login extends HttpServlet {
    @SneakyThrows
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 1. get json from request
        String jsonStr= HttpUtil.stringifyJSON(request);

        // 2. parse json to create class object and inject service
        UserVO userVO =  new ObjectMapper().readValue(jsonStr, UserVO.class);
        User user=new User(userVO);

        Connection connection= JDBCUtils.Connect();
        if (connection!=null){
            AccountService accountService=new AccountService(connection);

            // 3. invoke and get result from service
            Result<LoginVO> result=accountService.UserLogin(user);

            // 4. response to FE
            HttpUtil.httpResponse(response,result);
            JDBCUtils.Close(connection);
        }
        HttpUtil.httpResponse(response,new Result("System busy,try again later",400, Constants.FAIL));
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);

    }
}