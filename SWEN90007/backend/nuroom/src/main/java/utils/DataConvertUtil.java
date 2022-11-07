package utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DataConvertUtil {

    public static Integer stringConvertInteger(String value) {
        return value != null && !"".equals(value) ? Integer.valueOf(value) : 0;
    }

    public static Float stringConvertFloat(String value) {
        return value != null && !"".equals(value) ? Float.valueOf(value) : 0;
    }

    public static Boolean stringConvertBoolean(String value) {
        return value != null && !"".equals(value) ? Boolean.valueOf(value) : true;
    }

    public static Date stringConvertUtilDate(String value) throws ParseException {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        return HttpUtil.isNotEmpty(value)?format.parse(value):null;
    }

    public static java.sql.Date stringConvertSqlDate(String value) throws ParseException {
        return  HttpUtil.isNotEmpty(value)?java.sql.Date.valueOf(value):null;
    }


}