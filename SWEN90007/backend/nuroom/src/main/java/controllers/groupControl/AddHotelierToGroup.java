package controllers.groupControl;

import com.fasterxml.jackson.databind.ObjectMapper;
import controllers.ViewObject.HotelierToGroupVO;
import org.checkerframework.checker.units.qual.A;
import service.groupService.GroupService;
import utils.Constants;
import utils.HttpUtil;
import utils.JDBCUtils;
import utils.Result;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;

@WebServlet("/AddHotelierToGroup")
public class AddHotelierToGroup extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String jsonStr= HttpUtil.stringifyJSON(request);
        //hotelier email + group id
        HotelierToGroupVO hotelierToGroupVO =  new ObjectMapper().readValue(jsonStr, HotelierToGroupVO.class);

        Connection connection= JDBCUtils.Connect();
        if (connection!=null){
            GroupService groupService=new GroupService(connection);

            Result<String> result=groupService.addHotelierToGroup(hotelierToGroupVO);

            HttpUtil.httpResponse(response,result);
            JDBCUtils.Close(connection);
        }
        HttpUtil.httpResponse(response,new Result("System busy,try again later",400, Constants.FAIL));
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);

    }
}
