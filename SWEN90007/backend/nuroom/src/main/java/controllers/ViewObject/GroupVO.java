package controllers.ViewObject;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GroupVO {
    Integer userId;
    Integer groupId;

    public GroupVO() {
    }

    public GroupVO(Integer userId, Integer groupId) {
        this.userId = userId;
        this.groupId = groupId;
    }
}
