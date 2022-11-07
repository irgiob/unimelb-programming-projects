package service.groupService;

import controllers.ViewObject.GroupVO;
import controllers.ViewObject.HotelierToGroupVO;
import domainObject.HotelierGroup;
import domainObject.hotel.Hotel;
import domainObject.user.User;
import utils.Result;

import java.util.List;

public interface IGroupService {
    Result<String> createHotelierGroup(HotelierGroup hotelierGroup);

    Result<String> addHotelierToGroup(HotelierToGroupVO hotelierToGroupVO);

    Result<String> removeHotelierFromGroup(GroupVO groupVO);

    Result<List<HotelierGroup>> viewHotelierGroup(User user);

    Result<List<HotelierGroup>> viewAllHotelierGroup();
}
