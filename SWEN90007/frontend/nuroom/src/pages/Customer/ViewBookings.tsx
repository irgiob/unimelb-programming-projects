import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import axios from "axios";
import NuNavTitle from "../../components/NuNavTitle";
import { BASE_URL } from "../../constant/Endpoints";
import NuDataTable from "../../components/NuDataTable";
import { DateRangePicker, Input, InputGroup, InputNumber, Modal } from "rsuite";
import {
  getAdminInfo,
  getCustomerInfo,
  toasterMsg,
} from "../../services/utils";
import { ErrorMessage, SuccessMessage } from "../../components/NuMessage";
import { TempleHinduTwoTone } from "@mui/icons-material";

export default function ViewBookings() {
  let navigate = useNavigate();
  let location = useLocation();
  let stateFromPrePage: { hotelierGroup: any } = location.state as {
    hotelierGroup: any;
  };
  const { beforeToday } = DateRangePicker;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [dateRange, setDateRange] = useState<any>([
    new Date(),
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  ]);
  const [canceledBooking, setCanceledBooking] = useState<any>({});
  const [allBookings, setAllBookings] = useState([]);
  const [numTraveller, setNumTraveller] = useState<any>(1)
  const handleMinus = () => {
    if(numTraveller > 1){
      setNumTraveller(parseInt(numTraveller, 10) - 1);
    }
    
  };
  const handlePlus = () => {
    setNumTraveller(parseInt(numTraveller, 10) + 1);
  };
  useEffect(() => {
    if (getCustomerInfo().roleLevel !== undefined) {
      getBookings();
    } else {
      navigate("/loginpage");
    }
  }, []);
  const closeConfrimModal = () => {
    setShowConfirmModal(false);
  };

  const getBookings = () => {
    axios
      .get(BASE_URL + "/ViewBookings", {
        headers: {
          Authorization: `Bearer ${getCustomerInfo().token}`,
        },
      })
      .then((response) => {
        console.log("Fetched all bookings data..", response.data);
        if (response.data.errorCode === 200) {
          setAllBookings(response.data.args);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const cancelBooking = () => {
    console.log(canceledBooking);
    axios
      .post(
        BASE_URL + "/CancelBooking",
        {
          id: canceledBooking.id,
        },
        {
          headers: {
            Authorization: `Bearer ${getCustomerInfo().token}`,
          },
        }
      )
      .then((response) => {
        console.log("Canceled booking res data..", response.data);
        if (response.data.errorCode === 200) {
          toasterMsg(SuccessMessage("Cancelled booking successfully!"));
          getBookings();
          setShowConfirmModal(false);
        } else {
          toasterMsg(ErrorMessage(response.data.errorMessage));
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const modifyBooking = ()=>{
    let temp = canceledBooking
    temp.startDate = new Date(dateRange[0]).toISOString().substring(0,10)
    temp.endDate = new Date(dateRange[1]).toISOString().substring(0,10)
    temp.totalNumGuest = numTraveller
    temp.hotelId = canceledBooking.hotel.id 
    delete temp.status 
    delete temp.hotel
    axios
      .post(
        BASE_URL + "/ModifyBookings",
        temp,
        {
          headers: {
            Authorization: `Bearer ${getCustomerInfo().token}`,
          },
        }
      )
      .then((response) => {
        console.log("Canceled booking res data..", response.data);
        if (response.data.errorCode === 200) {
          toasterMsg(SuccessMessage("Modfied booking successfully!"));
          getBookings();
          setShowConfirmModal(false);
        } else {
          toasterMsg(ErrorMessage(response.data.args));
          getBookings();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
  const modifyBookingCheck = (bookingInfo: any) => {
    console.log(bookingInfo);
    setCanceledBooking(bookingInfo);
    setDateRange([
      new Date(bookingInfo.startDate),
      new Date(bookingInfo.endDate),
    ]);
    setNumTraveller(bookingInfo.totalNumGuest)
    setShowConfirmModal(true);
  };
  return (
    <MainContainer>
      <Header>
        <Link style={{ textDecoration: "none" }} to="/homepage">
          <NuNavTitle title={`All Bookings`} showArrowBack={true} />
        </Link>
      </Header>
      <CardContainer>
        <NuDataTable
          type="bookings"
          hideToolbarButton={true}
          title="All bookings"
          data={allBookings}
          isCustomer={true}
          modifyBookingCheck={modifyBookingCheck}
        />
      </CardContainer>
      <Modal open={showConfirmModal} onClose={closeConfrimModal}>
        <Modal.Header>
          <Modal.Title>Modify Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DatePickerContainer>
            <DatePickerTitleWrapper>
              <DatePickerTitle>Check-in</DatePickerTitle>
              <DatePickerTitle>Check-out</DatePickerTitle>
            </DatePickerTitleWrapper>
            <DateRangePicker
              ranges={[]}
              showOneCalendar
              onChange={setDateRange}
              value={dateRange}
              appearance="default"
              //@ts-ignore
              disabledDate={beforeToday()}
              placeholder="Subtle"
              style={{ width: 250 }}
            />
          </DatePickerContainer>

          <span>Number of guests</span>
          <InputGroup style={{width:130}} >
            <InputGroup.Button onClick={handleMinus}>-</InputGroup.Button>
            <InputNumber
              className={"custom-input-number"}
              value={numTraveller}
              
              onChange={setNumTraveller}
            />
            <InputGroup.Button onClick={handlePlus}>+</InputGroup.Button>
          </InputGroup>
          <Button style={{marginTop:20}} onClick={cancelBooking} color="error" variant="contained">Cancel Booking</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={modifyBooking}>Ok</Button>
          <Button onClick={closeConfrimModal}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  font-size: 32px;
  padding-left: 2vw;
  display: flex;
  flex-direction: column;
`;
const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px;
  margin: 20px;
`;
const Header = styled.div`
  width: 80vw;
  height: 100px;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: center;
`;

const DatePickerContainer = styled.div`
  display: flex;
  flex-direction: column; 
  margin-bottom: 30px;
`;
const DatePickerTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 170px;
`;
const DatePickerTitle = styled.div`
  font-size: 12px;
  color: black;
`;
