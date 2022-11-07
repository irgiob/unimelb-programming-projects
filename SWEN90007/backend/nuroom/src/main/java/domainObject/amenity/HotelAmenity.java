package domainObject.amenity;

import domainObject.amenity.Amenity;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class HotelAmenity extends Amenity {
    Integer hotelId;

    public HotelAmenity(Integer id, Integer hotelId) {
        super(id);
        this.hotelId = hotelId;
    }

    public HotelAmenity(Integer hotelId) {
        this.hotelId = hotelId;
    }

    public HotelAmenity() {
    }
}
