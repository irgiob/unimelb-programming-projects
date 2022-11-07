package domainObject.user;

import controllers.ViewObject.UserVO;
import domainObject.user.User;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import utils.Enum.UserRole;

import java.io.Serializable;
import java.text.ParseException;
import java.util.Date;

@Getter
@Setter
@ToString
public class Hotelier extends User implements Serializable {
    public Hotelier(Integer id, String firstName, String lastName, String email, String password, String phoneNumber, Date dateOfBirth, UserRole role) {
        super(id, firstName, lastName, email, password, phoneNumber, dateOfBirth, role);
    }

    public Hotelier(Integer id) {
        super(id);
    }

    public Hotelier(String firstName, String lastName, String email, String password, String phoneNumber, Date dateOfBirth, UserRole role) {
        super(firstName, lastName, email, password, phoneNumber, dateOfBirth, role);
    }

    public Hotelier() {
    }

    public Hotelier(UserVO userVO) throws ParseException {
        super(userVO);
    }

}
