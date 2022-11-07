package service.groupService;

import controllers.ViewObject.GroupVO;
import controllers.ViewObject.HotelierToGroupVO;
import datasource.HotelierGroupMapper;
import domainObject.HotelierGroup;
import domainObject.amenity.HotelAmenity;
import domainObject.hotel.Hotel;
import domainObject.user.User;
import utils.Constants;
import utils.Enum.UserRole;
import utils.HttpUtil;
import utils.JDBCUtils;
import utils.Result;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class GroupService implements IGroupService{
    Connection connection;
    HotelierGroupMapper hotelierGroupMapper;

    public GroupService(Connection connection) {
        this.connection = connection;
        hotelierGroupMapper=new HotelierGroupMapper(connection);
    }

    @Override
    public Result<String> createHotelierGroup(HotelierGroup hotelierGroup) {
        //0. param check
        if(!HttpUtil.isNotEmpty(hotelierGroup.getName())){
            return new Result<>("name cannot be empty",1200, Constants.ADMIN_CODE1200_ERROR);
        }
        //1. check group exists
        HotelierGroup hotelierGroupDTO=new HotelierGroup(hotelierGroup.getName());
        if(hotelierGroupDTO.getId()!=null){
            return new Result<>("group existed",1210,Constants.ADMIN_CODE1200_ERROR);
        }
        //insert
        int result=hotelierGroupMapper.insert(hotelierGroup);
        return new Result<>(Integer.toString(result),200,Constants.SUCCESS);
    }


    @Override
    public Result<String> addHotelierToGroup(HotelierToGroupVO hotelierToGroupVO) {
        //0. check param
        if(!HttpUtil.isNotEmpty(hotelierToGroupVO.getEmail()) || hotelierToGroupVO.getGroupId()==null){
            return new Result<>("param cannot be empty",1100, Constants.ADMIN_CODE1100_ERROR);
        }
        //1. check group exists
        HotelierGroup hotelierGroupDTO=new HotelierGroup(hotelierToGroupVO.getGroupId());
        if(!HttpUtil.isNotEmpty(hotelierGroupDTO.getName())){
            return new Result<>("group not exists",1110,Constants.ADMIN_CODE1100_ERROR);
        }
        //2. check role
        User hotelier=new User(hotelierToGroupVO.getEmail());
        if(hotelier.getRole()==null||!hotelier.getRole().equals(UserRole.HOTELIER)){
            return new Result<>("user is not hotelier",1120,Constants.ADMIN_CODE1100_ERROR);
        }
        //3. check duplicate record in group
        List<HotelierGroup> groupList= hotelierGroupMapper.findByHotelier(hotelier.getId());
        List<Integer> groupIdList=groupList.stream().map(HotelierGroup::getId).collect(Collectors.toList());
        if(groupIdList.contains(hotelierToGroupVO.getGroupId())){
            return new Result<>("user has existed in group",1130,Constants.ADMIN_CODE1100_ERROR);
        }
        //insert into tb_group
        int result=hotelierGroupMapper.insertHotelierToGroup(hotelier.getId(),hotelierToGroupVO.getGroupId());
        return new Result<>(Integer.toString(result),200,Constants.SUCCESS);
    }

    @Override
    public Result<String> removeHotelierFromGroup(GroupVO groupVO) {
        //0. param check
        if(groupVO.getGroupId()==null || groupVO.getUserId()==null){
            return new Result<>("param cannot be empty",1500,Constants.ADMIN_CODE1500_ERROR);
        }

        if(!hotelierGroupMapper.removeHotelierFromGroup(groupVO.getUserId(),groupVO.getGroupId())){
            return new Result<>("remove fail",1510, Constants.ADMIN_CODE1500_ERROR);
        }

        return new Result<>("true",200,Constants.SUCCESS);
    }

    @Override
    public Result<List<HotelierGroup>> viewHotelierGroup(User user) {
        List<HotelierGroup> hotelierGroupList=hotelierGroupMapper.findByHotelier(user.getId());
        return new Result<>(hotelierGroupList,200,Constants.SUCCESS);
    }

    @Override
    public Result<List<HotelierGroup>> viewAllHotelierGroup() {
        List<HotelierGroup> hotelierGroupList=hotelierGroupMapper.findAll();
        return new Result<>(hotelierGroupList,200,Constants.SUCCESS);
    }
}
