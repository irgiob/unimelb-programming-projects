package utils.Enum;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public enum UserRole implements Serializable {
    CUSTOMER(1),
    HOTELIER(2),
    ADMIN(3);

    private final int roleLevel;

    private static final Map<Integer, UserRole> lookup = new HashMap<>();

    static {
        for (UserRole u : UserRole.values()) {
            lookup.put(u.getRoleLevel(), u);
        }
    }

     UserRole(int roleLevel) {
        this.roleLevel = roleLevel;
    }

    public int getRoleLevel() {
        return roleLevel;
    }

    public static UserRole getUserRole(int roleLevel) {
        return lookup.get(roleLevel);
    }
}
