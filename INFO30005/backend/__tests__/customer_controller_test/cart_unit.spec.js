const mongoose = require("mongoose")
require("../../models/index")
const Customer = mongoose.model("Customer")
const cartController = require("../../controllers/customer/cartController")
const sampleData = require("../../sampleData/sample_customer_order")

describe ( "Cart controller " , () => {

    beforeAll(() => {
        Customer.findOne = jest.fn().mockReturnValue(sampleData.sampleCustomer);
        Customer.findOneAndUpdate = jest.fn().mockReturnValue(sampleData.sampleCustomerNewCart);
        JSON.parse = jest.fn().mockReturnValue(sampleData.sampleCustomerNewCart)
    })

    describe( "view cart", () => {
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
            req.query = {}
            req.headers.login = "608a6e6b3f9afe001590b222";
            cartController.viewCart(req, res);
        })

        test( "View cart", () => {
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.send).toHaveBeenCalledWith(sampleData.sampleCustomerNewCart.cart);
        })
    })
    
    describe( "add to cart", () => {
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
            req.body = {
                snackId : "6092705bada02d00157ae312",
                quantity : 4
            }
            req.query = {}
            req.headers.login = "608a6e6b3f9afe001590b222";
            cartController.addToCart(req, res);
        })

        test( "Add to cart", () => {
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.send).toHaveBeenCalledWith(sampleData.sampleCustomerNewCart.cart);
        })
    })


})
