import { useState, useEffect } from "react";
import axios from 'axios';

const BASE_URL_CUSTOMER = "https://webit-project-404inc-backend.herokuapp.com/customer";
const BASE_URL_VENDOR = "https://webit-project-404inc-backend.herokuapp.com/vendor";

// Retrieve the rating out of 5 for a particular van

export async function getRating(vanID) {
    const token = JSON.parse(localStorage.getItem('token'));
    const endpoint = BASE_URL_VENDOR + `/ratings/` + vanID;

    return axios.get(endpoint, {
        headers: {
            "Content-Type": "application/json",
            'login': token
        }
    }).then(res => res.data);
}

// Send a rating about a van to the server

export async function rateAVan(vanID, rating, ratingMessage) {
    const endpoint = BASE_URL_CUSTOMER + `/order/rateVan`;
    const token = JSON.parse(localStorage.getItem('token'));

    // now we submit the request to have this order saved
    try {
        let data = await axios({
            url: endpoint,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'login': token
            },
            data: JSON.stringify({
                vanId: vanID,
                rating: rating,
                message: ratingMessage
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

// The server maintains a record of the user's cart, this lets you add one item type at a time

async function addToCart(_id, quantity) {
    const endpoint = BASE_URL_CUSTOMER + '/addToCart';
    const token = JSON.parse(localStorage.getItem('token'));

    // POST the email and password to FoodBuddy API 
    let data = await axios({
        url: endpoint,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'login': token
        },
        data: JSON.stringify({
            snackId: _id,
            quantity: quantity
        },
            { withCredentials: true } // IMPORTANT
        )
    }).then(res => res.data);
}

// Send an order to the server by reconstructing the now confirmed cart in the server side (using addToCart)
// where cart is an array of objects with {_id, quantity, name, ppi(price per item)}

export async function sendOrder(cart, van_id) {
    const endpoint = BASE_URL_CUSTOMER + `/order/createOrder`;
    const token = JSON.parse(localStorage.getItem('token'));

    // We have to build the cart in the server before confirming the order
    for (var i = 0; i < cart.length; i++) {
        await addToCart(cart[i]._id, cart[i].quantity);
    }

    // now we submit the request to have this order saved
    try {
        let data = await axios({
            url: endpoint,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'login': token
            },
            data: JSON.stringify({
                orderedFrom: van_id
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

// Get all the orders a customer has ever ordered

export async function getOrders() {
    const token = JSON.parse(localStorage.getItem('token'));
    const endpoint = BASE_URL_CUSTOMER + `/order/getOrder?customerId=` + token;

    // POST the email and password to FoodBuddy API 
    let data = await axios({
        url: endpoint,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'login': token
        },
        data: JSON.stringify({
            orderedBy: token
        },
            { withCredentials: true } // IMPORTANT
        )
    }).then(res => res.data);
    console.log(data);
    return data;
}

// Uses getOrders to return the customer's orders (or loading or an error)

export function useOrders() {
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

// Gets a list of all vans for use in the map

export function getAllVans() {
    const endpoint = BASE_URL_VENDOR;
    return axios.get(endpoint).then(res => res.data);
}

// get one food's details (via it's id)

function getFood(id) {
    const endpoint = BASE_URL_CUSTOMER + `/menu/` + id;
    return axios.get(endpoint).then(res => res.data);
}

// get all foods/drinks which are in the menu

function getFoods() {
    const endpoint = BASE_URL_CUSTOMER + `/menu`;
    return axios.get(endpoint).then(res => res.data);
}

// Uses getFoods to gracefully load the menu

export function useFoods() {
    const [loading, setLoading] = useState(true);
    const [foods, setFoods] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        getFoods()
            .then(foods => {
                setFoods(foods);
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
        foods,
        error
    };
}

// Uses getFood to gracefully load that one food

export function useOneFood(id) {
    const [loading, setLoading] = useState(true);
    const [food, setFood] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        getFood(id)
            .then(food => {
                setFood(food);
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
        food,
        error
    };
}

// handling user login

export async function loginUser(user) {

    // unpack user details, email and password
    const { email, password } = user;
    const endpoint = BASE_URL_CUSTOMER + `/auth/login/`;

    // POST the email and password API
    let data = await axios({
        url: endpoint,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            email: email,
            password: password
        },
            { withCredentials: true } // IMPORTANT
        )
    }).then(res => res.data);

    console.log("login", data);

    // Handle known error codes
    if (data.error === "db-0001") {
        alert("There is no user for this email address, please register a new account");
        return false;
    }
    else if (data.error === "auth-0002") {
        alert(data.message);
        return false;
    }
    else if (data.login === "Failed") {
        alert(data.message);
        return false;
    }
    else if (data.login === "Successful") {
        // The 'token' represents a cookie with the server 
        localStorage.setItem('token', JSON.stringify(data.message._id));
        return data.message;
    }
    else {
        alert("No catch triggered");
        return false;
    }
}

// component for handling user registration

export async function registerUser(user) {

    const {
        email,
        password,
        firstName,
        lastName
    } = user
    const endpoint = BASE_URL_CUSTOMER + `/auth/register/`;

    // POST the email and password to the API 
    let data = await axios({
        url: endpoint,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        },
            { withCredentials: true } // IMPORTANT
        )
    }).then(res => res.data);

    console.log("register", data);

    // known error codes
    if (data.error === "db-0001") {
        // database broke
        alert(data.message);
        return false;
    }
    else if (data.error === "reg-0001") {
        // email already in database
        alert(data.message);
        return false;
    }
    else if (data.error === "auth-0002") {
        // error encrypting password
        alert(data.message);
        return false;
    }
    else if (data.error === "db-0002") {
        // error creating customer object in db
        alert(data.message);
        return false;
    }
    else if (data.register === "Sucessful") {
        console.log("ACCOUNT CREATED");
        localStorage.setItem('token', JSON.stringify(data._id));
        return true;
    }
    else {
        alert("No catch triggered");
        return false;
    }
}

// component for updating user account detaills

export async function updateUser(user) {
    const endpoint = BASE_URL_CUSTOMER + `/auth/update/`;
    const token = JSON.parse(localStorage.getItem('token'));

    const body = {};
    if (user.newFirstName)
        body.newFirstName = user.newFirstName
    if (user.newLastName)
        body.newLastName = user.newLastName
    if (user.newPassword)
        body.newPassword = user.newPassword

    // POST the updates
    let data = await axios({
        url: endpoint,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "login": token
        },
        data: JSON.stringify(body,
            { withCredentials: true } // IMPORTANT
        )
    }).then(res => res.data);

    console.log("update", data);

    if (data.error === "db-0001") {
        // database broke
        alert(data.message);
        return false;
    }
    else if (data.error === "reg-0001") {
        // email already in database
        alert(data.message);
        return false;
    }
    else if (data.error === "auth-0002") {
        // error encrypting password
        alert(data.message);
        return false;
    }
    else if (data.error === "db-0002") {
        // error creating customer object in db
        alert(data.message);
        return false;
    }
    else if ('_id' in data) {
        console.log("ACCOUNT UPDATED");
        localStorage.setItem('token', JSON.stringify(data._id));
        return data;
    }
    else {
        alert("No catch triggered");
        return false;
    }
}

// Cancel an order via the order id

export async function cancelOrder(orderID) {
    const endpoint = BASE_URL_CUSTOMER + `/order/cancelOrder`;
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
        console.log("cancelOrder returned: ", data);

        if (data.error !== undefined) {
            alert(data.message);
        }
    }
    catch (e) {
        console.log(e.message);
    }
}

// Edit order via the id and a new list of snacks

export async function overwriteOrder(orderID, snacks) {
    const endpoint = BASE_URL_CUSTOMER + `/order/updateOrder`;
    const token = JSON.parse(localStorage.getItem('token'));

    // now we submit the request to have this order saved
    try {
        let data = await axios({
            url: endpoint,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'login': token
            },
            data: JSON.stringify({
                orderId: orderID,
                updateSnack: snacks
            },
                { withCredentials: true } // IMPORTANT
            )
        }).then(res => res.data);
        console.log("overwriteOrder returned: ", data);

        if (data.error !== undefined) {
            alert(data.message);
        }
        return data;
    }
    catch (e) {
        console.log(e.message);
        return;
    }
}