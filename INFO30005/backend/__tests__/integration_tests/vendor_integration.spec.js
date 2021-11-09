const request = require("supertest");
const app = require("../../app");

describe ("Integration test : Using the vendor app, the van operator sets the status of their van.", () => {

    // Login
    const login = {
        vanName: "testVan",
        password: 123456789
    };

    let agent = request.agent(app);
    let id = null;  

    beforeAll( () => agent
        // Login to the vendor app
        .post("/vendor/auth/login")
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(login)
        .then((res) => {
            id = res.headers['set-cookie'][0].split(';')[0].split('%')[3].slice(2)
            // id = res.body.message._id
            console.log(res.body)
        })
        .catch(err=>{
            console.log(err)
        })
    );


    test("Test 1 : Testing correct login", () => {
        expect(id).toBe("60a9edd3f090f100157baaec")
    })

    test("Test 2 : Set location for van", () => {
        return agent
        .post("/vendor/setVendor/setLocation")
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('login', id)
        .send({
            locationDescription: "TESTING",
            geolocation: [0,0]
        })
        .then( (response) => {
            console.log(response.body)
            expect(response.statusCode).toBe(200);
            expect(response.body._id).toBe(id);
        });
    });

    test("Test 3 : Closing a Van", () => {
        return agent
        .post("/vendor/setVendor/close")
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('login', id)
        .then( (response) => {
            console.log(response.body)
            expect(response.statusCode).toBe(200);
            expect(response.body._id).toBe(id);
        });
    })

})