package utils;

import java.util.Arrays;
import java.util.List;

public class Constants {

// /**
//  * connection info for test DB
//  */
// public static String URL="jdbc:postgresql://47.95.10.24:5432/newtest";
// public static String USERNAME="postgres";
// public static String PASSWORD="^YHN6yhn";

 /**
  * connection info for heroku DB
  */
 public static String URL="jdbc:postgresql://ec2-3-225-110-188.compute-1.amazonaws.com:5432/dcsschjvath5en";
 public static String USERNAME="knbldctxmtjvje";
 public static String PASSWORD="3dd8cf110d0ae5d995743958b200ebaa089df67e02cdfd2ffc623960008a7118";

 /**
  * token error return
  */
 public static final String VALID_ERROR = "{\"errCode\": \"6000\",\"errMessage\": \"TOKEN VERIFICATION FAIL\"}";

 /**
  * system exception error return
  */
 public static final String SYS_ERROR = "{\"errCode\": \"7000\",\"errMessage\": \"SYSTEM EXCEPTION ERROR\"}";

 /**
  * whitelist
  */
 public static final List<String> whiteList= Arrays.asList(
         "login",
         "CustomerSignUp",
         "SearchAccommodation");

 /**
  * admin list
  */
 public static final List<String> adminList=Arrays.asList(
         "ViewAllUsers",
         "AddHotelierToGroup",
         "CreateHotelierGroup",
         "OnboardHotelier",
         "RemoveHotel",
         "RemoveHotelierFromGroup",
         "ViewAllBookedStays",
         "ViewAllHotels",
         "ViewAllHotelierGroup");

 /**
  * hotelier list
  */
 public static final List<String> hotelierList=Arrays.asList(
         "CreateHotel",
         "CreateRoom",
         "ModifyHotel",
         "ViewHotelierHotels",
         "ViewHotelRooms",
         "ViewHotelierGroup",
         "CancelBooking",
         "ModifyBookings",
         "ViewBookings",
         "SearchAvailableNum");

 /**
  * customer list
  */
 public static final List<String> customerList=Arrays.asList(
         "BookHotel",
         "CustomerSignUp",
         "CancelBooking",
         "ModifyBookings",
         "ViewBookings",
         "SearchAvailableNum");

 /**
  * user list
  */
 public static final List<String> userList=Arrays.asList(
         "CancelBooking",
         "ModifyBookings",
         "ViewBookings");

 public static final String SUCCESS="success";
 public static final String FAIL="fail";
 public static final String INSERT_ERROR="insert error: ";
 public static final String UPDATE_ERROR="update error: ";
 public static final String DELETE_ERROR="delete error: ";

 /**
  * admin service error code
  */
 public static final String ADMIN_CODE1100_ERROR="addHotelierToGroup_error";
 public static final String ADMIN_CODE1200_ERROR="createHotelierGroup_error";
 public static final String ADMIN_CODE1300_ERROR="onboardHotelier_error";
 public static final String ADMIN_CODE1400_ERROR="removeHotel_error";
 public static final String ADMIN_CODE1500_ERROR="removeHotelierFromGroup_error";

 /**
  * hotelier service error code
  */
 public static final String HOTELIER_CODE2100_ERROR="createHotel_error";
 public static final String HOTELIER_CODE2200_ERROR="createRoom_error";
 public static final String HOTELIER_CODE2300_ERROR="modifyHotel_error";
 public static final String HOTELIER_CODE2400_ERROR="modifyRoom_error";
 public static final String HOTELIER_CODE2500_ERROR="viewHotelierHotels_error";
 public static final String HOTELIER_CODE2600_ERROR="viewHotelRoom_error";

 /**
  * customer service error code
  */
 public static final String CUSTOMER_CODE3100_ERROR="customerSignUp_error";
 public static final String CUSTOMER_CODE3200_ERROR="bookHotel_error";
 public static final String CUSTOMER_CODE3300_ERROR="searchValidRoom_error";

 /**
  * user service error code
  */
 public static final String USER_CODE4100_ERROR="modifyBookings_error";
 public static final String USER_CODE4200_ERROR="viewBookings_error";
 public static final String USER_CODE4300_ERROR="CancelBooking_error";
 public static final String USER_CODE4400_ERROR="UserLogin_error";
}
