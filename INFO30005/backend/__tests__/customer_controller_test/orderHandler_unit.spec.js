const customerOrderHandlerController = require("../../controllers/customer/customerOrderHandlerController")

const mongoose = require("mongoose")
require("../../models/index")
const Snack = mongoose.model("Snack")
const Order = mongoose.model("Order")
const Van = mongoose.model("VanAuth")
const Customer = mongoose.model("Customer")
const VanRating = mongoose.model("VanRating")
const Counter = mongoose.model("Counter")

const sampleData = require("../../sampleData/sample_customer_order")


describe("customerOrderHandlerController", () => {

    beforeAll(()=>{
        Customer.findOne = jest.fn().mockReturnValue(sampleData.sampleCustomer);
        Van.findById = jest.fn().mockReturnValue(sampleData.sampleVan);
        Customer.findOneAndUpdate = jest.fn().mockReturnValue(sampleData.sampleCustomerAfter);
        Order.create = jest.fn().mockReturnValue(sampleData.sampleOrder);
        Snack.findById = jest.fn().mockReturnValue(sampleData.sampleSnack);
        Order.find = jest.fn().mockReturnValue(sampleData.sampleOrder);
        Order.findOneAndUpdate = jest.fn().mockReturnValue(sampleData.sampleOrder);
        JSON.parse = jest.fn().mockReturnValue(sampleData.sampleCustomer.cart);
        customerOrderHandlerController.calculateCost = jest.fn().mockReturnValue(15);
        customerOrderHandlerController.getCounter = jest.fn().mockReturnValue(1);
        Counter.findOne = jest.fn().mockReturnValue(sampleData.sampleOrderNumber);
        Counter.findOneAndUpdate = jest.fn().mockReturnValue(sampleData.sampleOrderNumber);
    })

    describe( "Testing create order funciton", () => {

        let res = {
            send : jest.fn(),
            status: jest.fn()
        }
    
        let req = {
            body: {},
            params: {},
            headers: {},
            query: {}
        }

        beforeAll(() => {
            // Mocking functions for create order
            
            req.body.orderedFrom = "60794927d0487604c4bf66fd";
            req.headers.login = "608a6e6b3f9afe001590b222";
            customerOrderHandlerController.createOrder(req, res);
        })
        
        test("Test case 1 : Testing create order with valid customer", () => {
            expect(res.send).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith(sampleData.sampleOrder)
        })
        
    })
   
    describe ( "Testing get order", () => {

        let res = {
            send : jest.fn(),
            status: jest.fn()
        }
    
        let req = {
            body: {},
            params: {},
            headers: {},
            query: {}
        }

        beforeAll(() => {
            // Mocking function for get order
            req.body = {}
            req.headers = {}
            req.query = {customerId : "608a6e6b3f9afe001590b222"}
            customerOrderHandlerController.getOrder(req, res);
        })

        test("Test case 1 : testing getting order with valid customer", () => {
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.send).toHaveBeenCalledWith(sampleData.sampleOrder);
        })
    })

    describe("Testing order cancellation", () => {

        let res = {
            send : jest.fn(),
            status: jest.fn()
        }
    
        let req = {
            body: {},
            params: {},
            headers: {},
            query: {}
        }

        beforeAll(()=>{
            req.body = {}
            req.headers = {}
            req.headers.login = "608a6e6b3f9afe001590b222";
            req.query = {orderId : "608964636190a4b2b70087ce"}
            sampleData.sampleOrder.status = "CANCELLED"
            customerOrderHandlerController.cancelOrder(req, res);
        })

        test(" Test case 1 : testing cancellation order status to be OK ", () => {
            expect(res.status).toHaveBeenCalledWith(200);
        })
        test(" Test case 2 : testing cancellation order to return appropriately ", () => {
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.send).toHaveBeenCalledWith(sampleData.sampleOrder._id);
        })
    })

    describe("Testing order overwrite", () => {

        let res = {
            send : jest.fn(),
            status: jest.fn()
        }
    
        let req = {
            body: {},
            params: {},
            headers: {},
            query: {}
        }

        beforeAll(()=>{
            req.body = {}
            req.headers = {}
            req.headers.login = "608a6e6b3f9afe001590b222";
            req.body = {orderId : "608964636190a4b2b70087ce"}
            customerOrderHandlerController.overwriteOrder(req, res);
        })

        test(" Test case 1 : testing overwriting order status to be OK", () => {
            expect(res.status).toHaveBeenCalledWith(200);

        })

        test(" Test case 2 : testing overwriting order to return appropriate order", () => {
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.send).toHaveBeenCalledWith(sampleData.sampleOrder);
        })

    })

    describe ( "Testing van rating ", () => {
        
        let res = {
            send : jest.fn(),
            status: jest.fn()
        }
    
        let req = {
            body: {},
            params: {},
            headers: {},
            query: {}
        }

        beforeAll(()=>{
            req.body = {}
            req.headers = {}
            req.headers.login = "608a6e6b3f9afe001590b222";
            req.body = {
                orderId : "608964636190a4b2b70087ce",
                rating : 5
                }
            VanRating.create = jest.fn().mockReturnValue({
                _id : "60a728a90399d40b2c3094d7",
                vanId : "60794927d0487604c4bf66fd",
                rating : 5
            })
            customerOrderHandlerController.rateVan(req, res);
        })

        test("Test case 1: testing van rating has correct status and returned object" , () => {
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.send).toHaveBeenCalledWith(sampleData.sampleRating);
            expect(res.status).toHaveBeenCalledWith(200);
        })
    })

    
})