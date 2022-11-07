package controllers.hotelControl;

import com.fasterxml.jackson.databind.ObjectMapper;
import domainObject.hotel.Hotel;
import service.hotelService.HotelService;
import utils.*;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.time.chrono.JapaneseDate;
import java.util.List;

@WebServlet("/CreateHotel")
public class CreateHotel extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String jsonStr= HttpUtil.stringifyJSON(request);

        Hotel hotel =  new ObjectMapper().readValue(jsonStr, Hotel.class);

        Connection connection= JDBCUtils.Connect();
        if (connection!=null){
            HotelService hotelService=new HotelService(connection);
            UnitOfWork.newCurrent();

            //todo: group permission concurrency
            Result<String> result= hotelService.createHotel(hotel,HttpUtil.tokenUser(request));

            if(result.getErrorCode()!=200){
                HttpUtil.httpResponse(response,result);
            }else{
                Result<List<Result<Boolean>>> uowResult=UnitOfWork.getCurrent().commitResult(connection);
                HttpUtil.httpResponse(response,uowResult);
            }

            JDBCUtils.Close(connection);
        }
        HttpUtil.httpResponse(response,new Result("System busy,try again later",400, Constants.FAIL));
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);

    }
}
