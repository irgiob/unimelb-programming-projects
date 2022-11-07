import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import homepageBg from "../../assets/homepage-bg.jpg";
import logo from "../../assets/logo1.png";
import Colors from "../../constant/Colors";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Container,
  DateRangePicker,
  IconButton,
  Input,
  InputGroup,
  Loader,
  Message,
  Modal,
  Popover,
  useToaster,
  DatePicker,
  Whisper,
} from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import PlusIcon from "@rsuite/icons/Plus";
import MinusIcon from "@rsuite/icons/Minus";
import EyeIcon from "@rsuite/icons/legacy/Eye";
import EyeSlashIcon from "@rsuite/icons/legacy/EyeSlash";
import NuButton from "../../components/NuButton";
import React from "react";
import AdminIcon from "@rsuite/icons/Admin";
import NuDataTable from "../../components/NuDataTable";
import {
  dummyAllBookings,
  dummyAllHotels,
  dummyHotelierGroups,
} from "../../constant/DummyData";
import { BASE_URL } from "../../constant/Endpoints";
import {
  getAdminInfo,
  getCustomerInfo,
  getHotelierInfo,
  toasterMsg,
} from "../../services/utils";
import { SuccessMessage, ErrorMessage } from "../../components/NuMessage";

export default function HotelierHomepage() {
  let navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [groupName, setGroupName] = useState("");
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showOnboardHotelier, setShowOnboardHotelier] = useState(false);
  const [hotelierInfo, setHotelierInfo] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const [canceledBooking, setCanceledBooking] = useState<any>({});
  const [allBookings, setAllBookings] = useState([]);
  const [allHotels, setAllHotels] = useState([]);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const getAllBookings = () => {
    console.log(getHotelierInfo().token);
    axios
      .get(BASE_URL + "/ViewBookings", {
        headers: {
          Authorization: `Bearer ${getHotelierInfo().token}`,
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
  const closeConfrimModal = () => {
    setShowConfirmModal(false);
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
            Authorization: `Bearer ${getHotelierInfo().token}`,
          },
        }
      )
      .then((response) => {
        console.log("Canceled booking res data..", response.data);
        if (response.data.errorCode === 200) {
          toasterMsg(SuccessMessage("Cancelled booking successfully!"));
          getAllBookings()
          setShowConfirmModal(false)
        } else {
          toasterMsg(ErrorMessage(response.data.args));
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const closeAddGroupModal = () => {
    setShowAddGroupModal(false);
  };
  const closeOnboardModal = () => {
    setShowOnboardHotelier(false);
  };
  const addHotelierGroup = () => {
    console.log(groupName);
  };
  useEffect(() => {
    let info = sessionStorage.getItem("hotelierInfo");
    if (info) {
      setHotelierInfo(JSON.parse(info));
      getAllBookings();
      getHotels();
    } else {
      navigate("/loginpage");
    }
  }, []);

  const logout = () => {
    sessionStorage.removeItem("hotelierInfo");
    setHotelierInfo(null);
    navigate("/loginpage");
  };

  const navToHotels = (hotelInfo: any) => {
    navigate("/hotelierHotels", {
      state: { hotelInfo },
    });
  };
  const handleChange = () => {
    setVisible(!visible);
  };
  const getHotels = () => {
    axios
      .get(BASE_URL + "/ViewHotelierHotels", {
        headers: {
          Authorization: `Bearer ${getHotelierInfo().token}`,
        },
      })
      .then((response) => {
        console.log("Fetched hotelier hotels data..", response.data);
        if (response.data.errorCode === 200) {
          setAllHotels(response.data.args);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const navToCreateHotel = () => {
    navigate("/createHotel");
  };
  const cancelBookingCheck = (bookingInfo: any) => {
    console.log(bookingInfo);
    setShowConfirmModal(true);
    setCanceledBooking(bookingInfo);
  };
  const DefaultPopover = React.forwardRef(({ ...props }, ref: any) => {
    return (
      //@ts-ignore
      <Popover ref={ref} title={hotelierInfo.firstName} {...props}>
        <SignInBtn onClick={logout} color="yellow" appearance="subtle">
          Log out
        </SignInBtn>
      </Popover>
    );
  });

  return (
    <>
      <ImageBg>
        <NavBar>
          <LogoWrapper>
            <Logo src={logo} />
            <LogoName>NüRoom Hotelier Dashboard</LogoName>
          </LogoWrapper>
          <NameWrapper>
          <Name>{getHotelierInfo().firstName + ' ' + getHotelierInfo().lastName}</Name>
          <ButtonContainer>
            <Whisper
              trigger="click"
              placement={"bottom"}
              controlId={`control-id-bottomEnd`}
              speaker={<DefaultPopover />}
            >
              <ProfileIcon icon={<AdminIcon />} circle size="lg" />
            </Whisper>
          </ButtonContainer>
          </NameWrapper>
        </NavBar> 
        <SubContainer>
          <NuDataTable
            type="bookings"
            cancelBookingCheck={cancelBookingCheck}
            hideToolbarButton={true}
            roleLevel={2}
            title="Bookings"
            data={allBookings}
          />
        </SubContainer>
        <SubContainer>
          <NuDataTable
            type="hotelsUnderGroup"
            roleLevel={2}
            title="Hotels"
            addItem={navToCreateHotel}
            navToHotels={navToHotels}
            data={allHotels}
          />
        </SubContainer>
        <Modal open={showConfirmModal} onClose={closeConfrimModal}>
          <Modal.Header>
            <Modal.Title>
              Are you sure you want to cancel this booking?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>Id: {canceledBooking.id}</Modal.Body>
          <Modal.Footer>
            <Button onClick={cancelBooking}>Ok</Button>
            <Button onClick={closeConfrimModal}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </ImageBg>
    </>
  );
}

const ProfileIcon = styled(IconButton)`
  background-color: ${Colors.primary};
`;
const SignInBtn = styled(Button)`
  color: ${Colors.black};
  border-radius: 10px;
  padding: 10px 20px;
  margin-right: 10px;
  font-weight: bold;
  &:hover {
    color: black;
    background-color: ${Colors.primary};
  }
  &:focus {
    color: black;
  }
`;
const ImageBg = styled.div`
  height: 700px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;
const InputTitle = styled.div`
  margin-bottom: 3px;
  font-weight: bold;
  margin-left: 5px;
`;
const SubContainer = styled.div`
  margin-top: 50px;
  width: 90vw;
`;
const NavBar = styled.div`
  display: flex;
  flex-direction: row;
  width: 60vw;
  margin-top: 20px;
  justify-content: space-between;
`;
const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 50px;
  justify-content: center;
  align-items: center;
`;
const LogoName = styled.div`
  color: ${Colors.primary};
  font-size: 30px;
  height: 30px;
  font-family: "Open Sans", sans-serif;
`;
const NameWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const Name = styled.div`
  font-size: 25px;
  margin-right: 10px;
  color: ${Colors.black}; 
  font-weight: bold;
`
const Logo = styled.img`
  height: 50px;
  width: 50px;
`;
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  justify-content: space-between;
`;
const SearchContainer = styled.div`
  height: 90px;
  width: 70vw;
  background-color: white;
  border-radius: 20px;
  margin-top: 250px;
  display: flex;
  align-items: center;
  flex-direction: row;
`;

const SearchBar = styled.div`
  width: 300px;
  min-width: 260px;
  height: 38px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 30px;
  padding-left: 10px;
  border-radius: 10px;
  background-color: #efefefec;
`;
const SearchInput = styled.input`
  border: 0px;
  height: 30px;
  color: ${Colors.text};
  width: 80%;
  font-size: 15px;
  background-color: #efefefec;
  font-family: "Open Sans", sans-serif;
  &:focus {
    outline: none;
    border: 0px;
  }
`;
const DatePickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 30px;
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
const TravellerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  &:hover {
    cursor: pointer;
  }
`;
const TravellerTitle = styled.div`
  font-size: 12px;
  color: black;
`;
const TravellerContainer = styled.span`
  font-size: 15px;
  color: black;
  height: 34px;
  align-items: center;
  border: 1px solid #404040;
  border-radius: 6px;
  line-height: 32px;
  padding-left: 10px;
  padding-right: 10px;
`;
const TravellerItem = styled.div`
  width: 95%;
  display: flex;
  flex-direction: column;
`;
const RoomTitle = styled.div`
  font-size: 18px;
  color: black;
  font-weight: bolder;
`;
const PeopleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
`;
const PeopleText = styled.div`
  font-size: 17px;
  color: black;
`;
const ModifyContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 120px;
  font-weight: bold;
  font-size: 17px;
  align-items: center;
  justify-content: space-between;
`;
const RoomModifier = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
