package controllers.bookingControl;

import com.fasterxml.jackson.databind.ObjectMapper;
import controllers.ViewObject.BookingVO;
import domainObject.booking.Booking;
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

@WebServlet("/CancelBooking")
public class CancelBooking extends HttpServlet {
    @SneakyThrows
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String jsonStr= HttpUtil.stringifyJSON(request);

        BookingVO bookingVO =  new ObjectMapper().readValue(jsonStr, BookingVO.class);
        Booking booking=new Booking(bookingVO);

        Connection connection= JDBCUtils.Connect();
        if (connection!=null){
            BookingService bookingService=new BookingService(connection);

            Result<String> result= bookingService.cancelBooking(booking);

            HttpUtil.httpResponse(response,result);
            JDBCUtils.Close(connection);
        }
        HttpUtil.httpResponse(response,new Result("System busy,try again later",400, Constants.FAIL));
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);

    }
}
