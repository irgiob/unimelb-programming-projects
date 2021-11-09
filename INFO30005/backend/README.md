**INFO30005 Web Information Technologies**

**404 Incorporated's**
# Snacks in a Van Web App - Backend Server

This is the project repository for 404 Inc.'s (T18 Group 2) implementation of the Snacks in a Van Web App.

> Note: for marking delivarable 4, please skip straight away to the **backend** section by clicking on it in the table of contents. Or, simply [click here](#backend). If you are looking for information about the frontend web app, please visit the frontend repository [here](https://github.com/INFO30005-2021-SM1/project-frontend-t18-404-inc) or skip to the **frontend** section of the README [here.](#frontend)

<br/>

## Running locally
To run the server locally, please create a .env file with the following variables

```
PORT=3000 
MONGO_USERNAME=root
MONGO_PASSWORD=1234
Connection String: mongodb+srv://$root:$1234@cluster0.pwynp.mongodb.net/$app?retryWrites=true&w=majority
```

In your prefered terminal, run: 
```
npm start
```
<br/>

## Testing

In order to run unit and integration testing, run:
```
npm test
```

<br/>
<hr/>

## Table of contents
* [General Info](#general-info)
* [Project Deliverables](#project-deliverables)
* [Technologies](#technologies)
* [Frontend](#frontend)
* [Backend](#backend)
* [Developer Notes](#for-developers)

<br/>

## General info
---

This project builds a fully functioning Web App for the startup company Snacks in a Van. The company runs a fleet of food trucks that act as popup cafes. The app has two main users with a different set of use case:
* Customers
  * Find vans relative to their location
  * View the menu of available snacks
  * Place orders at vans (that can be modified)
  * Track the status of all ongoing and past orders
  * General account creation and management features
* Vendors
  * Set the location of their van and mark
  * Mark themselves as open or closed for customers
  * Track orders made by customers
  * Update those orders accordingly

Based on the business requirements specificed, the following App Diagram below was made to model the pages and interactions of the user:

![App Diagram](readme_files/app_diagram.png)

[*Table of Contents*](#table-of-contents)

<br/>

## Project Deliverables
---
|      Task      | Leading Members |    Status   |
| :------------: | :-------------: | :---------: |
| UI Design      | Fiona & Vishesh | Complete    |
| Web Server V1  | Wilbert & Irgio | Complete    |
| Front End V1   | Sam & Fiona     | Complete    |
| Full Web App   | All Members     | In Progress |
| Project Report | All Members     | In Progress |

[*Table of Contents*](#table-of-contents)

<br/>

## Technologies
---
This project is (currently) created with:
* NodeJs 14.16.X
* Express 4.17.1
* Mongoose 5.12.3
* Multer 1.4.2
* Body Parser 1.19.0
* dotenv 8.2.0
* bcrypt 5.0.1
* cookie-parser 1.4.5
* cors 2.8.5
* sharp 0.28.1

Testing dependencies:
* Jest 26.6.3
* Supertest 6.1.3

[*Table of Contents*](#table-of-contents)

<br/>

## Frontend
---
Our website is now live! Check it out at
https://snacks-in-a-van-404inc.herokuapp.com/. For more information about the frontend, including sample login credentials and a list of all the pages, please visit the frontend repository by clicking [here.](https://github.com/INFO30005-2021-SM1/project-frontend-t18-404-inc)

[*Table of Contents*](#table-of-contents)

<br/>

## Backend
---
The backend runs the server that interacts with the MongoDB database and handles all data upload and retrieval. The Web Server is hosted on Heroku and can be found [here.](https://webit-project-404inc-backend.herokuapp.com/) Continue reading for documentation of all the endpoints and how to access them.

[*Table of Contents*](#table-of-contents)

<br/>

## *Endpoints*

Customer Features:
* **View menu of snacks**

  GET https://webit-project-404inc-backend.herokuapp.com/customer/menu/

* **View details of a snack**

  GET https://webit-project-404inc-backend.herokuapp.com/customer/menu/:snackId, where :snackId is replaced with the ID of a specific snack (the snackIds can be obtained by getting the entire menu using the previous endpoint)

* **Register a new account**

  POST https://webit-project-404inc-backend.herokuapp.com/customer/auth/register/

  Body:
  * firstName: the first name of the customer who is registering e.g. Bob
  * lastName: the last name of the customer who is registering e.g. Smith
  * email: the email address to be associated with the account e.g. bob.smith@example.com
  * password: the password for the account, this will be stored with encryption on the db

* **Login to customer account**

  POST https://webit-project-404inc-backend.herokuapp.com/customer/auth/login/

  Body:
  * email: the email address associated with the account e.g. bob.smith@example.com
  * password: the password for the account

* **Update customer account**

  POST https://webit-project-404inc-backend.herokuapp.com/customer/auth/update/

  Body: (At least one needs to be filled)
  * newPassword: new password to be change
  * newFirstName : new first name
  * newLastName : new last name


* **View customer cart**

  GET https://webit-project-404inc-backend.herokuapp.com/customer/cart/

* **Add a snack to the cart**

  POST https://webit-project-404inc-backend.herokuapp.com/customer/addToCart/

  Body:
  * snackId: the ID of the snack to be added to the customer's cart (the snackIds can be obtained by getting the entire menu at endpoint /customer/menu)
  * quantity: the quantity of the snack to be added to the cart

* **Create new order**

  POST https://webit-project-404inc-backend.herokuapp.com/customer/order/createOrder
  
  Body: 
  * orderFrom: the vendorId of the OPEN van the order was made from e.g 60794927d0487604c4bf66fd (the vendorId can be obtained by getting the list of all vans at endpoint /vendor)

* **Get customer orders**
  POST https://webit-project-404inc-backend.herokuapp.com/customer/order/getOrder?customerId={customerID}
  Body:
  * orderedBy : customerID (eg. 6089641d6190a4b2b70087cd) 

* **Cancelling order**
  POST https://webit-project-404inc-backend.herokuapp.com/customer/order/cancelOrder
  Body:
  * orderId : order object id (e.g 6092a62e0b631d00154a5afb)

* **Updating snacks order**
  POST https://webit-project-404inc-backend.herokuapp.com/customer/order/updateOrder
  Body:
  * orderId : order object id (e.g 6092a62e0b631d00154a5afb)
  * updateSnack : JSON object as string , map of snackId:quantity

* **Rate the van**
  POST https://webit-project-404inc-backend.herokuapp.com/customer/order/rateVan
  Body:
  * vanId : van object id (e.g 60794927d0487604c4bf66fd)
  * rating : rating for the van ( 1 to 5 inclusive)
  * message : string of message for the rating(OPTIONAL)

Vendor Features:

*All of these features requires vendor to login*

* **Set van status**

  POST https://webit-project-404inc-backend.herokuapp.com/vendor/setVendor/setLocation

  Body:
  * locationDescription: description of the location of the van inputted by the vendor
  * geolocation: the actual physical coordinates of the van (in an array of longitude and latitude)

  *Note: this endpoint will also automatically set the van to be open, so it can be used for initialy opening the van for the day as well as updating the location throughout the day*

  POST https://webit-project-404inc-backend.herokuapp.com/vendor/setVendor/close


* **Show all outstanding orders**

  GET https://webit-project-404inc-backend.herokuapp.com/vendor/orders?status={status}

  This endpoint uses the request queries to search for orders for a specific van or of a specific status. Both query parameters are optional, so including neither of them (just using the endpoint /vendor/orders) will return all orders across all vendors. vendorId is the ID of a specific van, while status is a string. Currently impemented status are PENDING, COMPLETE and READY.

  For example, to find all the outstanding orders from the vendor with vendorId 60794927d0487604c4bf66fd, you would make the GET request https://webit-project-404inc-backend.herokuapp.com/vendor/orders?status=PENDING

* **Mark order as ready**

  POST https://webit-project-404inc-backend.herokuapp.com/vendor/orders/readyOrder

  Body:
  * orderId: the ID of the specific order to set as READY (the orderId can be obtained using the previous endpoint) 

* **Mark order as complete**

  POST https://webit-project-404inc-backend.herokuapp.com/vendor/orders/completeOrder

  Body:
  * orderId: the ID of the specific order to set as COMPLETE (the orderId can be obtained using the previous endpoint) 



* **Register a new account - vendor**

  POST https://webit-project-404inc-backend.herokuapp.com/vendor/auth/register/

  Body:
  * vanName: the name of the van the vendor use to register
  * password: the password for the account, this will be stored with encryption on the db

* **Login to customer account - vendor**

  POST https://webit-project-404inc-backend.herokuapp.com/vendor/auth/login/

  Body:
  * vanName: the name of the van the vendor use to register
  * password: the password for the account, this will be stored with encryption on the db


### *Other Endpoints Available*

* **Get all vans**

  GET https://webit-project-404inc-backend.herokuapp.com/vendor/

* **Get a specific van**

  GET https://webit-project-404inc-backend.herokuapp.com/vendor/:vendorId, where :vendorId is replace with the ID of a specific vendor (vendorId can be obtained by getting all vendors using the previous endpoint)

* **Get a specific van's rating**

  GET https://webit-project-404inc-backend.herokuapp.com/vendor/ratings/:vendorId, where :vendorId is replace with the ID of a specific vendor (vendorId can be obtained by getting all vendors using the previous endpoint)


* **Create a new van**

  POST https://webit-project-404inc-backend.herokuapp.com/vendor/setVendor/create

  Body: 
  * vendorName: the name of the new van to be created

* **Upload snacks**

  GET https://webit-project-404inc-backend.herokuapp.com/uploadSnack to open a HTML form to create a new snack in the MongoDB databases. Existing snacks are displayed under the form as well.
  
  Submitting the form will create a POST request to the same URL that submits the form data to the server to create a new snack.
  
  *Note: This page is returned in HTML and not JSON to handle the viewing of images*

[*Table of Contents*](#table-of-contents)

<br/>


## For developers

These are the object format and error codes that will be returned by the server

### Format

<hr> 

```
{
  error : <ERROR CODE>,
  message : <MESSAGE>
}
```

### Error codes

<hr>

#### Database
* db-0001 : cannot find data in database
* db-0002 : cannot create document
* db-0003 : cannot find or update document


#### Request:
* body-0001 : body does not exist
*	body-0002 : invalid field

#### Order:
*	order-0001 : van is closed
*	order-0002 : van doesn't exist
*	order-0003 : order to be updated does not exists

#### Images:
*	img-0001 : uploading image failed

#### Login & Registration:
*	reg-0001: email /vanName used, registration failed 
*	auth-0001: Wrong password
*	auth-0002: Internal error in encrypting/decrypting
*	auth-0003: Not yet logged in
*	auth-0004: Invalid cookie

#### Others:
* json-0001 : fail to parse

[*Table of Contents*](#table-of-contents)

<br/>