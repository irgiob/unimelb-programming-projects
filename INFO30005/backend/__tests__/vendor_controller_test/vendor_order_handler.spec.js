const mongoose = require("mongoose")
require("../../models/index");
const sampleData = require("../../sampleData/sample_vendor")
const sampleData2 = require("../../sampleData/sample_customer_order")
const Order = mongoose.model("Order")
const VanAuth = mongoose.model("VanAuth")
const vendorOrderHandlerController = require("../../controllers/vendor/vendorOrderHandlerController")

describe("vendorOrderHandlerController" , () => {

    beforeAll(() => {
        VanAuth.findOne = jest.fn().mockReturnValue(sampleData.sampleVendor);
    })
    describe("viewOrders", () => {
        let res = {
            send: jest.fn(),
            status: jest.fn(),
        }
        let req = {
            headers : {
                login : sampleData.sampleVendor._id
            },
            query : {
                customerId: "",
                status: ""
            }
        }

        beforeAll(() => {
            Order.find = jest.fn().mockReturnValue([sampleData2.sampleOrder])
            vendorOrderHandlerController.viewOrders(req, res);
        })
        test("Retrieving all orders", () => {
            expect(res.send).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith([sampleData2.sampleOrder])
        })
    })

    describe("Ready Order", () => {
        let res = {
            send: jest.fn(),
            status: jest.fn(),
        }
        let req = {
            headers : {
                login : sampleData.sampleVendor._id
            },
            body : {
                orderId: sampleData2.sampleOrder._id
            }
        }

        beforeAll(()=>{
            Order.findOneAndUpdate = jest.fn().mockReturnValue(sampleData2.sampleOrderReady)
            Date.now = jest.fn().mockReturnValue(sampleData2.sampleOrderReady.finishTime)
            vendorOrderHandlerController.readyOrder(req, res)
        })
        test("Testing setting order to READY", () => {
            expect(res.send).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith({
                discount : false,
                returnedOrder : sampleData2.sampleOrderReady
            })
        })
    })

    describe("Complete Order", () => {
        let res = {
            send: jest.fn(),
            status: jest.fn(),
        }
        let req = {
            headers : {
                login : sampleData.sampleVendor._id
            },
            body : {
                orderId: sampleData2.sampleOrder._id
            }
        }

        beforeAll(()=>{
            Order.findOneAndUpdate = jest.fn().mockReturnValue(sampleData2.sampleOrderComplete)
            vendorOrderHandlerController.completeOrder(req, res)
        })
        test("Testing setting order to COMPLETE", () => {
            expect(res.send).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith(sampleData2.sampleOrderComplete)
        })
    })
})