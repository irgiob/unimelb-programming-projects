package controllers.ViewObject;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HotelierToGroupVO {
    String email;
    Integer groupId;

    public HotelierToGroupVO() {
    }

    public HotelierToGroupVO(String email, Integer groupId) {
        this.email = email;
        this.groupId = groupId;
    }
}
