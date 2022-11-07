package controllers.hotelControl;

import com.fasterxml.jackson.databind.ObjectMapper;
import controllers.ViewObject.SearchRoomVO;
import domainObject.hotel.Hotel;
import service.hotelService.HotelService;
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

@WebServlet("/SearchAccommodation")
public class SearchAccommodation extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String jsonStr= HttpUtil.stringifyJSON(request);

        SearchRoomVO searchRoomVO =  new ObjectMapper().readValue(jsonStr, SearchRoomVO.class);

        Connection connection= JDBCUtils.Connect();
        if (connection!=null){
            HotelService hotelService=new HotelService(connection);

            Result<List<Hotel>> result= hotelService.searchValidRoom(searchRoomVO);

            HttpUtil.httpResponse(response,result);
            JDBCUtils.Close(connection);
        }
        HttpUtil.httpResponse(response,new Result("System busy,try again later",400, Constants.FAIL));
    }
}
