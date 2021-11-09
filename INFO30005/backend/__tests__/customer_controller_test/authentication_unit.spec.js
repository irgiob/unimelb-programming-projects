const mongoose = require("mongoose")
require("../../models/index");
const sampleData = require("../../sampleData/sample_customer_order")
const Customer = mongoose.model("Customer")
const customerAuthController = require("../../controllers/customer/customerAuthController")
const bcrypt = require("bcrypt")

describe ( "customerAuthController", () => {

    beforeAll( () => {
        Customer.create = jest.fn().mockReturnValue(sampleData.sampleCustomerAfter)
        bcrypt.genSalt = jest.fn().mockReturnValue("")
        bcrypt.hash = jest.fn().mockReturnValue(sampleData.sampleCustomer.password)
        bcrypt.compare = jest.fn().mockReturnValue(true)
    })

    describe("Login", () => {

        let res = {
            send : jest.fn(),
            status: jest.fn(),
            cookie: jest.fn()
        }
    
        let req = {
            body: {
                email : "blue@blue",
                password : "blue"
            },
            params: {},
            headers: {},
            query: {}
        }

        beforeAll(()=>{
            Customer.findOne = jest.fn().mockReturnValue(sampleData.sampleCustomer)
            customerAuthController.login(req,res);
        })

        test("Testing login with proper credentials", () => {
            expect(res.send).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith({
                login: "Successful",
                message: (({ _id, firstName, lastName, email, cart }) =>
                    ({ _id, firstName, lastName, email, cart }))(sampleData.sampleCustomer)
            })
        })
    })

    describe("Register", () => {

        let res = {
            send : jest.fn(),
            status: jest.fn(),
            cookie : jest.fn()
        }
    
        let req = {
            body: {
                email : "blue@blue",
                password : "blue"
            },
            params: {},
            headers: {},
            query: {}
        }

        beforeAll(()=>{
            Customer.findOne = jest.fn().mockReturnValue(null)
            customerAuthController.register(req,res);
        })

        test("Testing login with proper credentials", () => {
            expect(res.send).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith({
                id: "608a6e6b3f9afe001590b222",
                register: "Sucessful"
            })
        })
    })
})