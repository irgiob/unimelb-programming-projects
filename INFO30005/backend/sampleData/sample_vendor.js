const sampleVendor = {
    _id : "60a765a1877db642383cb6b7",
    locationDescription : "Near Melbourne Uni",
    geolocation: [-37.83959536115663, 145.03793018976216],
    vendorName: "foodVan",
    password: "$2b$12$1hkFtYGnuH3Yfjrkf2BfduOc7nzm.DddFnVENCYgRGF9blGG.v8vW",
    status : "OPEN"
}


const sampleVendorClosed = {
    _id : "60a765a1877db642383cb6b7",
    locationDescription : null,
    geolocation: [-37.83959536115663, 145.03793018976216],
    vendorName: "foodVan",
    password: "$2b$12$1hkFtYGnuH3Yfjrkf2BfduOc7nzm.DddFnVENCYgRGF9blGG.v8vW",
    status: "CLOSED"
}


module.exports = {sampleVendor, sampleVendorClosed}