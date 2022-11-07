package domainObject;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class DomainObject {
    protected Integer id;

    public DomainObject(Integer id) {
        this.id = id;
    }

    public DomainObject() {
    }
}
