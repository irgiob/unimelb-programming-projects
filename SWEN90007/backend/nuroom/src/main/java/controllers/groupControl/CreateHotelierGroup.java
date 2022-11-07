package controllers.groupControl;

import com.fasterxml.jackson.databind.ObjectMapper;
import domainObject.HotelierGroup;
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

@WebServlet("/CreateHotelierGroup")
public class CreateHotelierGroup extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String jsonStr= HttpUtil.stringifyJSON(request);
        //unique name; check duplicate
        HotelierGroup hotelierGroup =  new ObjectMapper().readValue(jsonStr, HotelierGroup.class);

        Connection connection= JDBCUtils.Connect();
        if (connection!=null){
            GroupService groupService=new GroupService(connection);

            Result<String> result=groupService.createHotelierGroup(hotelierGroup);

            HttpUtil.httpResponse(response,result);
            JDBCUtils.Close(connection);
        }
        HttpUtil.httpResponse(response,new Result("System busy,try again later",400, Constants.FAIL));
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);

    }
}
