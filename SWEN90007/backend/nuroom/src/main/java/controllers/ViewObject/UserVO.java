package controllers.ViewObject;

import domainObject.user.User;
import lombok.*;

import java.sql.Date;

@Getter
@Setter
@ToString
public class UserVO {
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;
    private String dateOfBirth;
    private Integer roleLevel;

    public UserVO() {
    }

    public UserVO(Integer id, String firstName, String lastName, String email, String password, String phoneNumber, String dateOfBirth, Integer roleLevel) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
        this.roleLevel = roleLevel;
    }

    public UserVO(User user){
        this.id=user.getId();
        this.firstName=user.getFirstName();
        this.lastName=user.getLastName();
        this.email=user.getEmail();
        this.password=null;
        this.phoneNumber=user.getPhoneNumber();
        this.dateOfBirth=user.getDateOfBirth()==null?null:
                new Date(user.getDateOfBirth().getTime()).toString();
        this.roleLevel=user.getRole().getRoleLevel();
    }
}
