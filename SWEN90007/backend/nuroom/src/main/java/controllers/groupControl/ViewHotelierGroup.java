package controllers.groupControl;

import datasource.HotelierGroupMapper;
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
import java.util.List;

@WebServlet("/ViewHotelierGroup")
public class ViewHotelierGroup extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Connection connection= JDBCUtils.Connect();
        if (connection!=null){
            GroupService groupService=new GroupService(connection);

            Result<List<HotelierGroup>> result= groupService.viewHotelierGroup(HttpUtil.tokenUser(request));

            HttpUtil.httpResponse(response,result);
            JDBCUtils.Close(connection);
        }
        HttpUtil.httpResponse(response,new Result("System busy,try again later",400, Constants.FAIL));
    }
}
