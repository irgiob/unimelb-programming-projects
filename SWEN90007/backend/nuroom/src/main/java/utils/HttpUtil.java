package utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import domainObject.user.User;
import utils.Enum.UserRole;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

public class HttpUtil {
    private static final String MY_SECRET_KEY= "Nuroom_xiang_hernan_marvin_gio";

    public static String encryptPassword(String password){
        return JWT.create()
                .withClaim("password", password)
                .sign(Algorithm.HMAC256(MY_SECRET_KEY));
    }

    public static String stringifyJSON(HttpServletRequest request){
        StringBuilder jb = new StringBuilder();
        String line;
        try {
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null)
                jb.append(line);
        } catch (Exception e) {
            System.out.println("Stringify request json error");
        }

        return jb.toString();
    }

    public static String getToken(User user){
//        Date expireDate = new Date(System.currentTimeMillis() + EXPIRATION * 1000);

        return JWT.create()
                .withClaim("id", user.getId())
                .withClaim("email", user.getEmail())
                .withClaim("roleLevel", user.getRole().getRoleLevel())
//                .withExpiresAt(new Date())
                .sign(Algorithm.HMAC256(MY_SECRET_KEY));
    }

    public static Map<String, Claim> verifyToken(String token){
        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(MY_SECRET_KEY)).build();
        DecodedJWT jwt = verifier.verify(token);
        return jwt.getClaims();
    }

    public static void httpResponse(HttpServletResponse response, Result result) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String resultJSON = mapper.writeValueAsString(result);

        PrintWriter out=response.getWriter();
        out.write(resultJSON);
        out.flush();
        out.close();
        //JDBCUtils.CloseConnection();
    }

    public static User tokenUser(HttpServletRequest request){
        String token=request.getHeader("Authorization");
        Map<String, Claim> claims = verifyToken(token.substring(7));
        Integer roleLevel=claims.get("roleLevel").asInt();
        Integer id=claims.get("id").asInt();

        User user=new User();
        user.setId(id);
        user.setRole(UserRole.getUserRole(roleLevel));
        return user;
    }

    public static boolean isNotEmpty(String s) {
        return s!=null&&s.length() > 0;
    }
}
