const mongoose = require("mongoose");
require("../../models/index");
const sampleData = require("../../sampleData/sample_menu");
const Snack = mongoose.model("Snack") ;
const menuController = require("../../controllers/customer/menuController");

describe ( "MenuController", () => {

    beforeAll(() => {
        Snack.find = jest.fn().mockReturnValue(sampleData.sampleMenu)
        Snack.findById = jest.fn().mockReturnValue(sampleData.sampleSnack)
    })

    describe("View Menu", () => {

        let res = {
            send : jest.fn(),
            status: jest.fn(),
            cookie: jest.fn()
        }
    
        let req = {
            body: {},
            params: {},
            headers: {},
            query: {}
        }

        beforeAll(() => {
            menuController.viewMenu(req, res)
        })

        test( "Test 1 : Obtaining menu ", () => {
            expect(res.send).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith(sampleData.sampleMenu)
        })

    })

    describe("View Snack", () => {
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
            params: { snackId : "609254c2b35b4300150323b7"},
            headers: {},
            query: {}
        }

        beforeAll(() => {
            menuController.viewSnack(req, res)
        })

        test( "Test 1 : Obtaining snack ", () => {
            expect(res.send).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith(sampleData.sampleSnack)
        })
    })
})