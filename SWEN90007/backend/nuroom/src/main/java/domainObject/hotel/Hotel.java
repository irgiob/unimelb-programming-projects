package domainObject.hotel;

import domainObject.DomainObject;
import domainObject.amenity.HotelAmenity;
import domainObject.booking.Booking;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import utils.HttpUtil;

import java.io.Serializable;
import java.util.List;

@ToString
@Getter
@Setter
public class Hotel extends DomainObject implements Serializable {
    String name;
    String country;
    String state;
    String street;
    String postcode;
    Integer isActive;
    String streetNo;
    String imageURL;
    Integer versionNo;

    Integer hotelierGroupId;
    String hotelierGroupName;
    List<Room> roomList;
    List<HotelAmenity> hotelAmenityList;
    List<Booking> bookingList;

    public Hotel(Integer id) {
        super(id);
    }

    public Hotel(Integer id, String name, String country, String state, String street, String postcode, Integer isActive, String streetNo, String imageURL, Integer versionNo, Integer hotelierGroupId, String hotelierGroupName, List<Room> roomList, List<HotelAmenity> hotelAmenityList, List<Booking> bookingList) {
        super(id);
        this.name = name;
        this.country = country;
        this.state = state;
        this.street = street;
        this.postcode = postcode;
        this.isActive = isActive;
        this.streetNo = streetNo;
        this.imageURL = imageURL;
        this.versionNo = versionNo;
        this.hotelierGroupId = hotelierGroupId;
        this.hotelierGroupName = hotelierGroupName;
        this.roomList = roomList;
        this.hotelAmenityList = hotelAmenityList;
        this.bookingList = bookingList;
    }

    public Hotel(String name, String country, String state, String street, String postcode, Integer isActive, String streetNo, String imageURL, Integer versionNo, Integer hotelierGroupId, String hotelierGroupName, List<Room> roomList, List<HotelAmenity> hotelAmenityList, List<Booking> bookingList) {
        this.name = name;
        this.country = country;
        this.state = state;
        this.street = street;
        this.postcode = postcode;
        this.isActive = isActive;
        this.streetNo = streetNo;
        this.imageURL = imageURL;
        this.versionNo = versionNo;
        this.hotelierGroupId = hotelierGroupId;
        this.hotelierGroupName = hotelierGroupName;
        this.roomList = roomList;
        this.hotelAmenityList = hotelAmenityList;
        this.bookingList = bookingList;
    }

    public Hotel() {
    }

    public boolean checkSameHotel(Hotel hotelDTO){

        return this.name.equals(hotelDTO.getName())
                &&this.country.equals(hotelDTO.getCountry())
                &&this.state.equals(hotelDTO.getState())
                &&this.street.equals(hotelDTO.getStreet())
                &&this.postcode.equals(hotelDTO.getPostcode());
    }

    public boolean checkParam(){
        return HttpUtil.isNotEmpty(this.name)
                &&HttpUtil.isNotEmpty(this.country);
    }
}
