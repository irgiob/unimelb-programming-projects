package controllers.bookingControl;

import com.fasterxml.jackson.databind.ObjectMapper;
import concurrency.BookingLockManager;
import controllers.ViewObject.BookingVO;
import domainObject.booking.Booking;
import domainObject.user.User;
import lombok.SneakyThrows;
import service.bookingService.BookingService;
import utils.*;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.util.List;

@WebServlet("/BookHotel")
public class BookHotel extends HttpServlet {
    @SneakyThrows
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        User currentUser=HttpUtil.tokenUser(request);
        String jsonStr= HttpUtil.stringifyJSON(request);

        BookingVO bookingVO =  new ObjectMapper().readValue(jsonStr, BookingVO.class);
        Booking booking=new Booking(bookingVO);
        booking.setUserId(currentUser.getId());

        Connection connection= JDBCUtils.Connect();
        if (connection!=null){
            BookingLockManager.getInstance().acquireWriteLock(bookingVO.getHotelId(),currentUser.getId());
            BookingService bookingService=new BookingService(connection);
            UnitOfWork.newCurrent();

            Result<String> result= bookingService.bookHotel(booking);

            if(result.getErrorCode()!=200){
                HttpUtil.httpResponse(response,result);
            }else{
                Result<List<Result<Boolean>>> uowResult=UnitOfWork.getCurrent().commitResult(connection);
                HttpUtil.httpResponse(response,uowResult);
            }

            JDBCUtils.Close(connection);

            BookingLockManager.getInstance().releaseWriteLock(bookingVO.getHotelId(),currentUser.getId());
        }
        HttpUtil.httpResponse(response,new Result("System busy,try again later",400, Constants.FAIL));
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);

    }
}
