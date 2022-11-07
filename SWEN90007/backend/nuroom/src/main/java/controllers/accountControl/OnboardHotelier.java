package controllers.accountControl;

import com.fasterxml.jackson.databind.ObjectMapper;
import controllers.ViewObject.UserVO;
import domainObject.user.Hotelier;
import lombok.SneakyThrows;
import service.accountService.AccountService;
import utils.Constants;
import utils.HttpUtil;
import utils.JDBCUtils;
import utils.Result;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;

@WebServlet("/OnboardHotelier")
public class OnboardHotelier extends HttpServlet {
    @SneakyThrows
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String jsonStr= HttpUtil.stringifyJSON(request);

        UserVO userVO =  new ObjectMapper().readValue(jsonStr, UserVO.class);
        Hotelier hotelier=new Hotelier(userVO);

        Connection connection= JDBCUtils.Connect();
        if (connection!=null){
            AccountService accountService=new AccountService(connection);

            Result<String> result=accountService.onboardHotelier(hotelier);

            HttpUtil.httpResponse(response,result);
            JDBCUtils.Close(connection);
        }
        HttpUtil.httpResponse(response,new Result("System busy,try again later",400, Constants.FAIL));
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        this.doPost(request, response);

    }
}
