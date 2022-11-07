package service.hotelService;

import controllers.ViewObject.SearchRoomVO;
import datasource.HotelAmenityMapper;
import datasource.HotelMapper;
import datasource.HotelierGroupMapper;
import domainObject.HotelierGroup;
import domainObject.amenity.HotelAmenity;
import domainObject.hotel.Hotel;
import domainObject.hotel.Room;
import domainObject.user.User;
import utils.*;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class HotelService implements IHotelService{
    Connection connection;
    HotelMapper hotelMapper;
    HotelAmenityMapper hotelAmenityMapper;
    HotelierGroupMapper hotelierGroupMapper;

    public HotelService(Connection connection) {
        this.connection = connection;
        hotelMapper=new HotelMapper(connection);
        hotelAmenityMapper=new HotelAmenityMapper(connection);
        hotelierGroupMapper=new HotelierGroupMapper(connection);
    }

    @Override
    public Result<String> createHotel(Hotel hotel, User hotelier) {
        //1. check param valid
        if(!hotel.checkParam()){
            return new Result<>("param cannot be empty",2100, Constants.HOTELIER_CODE2100_ERROR);
        }

        //3. check hotel exists
        for(Hotel h:hotelMapper.findByName(hotel.getName())){
            if(hotel.checkSameHotel(h)){
                return new Result<>("hotel has existed",2120,Constants.HOTELIER_CODE2100_ERROR);
            }
        }

        //2. check permission
        if(!hotelier.checkPermission(hotel,connection)){
            return new Result<>("no group permission",2110,Constants.HOTELIER_CODE2100_ERROR);
        }

        UnitOfWork.getCurrent().registerNew(hotel);
        return new Result<>(null,200,Constants.SUCCESS);
    }

    @Override
    public Result<String> modifyHotel(Hotel hotel, User hotelier) {
        try {
            connection.setAutoCommit(false);
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        //1. check param valid
        if(!hotel.checkParam()){
            return new Result<>("param cannot be empty",2300, Constants.HOTELIER_CODE2300_ERROR);
        }

        Hotel hotelDTO=(Hotel) hotelMapper.findById(hotel.getId());

        //3. check hotel exists when critical fields changed
        if(!hotel.checkSameHotel(hotelDTO)){
            for(Hotel h:hotelMapper.findByName(hotel.getName())){
                if(hotel.checkSameHotel(h)){
                    return new Result<>("hotel has existed",2310,Constants.HOTELIER_CODE2300_ERROR);
                }
            }
        }

        //4. check permission
        if(!hotelier.checkPermission(hotel,connection)){
            return new Result<>("no group permission",2320,Constants.HOTELIER_CODE2300_ERROR);
        }

        UnitOfWork.getCurrent().registerDirty(hotel);

        if(hotel.getHotelAmenityList()!=null){
            List<HotelAmenity> hotelAmenityListDTO=hotelAmenityMapper.findByHotel(hotel.getId());

            hotelAmenityListDTO.forEach(e->UnitOfWork.getCurrent().registerDeleted(e));

            hotel.getHotelAmenityList().forEach(e->{
                e.setHotelId(hotel.getId());
                UnitOfWork.getCurrent().registerNew(e);
            });
        }

        return new Result<>("true",200,Constants.SUCCESS);
    }

    @Override
    public Result<List<Hotel>> viewHotelierHotels(Integer hotelierId) {
        //1. param check
        if(hotelierId==null){
            return new Result<>(null,2500,Constants.HOTELIER_CODE2500_ERROR);
        }
        List<Hotel> hotelList = new ArrayList<>();
        for(HotelierGroup g:hotelierGroupMapper.findByHotelier(hotelierId)){
            g.setHotelList(hotelMapper.findByHotelierGroup(g.getId()));
            hotelList.addAll(g.getHotelList());
        }
        List<HotelAmenity> hotelAmenityList= hotelAmenityMapper.findByHotelier(hotelierId);
        hotelList.forEach(e->e.setHotelAmenityList(
                hotelAmenityList.stream().filter(
                        h-> h.getHotelId().equals(e.getId())).collect(Collectors.toList())));

        return new Result<>(hotelList,200,Constants.SUCCESS);
    }

    @Override
    public Result<String> removeHotel(Hotel hotel) {
        //0. param check
        if(hotel.getId()==null){
            return new Result<>("id cannot be empty",1400, Constants.ADMIN_CODE1400_ERROR);
        }

        hotelMapper.delete(hotel);
        return new Result<>("true",200,Constants.SUCCESS);
    }

    @Override
    public Result<List<Hotel>> viewAllHotels() {
        return new Result<>(hotelMapper.findAllHotels(),200,Constants.SUCCESS);
    }

    @Override
    public Result<List<Hotel>> searchValidRoom(SearchRoomVO searchRoomVO) {
        List<Hotel> hotelList=hotelMapper.findByAvailability(searchRoomVO);
        return new Result<>(hotelList,200,Constants.SUCCESS);
    }
}
