package controllers.hotelControl;

import com.fasterxml.jackson.databind.ObjectMapper;
import domainObject.hotel.Hotel;
import domainObject.hotel.Room;
import service.roomService.RoomService;
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

@WebServlet("/ViewHotelRooms")
public class ViewHotelRooms extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String jsonStr= HttpUtil.stringifyJSON(request);

        Hotel hotel =  new ObjectMapper().readValue(jsonStr, Hotel.class);

        Connection connection= JDBCUtils.Connect();
        if (connection!=null){
            RoomService roomService=new RoomService(connection);

            Result<List<Room>> result=roomService.viewHotelRooms(hotel.getId());

            HttpUtil.httpResponse(response,result);
            JDBCUtils.Close(connection);
        }
        HttpUtil.httpResponse(response,new Result("System busy,try again later",400, Constants.FAIL));
    }
}
