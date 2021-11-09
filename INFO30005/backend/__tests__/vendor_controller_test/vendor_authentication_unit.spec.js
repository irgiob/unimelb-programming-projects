const mongoose = require("mongoose")
require("../../models/index");
const sampleData = require("../../sampleData/sample_vendor")
const VanAuth = mongoose.model("VanAuth")
const vendorAuthController = require("../../controllers/vendor/vendorAuthController")
const bcrypt = require("bcrypt")

describe ( "vendorAuthController", () => {

    beforeAll( () => {
        VanAuth.create = jest.fn().mockReturnValue(sampleData.sampleVendor)
        bcrypt.genSalt = jest.fn().mockReturnValue("")
        bcrypt.hash = jest.fn().mockReturnValue(sampleData.sampleVendor.password)
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
                vanName : "foodVan",
                password : "123456789"
            },
            params: {},
            headers: {},
            query: {}
        }

        beforeAll(()=>{
            VanAuth.findOne = jest.fn().mockReturnValue(sampleData.sampleVendor)
            vendorAuthController.vanLogin(req,res);
        })

        test("Testing login with proper credentials", () => {
            expect(res.send).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith({
                login: "Successful",
                message: (({ _id, vendorName }) =>
                    ({ _id, vendorName }))(sampleData.sampleVendor)
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
                vanName : "foodVan2",
                password : "365123"
            },
            params: {},
            headers: {},
            query: {}
        }

        beforeAll(()=>{
            VanAuth.findOne = jest.fn().mockReturnValue(null)
            vendorAuthController.vanRegister(req,res);
        })

        test("Testing login with proper credentials", () => {
            expect(res.send).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith({
                id: "60a765a1877db642383cb6b7",
                register: "Sucessful"
            })
        })
    })
})