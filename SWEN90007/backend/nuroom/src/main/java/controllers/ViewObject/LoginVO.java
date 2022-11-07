package controllers.ViewObject;

import domainObject.user.User;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Getter
@Setter
@ToString
public class LoginVO extends UserVO implements Serializable {
    String token;

    public LoginVO(User user){
        super(user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPassword(),
                user.getPhoneNumber(),
                user.getDateOfBirth()==null?null:
                new java.sql.Date(user.getDateOfBirth().getTime()).toString(),
                user.getRole().getRoleLevel());
    }
}
