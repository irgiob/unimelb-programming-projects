package domainObject.user;

import controllers.ViewObject.UserVO;
import datasource.HotelierGroupMapper;
import datasource.UserMapper;
import domainObject.DomainObject;
import domainObject.hotel.Hotel;
import domainObject.HotelierGroup;
import utils.DataConvertUtil;
import utils.Enum.UserRole;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import utils.HttpUtil;
import utils.JDBCUtils;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@ToString
@Getter
@Setter
public class User extends DomainObject implements Serializable {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;
    private Date dateOfBirth;
    private UserRole role;

    public User(Integer id, String firstName, String lastName, String email, String password, String phoneNumber, Date dateOfBirth, UserRole role) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
        this.role = role;
    }

    public User(Integer id) {
        super(id);
    }

    public User(String firstName, String lastName, String email, String password, String phoneNumber, Date dateOfBirth, UserRole role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
        this.role = role;
    }

    public User() {

    }

    public User(UserVO userVO) throws ParseException {
        this.id= userVO.getId();
        this.firstName= userVO.getFirstName();
        this.lastName=userVO.getLastName();
        this.email=userVO.getEmail();
        this.password=userVO.getPassword();
        this.phoneNumber=userVO.getPhoneNumber();
        this.dateOfBirth= userVO.getDateOfBirth()==null?
                null:DataConvertUtil.stringConvertUtilDate(userVO.getDateOfBirth());
        this.role=UserRole.getUserRole(userVO.getRoleLevel());
    }

    public User(String email){
        this.email=email;
    }

    @Override
    public Integer getId() {
        if(id==null){
            load();
        }
        return super.getId();
    }

    public UserRole getRole() {
        if(role==null){
            load();
        }
        return role;
    }

    public String getPassword() {
        if(password==null){
            load();
        }
        return password;
    }

    private void load() {
        Connection connection = JDBCUtils.Connect();
        UserMapper userMapper=new UserMapper(connection);
        User userDTO=userMapper.findByEmail(email);
        if(userDTO!=null){
            if(this.id==null){
                this.id=userDTO.getId();
            }
            if(this.role==null){
                this.role=userDTO.getRole();
            }
            if(this.password==null){
                this.password=userDTO.getPassword();
            }
            this.phoneNumber=userDTO.getPhoneNumber();
            this.dateOfBirth= userDTO.getDateOfBirth()==null?
                    null:new java.sql.Date(userDTO.getDateOfBirth().getTime());
            this.lastName=userDTO.getLastName();
            this.firstName=userDTO.getFirstName();
        }
        try {
            connection.close();
        } catch (SQLException e) {
            System.err.println(e);
        }

    }

    public boolean checkParam(){
        return HttpUtil.isNotEmpty(email) && HttpUtil.isNotEmpty(password);
    }

    public boolean checkPermission(Hotel hotel, Connection connection) {
        //2. check group exists
        HotelierGroup hotelierGroup=new HotelierGroup(hotel.getHotelierGroupId());
        if(HttpUtil.isNotEmpty(hotelierGroup.getName())){
            //3. check group permission
            HotelierGroupMapper hotelierGroupMapper=new HotelierGroupMapper(connection);
            List<HotelierGroup> hotelierGroupList=hotelierGroupMapper.findByHotelier(id);
            List<Integer> groupIdList=hotelierGroupList.stream().map(HotelierGroup::getId).collect(Collectors.toList());
            return groupIdList.contains(hotel.getHotelierGroupId());
        }
        return true;
    }
}
