package security;

import com.auth0.jwt.interfaces.Claim;
import utils.Constants;
import utils.HttpUtil;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import static utils.Enum.UserRole.*;

@WebFilter(filterName = "SecurityFilter", urlPatterns = {"/*"})
//@Order(value = 1)
//@Configuration         Same with configuration in web.xml
public class SecurityFilter implements Filter {
    private List<String> whiteList;
    private List<String> adminList;
    private List<String> hotelierList;
    private List<String> customerList;
    @Override
    public void init(FilterConfig filterConfig) {
        whiteList=Constants.whiteList;
        adminList=Constants.adminList;
        hotelierList=Constants.hotelierList;
        customerList=Constants.customerList;
//        hotelierList.addAll(Constants.userList);
//        customerList.addAll(Constants.userList);
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)throws IOException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        request.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "*");
        response.addHeader("Access-Control-Allow-Headers", "*");
        response.addHeader("Access-Control-Allow-Credentials", "true");
        response.addHeader("Access-Control-Request-Headers", "*");
        response.setHeader("Access-Control-Max-Age", "3600");

        StringBuffer url=request.getRequestURL();
        String token=request.getHeader("Authorization");
        System.out.println(url.toString());

        try{
            //1. check whitelist
            if (!listContainsString(url.toString(),this.whiteList)) {
                //2. check token and permission
                if (!validateParams(token,url.toString())) {
                    response.getWriter().write(Constants.VALID_ERROR);
                    return;
                }
            }

            filterChain.doFilter(request, response);

        } catch (Exception e){
            e.printStackTrace();
            response.getWriter().write(Constants.SYS_ERROR);
        }
    }

    @Override
    public void destroy() {
        System.out.println("destroyed");
    }

    private boolean validateParams(String token, String url) {
        // check token isEmpty and format
        if (token==null || token.equals("") || !token.startsWith("Bearer ")){
            return false;
        }

        Map<String, Claim> claims = HttpUtil.verifyToken(token.substring(7)); //verify token with jwt

        if (claims == null){ return false; }

        Integer roleLevel=claims.get("roleLevel").asInt();

        if (roleLevel== ADMIN.getRoleLevel() && !listContainsString(url,this.adminList)){
            return false;
        }
        if(roleLevel== HOTELIER.getRoleLevel() && !listContainsString(url,this.hotelierList)){
            return false;
        }
        if(roleLevel== CUSTOMER.getRoleLevel() && !listContainsString(url,this.customerList)){
            return false;
        }

        return true; // token invalid->false
    }

    private boolean listContainsString(String url, List<String>list){
        for (String v: list)
            if (url.contains(v)){
                return true;
            }
        return false;
    }
}

