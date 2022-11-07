import { toaster } from "rsuite";

export const getAdminInfo = () => {
  return JSON.parse(sessionStorage.getItem("adminInfo") || "{}");
};
export const getCustomerInfo = () => {
  return JSON.parse(sessionStorage.getItem("customerInfo") || "{}");
};
export const getHotelierInfo = () => {
  return JSON.parse(sessionStorage.getItem("hotelierInfo") || "{}");
};

export const toasterMsg = (item:any) =>{
  return toaster.push(item, { placement: "topCenter" })
}