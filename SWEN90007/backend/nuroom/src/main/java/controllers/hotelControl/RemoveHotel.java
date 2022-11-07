package controllers.hotelControl;

import com.fasterxml.jackson.databind.ObjectMapper;
import concurrency.BookingLockManager;
import domainObject.hotel.Hotel;
import domainObject.user.User;
import service.hotelService.HotelService;
import utils.*;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;

@WebServlet("/RemoveHotel")
public class RemoveHotel extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        User currentUser=HttpUtil.tokenUser(request);
        String jsonStr= HttpUtil.stringifyJSON(request);
        Hotel hotel =  new ObjectMapper().readValue(jsonStr, Hotel.class);

        Connection connection= JDBCUtils.Connect();
        if (connection!=null){
            BookingLockManager.getInstance().acquireWriteLock(hotel.getId(),currentUser.getId());
            HotelService hotelService=new HotelService(connection);

            Result<String> result=hotelService.removeHotel(hotel);

            HttpUtil.httpResponse(response,result);
            JDBCUtils.Close(connection);
            BookingLockManager.getInstance().releaseWriteLock(hotel.getId(),currentUser.getId());
        }
        HttpUtil.httpResponse(response,new Result("System busy,try again later",400, Constants.FAIL));
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);

    }
}
