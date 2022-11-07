package datasource;

import domainObject.DomainObject;
import lombok.Getter;
import lombok.Setter;
import utils.JDBCUtils;

import java.sql.Connection;

@Getter
@Setter
public abstract class DataMapper {
    Connection connection;

    public DataMapper(Connection connection) {
        this.connection = connection;
    }

    public DataMapper(){}

    public abstract int insert(DomainObject obj);
    public abstract boolean update(DomainObject obj);
    public abstract boolean delete (DomainObject obj);
    public abstract DomainObject findById(int id);

    public static DataMapper getMapper(Class cls,Connection connection) {
        DataMapper mapper;
        String className = "datasource." + cls.getSimpleName() + "Mapper";
        System.out.println(cls.getName());
        System.out.println(className);

        try {
            Class mapperClass = Class.forName(className);
            mapper = (DataMapper) mapperClass.getConstructor().newInstance();
            mapper.setConnection(connection);
        } catch (Exception e) {
            mapper = null;
        }

        return mapper;
    }
}
