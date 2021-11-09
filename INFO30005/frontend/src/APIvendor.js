import { useState, useEffect } from "react";
import axios from 'axios';

const BASE_URL_CUSTOMER = "https://webit-project-404inc-backend.herokuapp.com/customer/";
const BASE_URL_VENDOR = "https://webit-project-404inc-backend.herokuapp.com/vendor/";


// Set a van as being CLOSED - uses token stored in localstorage

export async function closeThisVan() {
    const endpoint = BASE_URL_VENDOR + `/setVendor/close`;
    const token = JSON.parse(localStorage.getItem('token'));

    try {
        let data = await axios({
            url: endpoint,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'login': token
            },
        }).then(res => res.data);

        if (data.error !== undefined) {
            alert(data.message);
        }
    }
    catch (e) {
        console.log(e.message);
    }
}

// Set a van as being READY - uses localstorage token

export async function markAsReady(orderID) {
    const endpoint = BASE_URL_VENDOR + `/orders/readyOrder`;
    const token = JSON.parse(localStorage.getItem('token'));

    try {
        let data = await axios({
            url: endpoint,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'login': token
            },
            data: JSON.stringify({
                orderId: orderID
            },
                { withCredentials: true } // IMPORTANT
            )
        }).then(res => res.data);

        if (data.error !== undefined) {
            alert(data.message);
        }
    }
    catch (e) {
        console.log(e.message);
    }
}

// Set an order as being COMPLETE

export async function markAsComplete(orderID) {
    const endpoint = BASE_URL_VENDOR + `/orders/completeOrder`;
    const token = JSON.parse(localStorage.getItem('token'));

    try {
        let data = await axios({
            url: endpoint,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'login': token
            },
            data: JSON.stringify({
                orderId: orderID
            },
                { withCredentials: true } // IMPORTANT
            )
        }).then(res => res.data);

        if (data.error !== undefined) {
            alert(data.message);
        }
    }
    catch (e) {
        console.log(e.message);
    }
}

// Get all the orders for a specific van using 'getOrders'

export function useVanOrders() {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        getOrders()
            .then(orders => {
                setOrders(orders);
                setLoading(false);
            })
            .catch(e => {
                console.log(e);
                setError(e);
                setLoading(false);
            });
    }, []);

    return {
        loading,
        orders,
        error
    };
}

// get all the orders for a van

export async function getOrders() {
    const token = JSON.parse(localStorage.getItem('token'));
    const endpoint = BASE_URL_VENDOR + `/orders`;

    return axios.get(endpoint, {
        headers: {
            "Content-Type": "application/json",
            'login': token
        }
    }).then(res => res.data);
}

// Set a van's status as being OPEN at a particular coordinates

export async function openForBusiness(description, geolocation) {
    const endpoint = BASE_URL_VENDOR + '/setVendor/setLocation';
    const token = JSON.parse(localStorage.getItem('token'));

    try {
        let data = await axios({
            url: endpoint,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'login': token
            },
            data: JSON.stringify({
                vendorId: token,
                locationDescription: description,
                geolocation: geolocation
            },
                { withCredentials: true } // IMPORTANT
            )
        }).then(res => res.data);

        if (data.error !== undefined) {
            alert(data.message);
            return false;
        }
    }
    catch (e) {
        console.log(e.message);
        return false;
    }
    return true;
}

// logins to the vendor side of the app

export async function loginVendor(user) {

    // vendor details, email and password
    const { vanName, password } = user;
    const endpoint = BASE_URL_VENDOR + `/auth/login/`;

    // POST the email and password to FoodBuddy API 
    let data = await axios({
        url: endpoint,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            vanName: vanName,
            password: password
        },
            { withCredentials: true } // IMPORTANT
        )
    }).then(res => res.data);

    if (data.error !== undefined) {
        alert("Something went wrong - " + data.message);
        return false;
    }
    else if (data.login === "Successful") {
        // This token represents a 'cookie' to the server
        localStorage.setItem('token', JSON.stringify(data.message._id));
        return true;
    }
    else {
        alert("No catch triggered");
        return false;
    }
}

// vendor registration

export async function registerVendor(user) {

    const { vanName, password } = user;
    const endpoint = BASE_URL_VENDOR + `/auth/register/`;

    // POST the email and password to FoodBuddy API 
    let data = await axios({
        url: endpoint,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            vanName: vanName,
            password: password
        },
            { withCredentials: true } // IMPORTANT
        )
    }).then(res => res.data);

    if (data.error !== undefined) {
        // database broke
        alert("Something went wrong - " + data.message);
        return false;
    }
    else if (data.register === "Sucessful") {
        console.log("ACCOUNT CREATED");
        localStorage.setItem('token', JSON.stringify(data.id));
        return true;
    }
    else {
        alert("No catch triggered");
        return false;
    }
}
