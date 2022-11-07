import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import axios from "axios";
import NuNavTitle from "../../components/NuNavTitle";
import { BASE_URL } from "../../constant/Endpoints";
import DeleteIcon from "@mui/icons-material/Delete";
import { Input, Modal } from "rsuite";
import {
  getAdminInfo,
  getCustomerInfo,
  toasterMsg,
} from "../../services/utils";
import { ErrorMessage, SuccessMessage } from "../../components/NuMessage";
import Colors from "../../constant/Colors";

export default function BookRooms() {
  let navigate = useNavigate();
  let location = useLocation();
  let stateFromPrePage: {
    hotelInfo: any;
    travellerNum: number;
    roomNum: number;
    dateRange: any;
  } = location.state as {
    hotelInfo: any;
    travellerNum: number;
    roomNum: number;
    dateRange: any;
  };
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<any[]>([]);
  const [removedHotel, setRemovedHotel] = useState<any>({});
  const [numRooms, setNumRooms] = useState(0);
  const [roomAmenity, setRoomAmenity] = useState<any>([]);
  const [roomAmenityModal, setRoomAmenityModal] = useState(false);
  const addRoom = (item: any) => {
    let rooms = selectedRooms;
    let newItem = true;
    for (let i = 0; i < rooms.length; i++) {
      if (selectedRooms[i].id === item.id) {
        rooms[i].addedNum++;
        newItem = false;
      }
    }
    if (newItem) {
      rooms.push({
        ...item,
        addedNum: 1,
      });
    }
    setSelectedRooms([...rooms]);
  };
  const showRoomAmenities = (item: any) => {
    setRoomAmenity(item);
    setRoomAmenityModal(true);
  };
  const removeRoom = (idx: number) => {
    let temp = selectedRooms;
    temp.splice(idx, 1);
    setSelectedRooms([...temp]);
  };
  const bookCheck = () => {
    let tempNumRooms = 0;
    selectedRooms.forEach((item) => {
      tempNumRooms += item.addedNum;
    });
    setNumRooms(tempNumRooms);
    if (tempNumRooms !== stateFromPrePage.roomNum) {
      setShowConfirmModal(true);
    } else {
      bookHotel();
    }
  };
  const bookHotel = () => {
    let userId = getCustomerInfo().id;
    let hotelId = stateFromPrePage.hotelInfo.id;
    let totalNumGuest = stateFromPrePage.travellerNum;
    let status = "PENDING";
    let startDate = new Date(stateFromPrePage.dateRange[0])
      .toISOString()
      .substring(0, 10);
    let endDate = new Date(stateFromPrePage.dateRange[1])
      .toISOString()
      .substring(0, 10);
    let bookingRoomList: any[] = [];
    selectedRooms.forEach((item) => {
      bookingRoomList.push({
        roomId: item.id,
        numberOfRooms: item.addedNum,
        hotelId: stateFromPrePage.hotelInfo.id,
      });
    });
    axios
      .post(
        BASE_URL + "/BookHotel",
        {
          userId,
          totalNumGuest,
          status,
          startDate,
          hotelId,
          endDate,
          bookingRoomList,
        },
        {
          headers: {
            Authorization: `Bearer ${getCustomerInfo().token}`,
          },
        }
      )
      .then((response) => {
        console.log("Customer booked rooms data..", response.data);
        if (response.data.errorCode === 200) {
          toasterMsg(SuccessMessage("Booked rooms successfully!"));
          navigate(-1);
        }else{ 
          toasterMsg(ErrorMessage(response.data.args))
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    if (getCustomerInfo().roleLevel !== undefined) {
      console.log(stateFromPrePage.hotelInfo);
    } else {
      navigate("/loginpage");
    }
  }, []);
  const closeConfrimModal = () => {
    setShowConfirmModal(false);
  };

  const removeHotel = () => {
    setShowConfirmModal(false);
    axios
      .post(
        BASE_URL + "/RemoveHotel",
        {
          id: removedHotel.id,
        },
        {
          headers: {
            Authorization: `Bearer ${getAdminInfo().token}`,
          },
        }
      )
      .then((response) => {
        console.log("removed hotel data..", response.data);
        if (response.data.errorCode === 200) {
          toasterMsg(SuccessMessage("Removed hotel successfully."));
          getBookings();
        } else {
          toasterMsg(ErrorMessage(response.data.errorMsg));
        }
      })
      .catch((err) => {
        console.error(err);
      });
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
          // setAllBookings(response.data.args);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const removeHotelCheck = (hotelInfo: any) => {
    console.log(hotelInfo);
    setRemovedHotel(hotelInfo);
    setShowConfirmModal(true);
  };
  const navBack = () => {};

  return (
    <MainContainer>
      <Header onClick={navBack}>
        <Link style={{ textDecoration: "none" }} to="/homepage">
          <NuNavTitle
            title={`Book rooms at ${stateFromPrePage.hotelInfo.name}`}
            showArrowBack={true}
          />
        </Link>
      </Header>
      <PageTitleWrapper>
        <PageTitle>
          {stateFromPrePage.travellerNum} traveller(s) and{" "}
          {stateFromPrePage.roomNum} room(s)
        </PageTitle>
        <Button onClick={bookCheck} variant="contained">
          Book Now
        </Button>
      </PageTitleWrapper>
      <Section>Hotel Amenities</Section>
      <AmenityWrapper>
        {stateFromPrePage.hotelInfo.hotelAmenityList.map(
          (item: any, idx: number) => (
            <AmenityItem>
              <AmenityPic src={item.imageUrl} />
              <AmenitySub>
                <AmenityTitle>{item.name}</AmenityTitle>
                <AmenityDesc>{item.description}</AmenityDesc>
              </AmenitySub>
            </AmenityItem>
          )
        )}
      </AmenityWrapper>
      <Section>Selected Rooms</Section>
      <SelectArea>
        {selectedRooms.map((item: any, idx: number) => (
          <SubCard key={idx}>
            <RoomPic src={item.imageURL} />
            <SubCardWrapper>
              <RoomType>{item.roomType}</RoomType>
              <Desc>{item.description}</Desc>
              <TextWrapper>
                <NormalText>Bathrooms</NormalText>
                <NormalText>{item.numBathrooms}</NormalText>
              </TextWrapper>
              <TextWrapper>
                <NormalText>Bedrooms</NormalText>
                <NormalText>{item.numBedrooms}</NormalText>
              </TextWrapper>
              <TextWrapper>
                <NormalText>Beds</NormalText>
                <NormalText>{item.numBeds}</NormalText>
              </TextWrapper>
              <TextWrapper>
                <NormalText>Available</NormalText>
                <NormalText>{item.quantity}</NormalText>
              </TextWrapper>
              <TextWrapper>
                <NormalText>
                  <b>Price</b>
                </NormalText>
                <NormalText>
                  <b>${item.price * item.addedNum}</b>
                </NormalText>
              </TextWrapper>
              <AddedNum>{item.addedNum}</AddedNum>
              <DeleteBtn onClick={() => removeRoom(idx)}>
                <DeleteIcon fontSize="large" color="error" />
              </DeleteBtn>
            </SubCardWrapper>
          </SubCard>
        ))}
      </SelectArea>
      <Section>Available Rooms</Section>
      <SelectArea>
        {stateFromPrePage.hotelInfo.roomList.map((item: any, idx: number) => (
          <SubCard key={idx}>
            <RoomPic src={item.imageURL} />
            <SubCardWrapper>
              <RoomType>{item.roomType}</RoomType>
              <Desc>{item.description}</Desc>
              <TextWrapper>
                <NormalText>Bathrooms</NormalText>
                <NormalText>{item.numBathrooms}</NormalText>
              </TextWrapper>
              <TextWrapper>
                <NormalText>Bedrooms</NormalText>
                <NormalText>{item.numBedrooms}</NormalText>
              </TextWrapper>
              <TextWrapper>
                <NormalText>Beds</NormalText>
                <NormalText>{item.numBeds}</NormalText>
              </TextWrapper>
              <TextWrapper>
                <NormalText>Available</NormalText>
                <NormalText>{item.quantity}</NormalText>
              </TextWrapper>
              <TextWrapper>
                <NormalText>
                  <b>Price</b>
                </NormalText>
                <NormalText>
                  <b>${item.price}</b>
                </NormalText>
              </TextWrapper>
              <Button onClick={() => showRoomAmenities(item.roomAmenityList)}>
                Room Amenities
              </Button>
              <Button onClick={() => addRoom(item)} variant="contained">
                Reserve
              </Button>
            </SubCardWrapper>
          </SubCard>
        ))}
      </SelectArea>
      <Modal open={showConfirmModal} onClose={closeConfrimModal}>
        <Modal.Header>
          <Modal.Title>Do you want to book anyway?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>
            You planned to book {stateFromPrePage.roomNum} room(s) for{" "}
            {stateFromPrePage.travellerNum} traveller(s).
          </span>
          <br />
          <span>But now you have {numRooms} room(s).</span>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={bookHotel}>Book</Button>
          <Button onClick={closeConfrimModal}>Cancel</Button>
        </Modal.Footer>
      </Modal>
      <Modal open={roomAmenityModal} onClose={() => setRoomAmenityModal(false)}>
        <Modal.Header>
          <Modal.Title>Room Amenities</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {roomAmenity.map((item: any, idx: number) => (
            <AmenityItem>
              <AmenityPic src={item.imageUrl} />
              <AmenitySub>
                <AmenityTitle>{item.name}</AmenityTitle>
                <AmenityDesc>{item.description}</AmenityDesc>
              </AmenitySub>
            </AmenityItem>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setRoomAmenityModal(false)}>Ok</Button>
        </Modal.Footer>
      </Modal>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  font-size: 32px;
  padding-left: 5vw;
  width: 90vw;
  display: flex;
  flex-direction: column;
`;
const AmenityWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 30px;
  overflow: scroll;
  height: 200px;
  flex-wrap: wrap;
  margin: 20px;
`;
const AmenityItem = styled.div`
  display: flex;
  margin: 10px;
  flex-direction: row;
  width: 300px;
  align-items: center;
  height: 60px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 1px ${Colors.shadow};
`;
const AmenityPic = styled.img`
  height: 60px;
  width: 60px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`;
const AmenitySub = styled.div`
  display: flex;
  padding-left: 10px;
  flex-direction: column;
  height: 100%;
`;
const AmenityTitle = styled.div`
  font-size: 15px;
  font-weight: bold;
  color: ${Colors.black};
`;
const AmenityDesc = styled.div`
  font-size: 12px;
  overflow: hidden;
`;

const Header = styled.div`
  width: 80vw;
  height: 100px;
  padding-left: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: center;
`;
const PageTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  margin-left: 50px;
  width: 80vw;
  justify-content: space-between;
`;
const PageTitle = styled.div`
  color: ${Colors.black};
  font-size: 23px;
  font-weight: bold;
`;
const SelectArea = styled.div`
  flex-direction: row;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 50px;
`;
const SubCard = styled.div`
  margin: 20px;
  width: 300px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0px 0px 5px 2px ${Colors.shadow};
`;
const SubCardWrapper = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
`;
const RoomPic = styled.img`
  height: 200px;
  width: 300px;
  object-fit: cover;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;
const Section = styled.div`
  font-size: 26px;
  margin-left: 50px;
  color: ${Colors.text};
  font-weight: bold;
`;
const RoomType = styled.div`
  font-weight: bold;
  height: 50px;
  font-size: 21px;
  color: ${Colors.black};
  margin-bottom: 8px;
`;
const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
`;
const AddedNum = styled.div`
  font-size: 30px;
  margin-top: 20px;
  align-self: center;
  line-height: 33px;
  font-weight: bold;
  color: ${Colors.white};
  background-color: ${Colors.light_purple};
  text-align: center;
  height: 36px;
  width: 36px;
  border-radius: 18px;
`;
const DeleteBtn = styled.div`
  align-self: center;
  margin-top: 15px;
  &:hover {
    cursor: pointer;
  }
`;
const Desc = styled.div`
  font-size: 15px;
  height: 38px;
  overflow: hidden;
  margin-bottom: 15px;
  color: ${Colors.black};
`;
const NormalText = styled.div`
  font-size: 15px;
  width: 100px;
  color: ${Colors.black};
`;
