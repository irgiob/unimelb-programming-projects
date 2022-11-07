package domainObject;

import datasource.HotelierGroupMapper;
import domainObject.hotel.Hotel;
import domainObject.user.Hotelier;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import utils.JDBCUtils;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

@Getter
@Setter
@ToString
public class HotelierGroup extends DomainObject implements Serializable {
    private String name;
    private List<Hotelier> hotelierList;
    private List<Hotel> hotelList;

    public HotelierGroup(Integer id) {
        super(id);
    }

    public HotelierGroup(String name){
        this.name=name;
    }

    public HotelierGroup() {
    }

    public HotelierGroup(Integer id, String name, List<Hotelier> hotelierList, List<Hotel> hotelList) {
        this.id = id;
        this.name = name;
        this.hotelierList = hotelierList;
        this.hotelList = hotelList;
    }

    public HotelierGroup(String name, List<Hotelier> hotelierList, List<Hotel> hotelList) {
        this.name = name;
        this.hotelierList = hotelierList;
        this.hotelList = hotelList;
    }

    public String getName() {
       if(name==null){
           load();
       }
        return name;
    }

    public Integer getId(){
        if(id==null){
            load();
        }
        return id;
    }

    private void load(){
        Connection connection = JDBCUtils.Connect();
        HotelierGroupMapper hotelierGroupMapper=new HotelierGroupMapper(connection);
        if(id!=null&&name==null){
            HotelierGroup hotelierGroupDTO= (HotelierGroup) hotelierGroupMapper.findById(id);
            if(hotelierGroupDTO.getId()!=null){
                name= hotelierGroupDTO.getName();
            }
        }
        if(name!=null&&id==null){
            HotelierGroup hotelierGroupDTO= hotelierGroupMapper.findByName(name);
            if(hotelierGroupDTO!=null){
                id= hotelierGroupDTO.getId();
            }
        }
        assert connection != null;
        JDBCUtils.Close(connection);
    }
}
