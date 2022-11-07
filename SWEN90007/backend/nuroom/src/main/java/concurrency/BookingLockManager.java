package concurrency;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

public class BookingLockManager {
    private static BookingLockManager instance;

    /**
     * key: hotel Id
     * value: user id
     */
    private ConcurrentMap<Integer, Integer> lockMap;

    public static synchronized BookingLockManager getInstance() {
        if(instance == null) {
            instance = new BookingLockManager();
        }
        return instance;
    }

    private BookingLockManager() {
        lockMap = new ConcurrentHashMap<Integer, Integer>();
    }

    public synchronized void acquireWriteLock(Integer lockable, Integer owner) {
        while(lockMap.containsKey(lockable)) {
            try {
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        lockMap.put(lockable, owner);
    }

    public synchronized void releaseWriteLock(Integer lockable, Integer owner) {
        if(lockMap.get(lockable).equals(owner)){
            lockMap.remove(lockable);
            notifyAll();
        }
    }

}
