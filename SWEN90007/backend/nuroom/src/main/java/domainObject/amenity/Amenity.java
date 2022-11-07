package domainObject.amenity;

import domainObject.DomainObject;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Getter
@Setter
@ToString
public abstract class Amenity extends DomainObject implements Serializable {
    String name;
    String description;
    String imageUrl;

    public Amenity(Integer id) {
        super(id);
    }

    public Amenity() {
    }
}
