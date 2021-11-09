package automail;

import java.util.HashMap;

public class ServiceFeeLookup {
    private final HashMap<Integer, Double> serviceFeeLookupTable = new HashMap<>();

    /**
     * @param onFloor floor to find the service fee of
     * @return the service fee of that floor
     */
    public Double getServiceFee(int onFloor) {
        if (!serviceFeeLookupTable.containsKey(onFloor)) {
            updateServiceFeeLookupTable(onFloor, -1.0);
        }
        return serviceFeeLookupTable.get(onFloor);
    }

    /**
     * @param onFloor floor of the service fee to update
     * @param serviceFee the new service fee obtained from the modem
     */
    public void updateServiceFeeLookupTable(int onFloor, double serviceFee) {
        serviceFeeLookupTable.put(onFloor, serviceFee);
    }
}
