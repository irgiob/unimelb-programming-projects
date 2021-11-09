const mongoose = require("mongoose")
require("../../models/index")
const VanAuth = mongoose.model("VanAuth")
const sampleData = require("../../sampleData/sample_vendor")
const vendorHandlerController = require("../../controllers/vendor/vendorHandlerController")

describe("Vendor Handler Controller", () => {

    beforeAll( () => {
        VanAuth.findOne = jest.fn().mockReturnValue(sampleData.sampleVendor);
    })

    describe("Set location", () => {
        let req = {
            headers : {
                login : sampleData.sampleVendor._id,
            },
            body: {
                locationDescription : "Near Melbourne Uni",
                geolocation : [1,1]
            }
         }
         let res = {
             send: jest.fn(),
             status: jest.fn()
         }
        beforeAll(()=>{
            VanAuth.findOneAndUpdate = jest.fn().mockReturnValue(sampleData.sampleVendor)
            vendorHandlerController.setLocation(req, res)
        })
        test("Setting location", () => {
            expect(res.send).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith(sampleData.sampleVendor)
        })
    })

    describe("Set location with empty geolocation and location description", () => {
        let req = {
            headers : {
                login : sampleData.sampleVendor._id,
            },
            body: {}
         }
         let res = {
             send: jest.fn(),
             status: jest.fn()
         }
        beforeAll(()=>{
            VanAuth.findOneAndUpdate = jest.fn().mockReturnValue(sampleData.sampleVendor)
            vendorHandlerController.setLocation(req, res)
        })
        test("Setting location", () => {
            expect(res.send).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.send).toHaveBeenCalledWith({
                error: "body-0002",
                message: "Missing geolocation or location description"
            })
        })
    })

    describe("Set location with missing login", () => {
        let req = {
            headers : {
            },
            body: {}
         }
         let res = {
             send: jest.fn(),
             status: jest.fn()
         }
        beforeAll(()=>{
            VanAuth.findOneAndUpdate = jest.fn().mockReturnValue(sampleData.sampleVendor)
            vendorHandlerController.setLocation(req, res)
        })
        test("Setting location", () => {
            expect(res.send).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(503)
            expect(res.send).toHaveBeenCalledWith({
                error: "auth-0003",
                message: "Please login before cancelling order"
            })
        })
    })


    describe("Close vendor", () => {
        let req = {
            headers : {
                login : sampleData.sampleVendor._id,
            },
            body: {
                
            }
         }
         let res = {
             send: jest.fn(),
             status: jest.fn()
         }
        beforeAll(()=>{
            VanAuth.findOneAndUpdate = jest.fn().mockReturnValue(sampleData.sampleVendorClosed)
            vendorHandlerController.closeVendor(req, res)
        })
        test("closing vendor", () => {
            expect(res.send).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith(sampleData.sampleVendorClosed)
        })
    })
})