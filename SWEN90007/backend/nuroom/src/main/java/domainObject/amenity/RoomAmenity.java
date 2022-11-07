package domainObject.amenity;

import domainObject.amenity.Amenity;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RoomAmenity extends Amenity {
    Integer roomId;

    public RoomAmenity(Integer id, Integer roomId) {
        super(id);
        this.roomId = roomId;
    }

    public RoomAmenity(Integer roomId) {
        this.roomId = roomId;
    }

    public RoomAmenity() {
    }
}
