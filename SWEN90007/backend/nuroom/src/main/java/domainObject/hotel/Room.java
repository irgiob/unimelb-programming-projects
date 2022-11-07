package domainObject.hotel;

import domainObject.DomainObject;
import domainObject.amenity.RoomAmenity;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import utils.HttpUtil;

import java.io.Serializable;
import java.util.List;

@ToString
@Getter
@Setter
public class Room extends DomainObject implements Serializable {
    Integer hotelId;
    String roomType;
    String description;
    Integer quantity;
    Float price;
    Integer numBedrooms;
    Integer numBathrooms;
    Integer numBeds;
    String imageURL;
    List<RoomAmenity> roomAmenityList;

    public Room(Integer id) {
        super(id);
    }

    public Room() {
    }

    public Room(Integer id, Integer hotelId, String roomType, String description, Integer quantity, Float price, Integer numBedrooms, Integer numBathrooms, Integer numBeds, String imageURL, List<RoomAmenity> roomAmenityList) {
        super(id);
        this.hotelId = hotelId;
        this.roomType = roomType;
        this.description = description;
        this.quantity = quantity;
        this.price = price;
        this.numBedrooms = numBedrooms;
        this.numBathrooms = numBathrooms;
        this.numBeds = numBeds;
        this.imageURL = imageURL;
        this.roomAmenityList = roomAmenityList;
    }

    public Room(Integer hotelId, String roomType, String description, Integer quantity, Float price, Integer numBedrooms, Integer numBathrooms, Integer numBeds, String imageURL, List<RoomAmenity> roomAmenityList) {
        this.hotelId = hotelId;
        this.roomType = roomType;
        this.description = description;
        this.quantity = quantity;
        this.price = price;
        this.numBedrooms = numBedrooms;
        this.numBathrooms = numBathrooms;
        this.numBeds = numBeds;
        this.imageURL = imageURL;
        this.roomAmenityList = roomAmenityList;
    }

    public boolean checkSameRoom(Room roomDTO){

        return this.roomType.equals(roomDTO.getRoomType());
    }

    public boolean checkParam(){
        return HttpUtil.isNotEmpty(roomType)
                &&this.hotelId!=null;
    }

}
