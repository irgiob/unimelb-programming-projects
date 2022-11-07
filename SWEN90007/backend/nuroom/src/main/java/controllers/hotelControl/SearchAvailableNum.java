package controllers.hotelControl;

import com.fasterxml.jackson.databind.ObjectMapper;
import controllers.ViewObject.BookingVO;
import domainObject.booking.Booking;
import domainObject.hotel.Room;
import lombok.SneakyThrows;
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

@WebServlet("/SearchAvailableNum")
public class SearchAvailableNum extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }

    @SneakyThrows
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String jsonStr= HttpUtil.stringifyJSON(request);

        BookingVO bookingVO =  new ObjectMapper().readValue(jsonStr, BookingVO.class);
        Booking booking=new Booking(bookingVO);

        Connection connection= JDBCUtils.Connect();
        if (connection!=null){
            RoomService roomService=new RoomService(connection);

            Result<List<Room>> result= roomService.searchAvailableNum(booking);

            HttpUtil.httpResponse(response,result);
            JDBCUtils.Close(connection);
        }
        HttpUtil.httpResponse(response,new Result("System busy,try again later",400, Constants.FAIL));
    }
}
