package utils;

import datasource.DataMapper;
import domainObject.DomainObject;
import org.junit.Assert;

import java.lang.reflect.InvocationTargetException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class UnitOfWork {
    private static ThreadLocal current = new ThreadLocal();

    private List<DomainObject> newObjects = new ArrayList<>();
    private List<DomainObject> dirtyObjects = new ArrayList<>();
    private List<DomainObject> deletedObjects = new ArrayList<>();

    public static void newCurrent() {
        setCurrent(new UnitOfWork());
    }

    public static void setCurrent(UnitOfWork uow) {
        current.set(uow);
    }

    public static UnitOfWork getCurrent() {
        return (UnitOfWork) current.get();
    }

    public void registerNew(DomainObject obj) {
        //Assert.assertNotNull("id is null",obj.getId());
        Assert.assertFalse("object is dirty", dirtyObjects.contains(obj));
        Assert.assertFalse("object is deleted",deletedObjects.contains(obj));
        Assert.assertFalse("object is new",newObjects.contains(obj));
        newObjects.add(obj);
    }

    public void registerDirty(DomainObject obj) {
        Assert.assertNotNull("id is null",obj.getId());

        Assert.assertFalse("object is deleted",deletedObjects.contains(obj));
        if (!dirtyObjects.contains(obj) && !newObjects.contains(obj)) {
            dirtyObjects.add(obj);
        }
    }

    public void registerDeleted(DomainObject obj) {
        Assert.assertNotNull("id is null",obj.getId());
        if (newObjects.remove(obj)) return;
        dirtyObjects.remove(obj);
        if (!deletedObjects.contains(obj)) {
            deletedObjects.add(obj);
        }
    }

    public void registerClean(DomainObject obj) {
        Assert.assertNotNull("id is null",obj.getId());
    }

    public void commit(Connection connection) {
        try{
            connection.setAutoCommit(false);
            for (DomainObject obj : newObjects) {
                DataMapper.getMapper(obj.getClass(),connection).insert(obj);
            }
            for (DomainObject obj : dirtyObjects) {
                DataMapper.getMapper(obj.getClass(),connection).update(obj);
            }
            for (DomainObject obj : deletedObjects) {
                DataMapper.getMapper(obj.getClass(),connection).delete(obj);
            }

            connection.commit();
//            JDBCUtils.Close(connection);

        }catch (SQLException throwable){
            JDBCUtils.Rollback(connection);
            throwable.printStackTrace();
        }
    }

    public Result<List<Result<Boolean>>> commitResult(Connection connection) {
        List<Result<Boolean>> resultList=new ArrayList<>();
        boolean result=true;

        try {
            connection.setAutoCommit(false);

            for (DomainObject obj : newObjects) {
                if(DataMapper.getMapper(obj.getClass(),connection).insert(obj)==0){
                    result=false;
                    resultList.add(new Result<>(false,400,Constants.INSERT_ERROR+obj.getClass().getName()));
                }
            }
            for (DomainObject obj : dirtyObjects) {
                if(!DataMapper.getMapper(obj.getClass(),connection).update(obj)){
                    result=false;
                    resultList.add(new Result<>(false,400,Constants.UPDATE_ERROR+obj.getClass().getName()));
                }
            }
            for (DomainObject obj : deletedObjects) {
                if(!DataMapper.getMapper(obj.getClass(),connection).delete(obj)){
                    result=false;
                    resultList.add(new Result<>(false,400,Constants.DELETE_ERROR+obj.getClass().getName()));
                }
            }
            connection.commit();
        } catch (SQLException throwables) {
            JDBCUtils.Rollback(connection);
            throwables.printStackTrace();
        }

        return result?
                new Result<>(resultList,200,Constants.SUCCESS):
                new Result<>(resultList,400,Constants.FAIL);
    }

}
