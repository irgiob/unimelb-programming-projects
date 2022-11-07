package domainObject.user;

import domainObject.user.User;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import utils.Enum.UserRole;

import java.io.Serializable;
import java.util.Date;

@Getter
@Setter
@ToString
public class Admin extends User implements Serializable {
    public Admin() {
    }

    public Admin(Integer id, String firstName, String lastName, String email, String password, String phoneNumber, Date dateOfBirth, UserRole roleLevel) {
        super(id, firstName, lastName, email, password, phoneNumber, dateOfBirth, roleLevel);
    }
}
