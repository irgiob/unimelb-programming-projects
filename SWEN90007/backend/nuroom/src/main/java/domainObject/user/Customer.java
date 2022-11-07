package domainObject.user;

import controllers.ViewObject.UserVO;
import domainObject.user.User;
import lombok.*;
import utils.Enum.UserRole;

import java.io.Serializable;
import java.text.ParseException;
import java.util.Date;

@Getter
@Setter
@ToString
public class Customer extends User implements Serializable {
    public Customer() {
        super();
    }

    public Customer(UserVO userVO) throws ParseException {
        super(userVO);
    }

    public Customer(Integer id, String firstName, String lastName, String email, String password, String phoneNumber, Date dateOfBirth, UserRole roleLevel) {
        super(id, firstName, lastName, email, password, phoneNumber, dateOfBirth, roleLevel);
    }

    public Customer(Integer id) {
        super(id);
    }

    public Customer(String firstName, String lastName, String email, String password, String phoneNumber, Date dateOfBirth, UserRole role) {
        super(firstName, lastName, email, password, phoneNumber, dateOfBirth, role);
    }

    public Customer(User user){
        super(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getPassword(), user.getPhoneNumber(), user.getDateOfBirth(),user.getRole());
    }
}
