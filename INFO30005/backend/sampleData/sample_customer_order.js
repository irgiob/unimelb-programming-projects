// Sample customer
const sampleCustomer = {
    _id :"608a6e6b3f9afe001590b222",
    firstName:"Sam",
    lastName:"McGrath",
    password: "$2b$12$OtSGncrE4DFYtzSFY8XUjebkrN.BeFjcsYmJSlb8i.M/Nc8cR.jMm",
    email: "blue@blue",
    cart:{
        "6092705bada02d00157ae398" : 5,
        },
    __v: 0
}

const sampleCustomerNewCart = {
    _id :"608a6e6b3f9afe001590b222",
    firstName:"Sam",
    lastName:"McGrath",
    password: "$2b$12$OtSGncrE4DFYtzSFY8XUjebkrN.BeFjcsYmJSlb8i.M/Nc8cR.jMm",
    email: "blue@blue",
    cart:{
        "6092705bada02d00157ae398" : 5,
        "6092705bada02d00157ae312" : 4
        },
    __v: 0
}

// Sample van/vendor
const sampleVan = {
    _id : "60794927d0487604c4bf66fd",
    geolocation :[-37.793293572078596,144.96846549597845],
    vendorName : "van2",
    locationDescription :"550 Lygon",
    status : "OPEN",
    __v : 0
}

// Customer after creating order
const sampleCustomerAfter ={
    _id :"608a6e6b3f9afe001590b222",
    firstName:"Sam",
    lastName:"McGrath",
    password: "$2b$12$OtSGncrE4DFYtzSFY8XUjebkrN.BeFjcsYmJSlb8i.M/Nc8cR.jMm",
    email: "blue@blue",
    cart:{},
    __v: 0
}

// Sample order
let sampleOrder = {
    _id: "608964636190a4b2b70087ce",
    orderStatus:"PENDING",
    orderTime: Date.now(),
    finishTime :null,
    orderedFrom:"60794927d0487604c4bf66fd",
    orderedBy:"608a6e6b3f9afe001590b222",
    snacks:{
        "6092705bada02d00157ae398" : 5,
    },
    totalCost: 15,
    orderNumber : 1,
    vanName: "foodVan",
    __v: 0
}

const sampleSnack = {
    _id: "6092705bada02d00157ae398",
    price : 3
}

const sampleRating = {
    _id : "60a728a90399d40b2c3094d7",
    vanId : "60794927d0487604c4bf66fd",
    rating : 5
}

// Sample order ready
let sampleOrderReady = {
    _id: "608964636190a4b2b70087ce",
    orderStatus:"READY",
    orderTime: "2021-05-21T08:21:36.057+00:00",
    finishTime :"2021-05-21T08:30:00.057+00:00",
    orderedFrom:"60794927d0487604c4bf66fd",
    orderedBy:"608a6e6b3f9afe001590b222",
    snacks:{
        "6092705bada02d00157ae398" : 5,
    },
    totalCost: 15,
    orderNumber : 1,
    vanName: "foodVan",
    __v: 0
}

// Sample order complete
let sampleOrderComplete = {
    _id: "608964636190a4b2b70087ce",
    orderStatus:"COMPLETE",
    orderTime: "2021-05-21T08:21:36.057+00:00",
    finishTime :"2021-05-21T08:30:00.057+00:00",
    orderedFrom:"60794927d0487604c4bf66fd",
    orderedBy:"608a6e6b3f9afe001590b222",
    snacks:{
        "6092705bada02d00157ae398" : 5,
    },
    orderNumber : 1,
    totalCost: 15,
    vanName: "foodVan",
    __v: 0
}

let sampleOrderNumber = {
    _id : "",
    name : "OrderCounter",
    count : 1
}

module.exports = {
    sampleCustomer,
    sampleCustomerAfter,
    sampleOrder,
    sampleRating,
    sampleSnack,
    sampleVan,
    sampleCustomerNewCart,
    sampleOrderReady,
    sampleOrderComplete,
    sampleOrderNumber
}