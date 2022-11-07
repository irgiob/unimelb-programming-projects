import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import homepageBg from "../../assets/homepage-bg.jpg";
import logo from "../../assets/logo1.png";
import Colors from "../../constant/Colors";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Button,
  DatePicker,
  DateRangePicker,
  IconButton,
  Input,
  InputGroup,
  Loader,
  Modal,
  MaskedInput,
  Popover,
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
import { BASE_URL } from "../../constant/Endpoints";
import { getCustomerInfo, toasterMsg } from "../../services/utils";
import {
  ErrorMessage,
  InfoMessage,
  SuccessMessage,
  WarningMessage,
} from "../../components/NuMessage";

export default function Homepage() {
  const { beforeToday } = DateRangePicker;
  let navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [searchState, setSearchState] = useState("");
  const [searchPostcode, setSearchPostcode] = useState("");
  const [dateRange, setDateRange] = useState<any>([
    new Date(),
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  ]);
  const [roomNum, setRoomNum] = useState(1);
  const [travellerNum, setTravellerNum] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [travellerList, setTravellerList] = useState([
    {
      people: 1,
    },
  ]);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const email = useRef<any>();
  const firstName = useRef<any>();
  const lastName = useRef<any>();
  const phoneNumber = useRef<any>();
  const password = useRef<any>();
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(new Date());

  const [searchedRes, setSearchedRes] = useState<any>([]);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  useEffect(() => {
    let info = sessionStorage.getItem("customerInfo");
    if (info) {
      setCustomerInfo(JSON.parse(info));
    }
  }, []);
  const onEnter = (e: any) => {
    if (e.key === "Enter") {
      console.log("enter pressed");
      submitSearch();
    }
  };
  const submitSearch = () => {
    setSearchLoading(true);
    axios
      .post(BASE_URL + "/SearchAccommodation", {
        startDate: new Date(dateRange[0]).toISOString().substring(0, 10),
        endDate: new Date(dateRange[1]).toISOString().substring(0, 10),
        hotelName: searchName !== "" ? searchName : null,
        country: searchCountry !== "" ? searchCountry : null,
        state: searchState !== "" ? searchState : null,
        postcode: searchPostcode !== "" ? searchPostcode : null,
      })
      .then((response) => {
        console.log("Fetched search places data..", response.data);
        let res = response.data;
        if (res.errorCode === 200) {
          const resList = res.args.filter((item: any) => item.isActive === 1);
          if (resList.length === 0) {
            toasterMsg(InfoMessage("No hotels found."));
            setSearchedRes([]);
          } else {
            setSearchedRes(resList);
            window.scrollTo(0, window.innerHeight);
          }
        }
        setSearchLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const signUp = () => {
    let date = new Date(dateOfBirth ? dateOfBirth : "1999-01-01")
      .toISOString()
      .substring(0, 10);
    axios
      .post(BASE_URL + "/CustomerSignUp", {
        firstName: firstName.current.value,
        lastName: lastName.current.value,
        email: email.current.value,
        password: password.current.value,
        phoneNumber: phoneNumber.current.value,
        dateOfBirth: date,
        roleLevel: 1,
      })
      .then((response) => {
        console.log("Customer sign up data..", response.data);
        if (response.data.errorCode === 200) {
          toasterMsg(SuccessMessage("Signed up successfully!"));
          navigate("/loginpage");
        }else{
          toasterMsg(ErrorMessage(response.data.args))
          
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const signIn = () => {
    navigate("/loginpage");
  };
  const closeSignUpModal = () => {
    setShowSignUpModal(false);
  };
  const openSignUpModal = () => {
    setShowSignUpModal(true);
  };
  const logout = () => {
    sessionStorage.removeItem("customerInfo");
    setCustomerInfo(null);
  };

  const handleChange = () => {
    setVisible(!visible);
  };

  const addPeople = (idx: number) => {
    const tempList = travellerList.map((val, index) => {
      if (idx === index) {
        return { ...val, people: val.people + 1 };
      }
      return val;
    });
    setTravellerNum((pre) => pre + 1);
    setTravellerList(tempList);
  };
  const removePeople = (idx: number) => {
    const tempList = travellerList.map((val, index) => {
      if (idx === index) {
        return { ...val, people: val.people - 1 };
      }
      return val;
    });
    setTravellerNum((pre) => pre - 1);
    setTravellerList(tempList);
  };
  const addRoom = () => {
    const tempList = travellerList;
    tempList.push({
      people: 1,
    });
    setTravellerNum((pre) => pre + 1);
    setRoomNum((pre) => pre + 1);
    setTravellerList([...tempList]);
  };
  const removeRoom = (idx: number) => {
    const tempList = travellerList;
    let num = tempList[idx].people;
    console.log(num);
    tempList.splice(idx, 1);
    setTravellerNum((pre) => pre - num);
    setRoomNum((pre) => pre - 1);
    setTravellerList([...tempList]);
  };
  const DefaultPopover = React.forwardRef(({ ...props }, ref: any) => {
    return (
      //@ts-ignore
      <Popover ref={ref} title={customerInfo.firstName} {...props}>
        <SignInBtn onClick={logout} color="yellow" appearance="subtle">
          Log out
        </SignInBtn>
      </Popover>
    );
  });
  const navToBookRooms = (hotelInfo: any) => {
    if (getCustomerInfo().roleLevel === undefined) {
      toasterMsg(WarningMessage("Please login to book rooms."));
    } else {
      navigate("/bookRooms", {
        state: {
          hotelInfo,
          travellerNum,
          roomNum,
          dateRange,
        },
      });
    }
  };
  return (
    <>
      <ImageBg>
        {searchLoading && (
          <Loader center inverse content="loading..." size="lg" vertical />
        )}
        <NavBar>
          <LogoWrapper>
            <Logo src={logo} />
            <LogoName>NüRoom</LogoName>
          </LogoWrapper>
          <ButtonContainer>
            {customerInfo ? (
              <>
                <SignUpBtn
                  onClick={() => navigate("/viewBookings")}
                  appearance="subtle"
                >
                  Bookings
                </SignUpBtn>
                <Whisper
                  trigger="click"
                  placement={"bottom"}
                  controlId={`control-id-bottomEnd`}
                  speaker={<DefaultPopover />}
                >
                  <ProfileIcon icon={<AdminIcon />} circle size="lg" />
                </Whisper>
              </>
            ) : (
              <>
                <SignUpBtn onClick={openSignUpModal} appearance="subtle">
                  SIGN UP
                </SignUpBtn>
                <SignInBtn onClick={signIn} color="yellow" appearance="primary">
                  SIGN IN
                </SignInBtn>
              </>
            )}
          </ButtonContainer>
        </NavBar>
        <Slogan>Explore your place to stay</Slogan>
        <SearchContainer>
          <Upper>
            <SearchBar>
              <SearchIcon />
              <SearchInput
                placeholder="Hotel name"
                onChange={(e) => setSearchName(e.target.value)}
                value={searchName}
                onKeyDown={onEnter}
                type={"text"}
              />
            </SearchBar>
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
            <TravellerWrapper onClick={handleOpen}>
              <TravellerTitle>Travellers</TravellerTitle>
              <TravellerContainer>
                {roomNum} room(s), {travellerNum} traveller(s)
              </TravellerContainer>
            </TravellerWrapper>
          </Upper>
          <Upper>
            <SearchBar>
              <SearchIcon />
              <SearchInput
                placeholder="Country"
                onChange={(e) => setSearchCountry(e.target.value)}
                value={searchCountry}
                onKeyDown={onEnter}
                type={"text"}
              />
            </SearchBar>
            <SearchBar>
              <SearchIcon />
              <SearchInput
                placeholder="State"
                onChange={(e) => setSearchState(e.target.value)}
                value={searchState}
                onKeyDown={onEnter}
                type={"text"}
              />
            </SearchBar>
            <SearchBar>
              <SearchIcon />
              <SearchInput
                placeholder="Postcode"
                onChange={(e) => setSearchPostcode(e.target.value)}
                value={searchPostcode}
                onKeyDown={onEnter}
                type={"text"}
              />
            </SearchBar>
          </Upper>
        </SearchContainer>
      </ImageBg>
      <Modal overflow={true} open={showModal} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>Travellers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {travellerList.map((item, idx) => {
            return (
              <TravellerItem key={idx}>
                <RoomTitle>Room {idx + 1}</RoomTitle>
                <PeopleWrapper>
                  <PeopleText>People</PeopleText>
                  <ModifyContainer>
                    <IconButton
                      disabled={item.people === 1}
                      onClick={() => removePeople(idx)}
                      size="md"
                      icon={<MinusIcon />}
                      circle
                    />
                    {item.people}
                    <IconButton
                      disabled={travellerNum === 20}
                      onClick={() => addPeople(idx)}
                      size="md"
                      icon={<PlusIcon />}
                      circle
                    />
                  </ModifyContainer>
                </PeopleWrapper>
                {idx !== 0 && (
                  <RoomModifier>
                    <div onClick={() => removeRoom(idx)}>
                      <NuButton
                        text="Remove room"
                        color="#3258CC"
                        bgColor="#E4EAFB"
                      />
                    </div>
                  </RoomModifier>
                )}
                {idx === travellerList.length - 1 && travellerList.length < 9 && (
                  <RoomModifier>
                    <div onClick={addRoom}>
                      <NuButton
                        text="Add another room"
                        color="#3258CC"
                        bgColor="#E4EAFB"
                      />
                    </div>
                  </RoomModifier>
                )}
              </TravellerItem>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="primary">
            Ok
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal open={showSignUpModal} onClose={closeSignUpModal}>
        <Modal.Header>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputWrapper>
            <InputTitle>Email</InputTitle>
            <Input ref={email} placeholder="email" />
          </InputWrapper>
          <InputWrapper>
            <InputTitle>First Name</InputTitle>
            <Input ref={firstName} placeholder="first name" />
          </InputWrapper>
          <InputWrapper>
            <InputTitle>Last Name</InputTitle>
            <Input ref={lastName} placeholder="last name" />
          </InputWrapper>
          <InputWrapper>
            <InputTitle>Date of Birth</InputTitle>
            <DatePicker value={dateOfBirth} onChange={setDateOfBirth} />
          </InputWrapper>

          <InputWrapper>
            <InputTitle>Phone Number</InputTitle>
            <MaskedInput
              ref={phoneNumber}
              placeholder="0452574022"
              placeholderChar=" "
              mask={[
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
              ]}
            />
          </InputWrapper>
          <InputWrapper>
            <InputTitle>Password</InputTitle>
            <InputGroup inside>
              <Input ref={password} type={visible ? "text" : "password"} />
              <InputGroup.Button onClick={handleChange}>
                {visible ? <EyeIcon /> : <EyeSlashIcon />}
              </InputGroup.Button>
            </InputGroup>
          </InputWrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={signUp}>Ok</Button>
          <Button onClick={closeSignUpModal}>Cancel</Button>
        </Modal.Footer>
      </Modal>
      <MainContainer>
        {searchedRes.map((item: any, index: number) => (
          <CardItem key={index} onClick={() => navToBookRooms(item)}>
            <CardImage src={item.imageURL} />
            <CardSubItem>
              <HotelName>{item.name}</HotelName>
              <HotelAddress>
                {item.streetNo}, {item.street}, {item.state}, {item.country}
              </HotelAddress>
              <HotelAddress>{item.postcode}</HotelAddress>
              <HotelAmenity></HotelAmenity>
            </CardSubItem>
          </CardItem>
        ))}
      </MainContainer>
    </>
  );
}

const MainContainer = styled.div`
  width: 70vw;
  display: flex;
  margin: 70px auto;
  flex-direction: column;
  align-self: center;
  align-items: center;
`;
const CardItem = styled.div`
  width: 800px;
  margin-bottom: 25px;
  height: 250px;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  box-shadow: 0px 0px 10px 2px ${Colors.shadow};
  &:hover {
    cursor: pointer;
  }
`;
const CardImage = styled.img`
  height: 250px;
  width: 250px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`;
const CardSubItem = styled.div`
  height: 100%;
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;
const HotelName = styled.div`
  font-size: 23px;
  font-weight: bold;
  color: ${Colors.black};
`;
const HotelAddress = styled.div`
  font-size: 18px;
  color: ${Colors.text};
`;
const HotelAmenity = styled.div`
  font-size: 23px;
  font-weight: bold;
  color: ${Colors.black};
`;

const ProfileIcon = styled(IconButton)`
  background-color: ${Colors.primary};
`;
const SignUpBtn = styled(Button)`
  color: ${Colors.primary};
  font-weight: bold;
  margin-right: 20px;
  border-radius: 10px;
  &:hover {
    background-color: ${Colors.primary};
  }
`;
const SignInBtn = styled(Button)`
  color: ${Colors.black};
  border-radius: 10px;
  width: 100px;
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
  background-image: url(${homepageBg});
  height: 700px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Slogan = styled.div`
  font-size: 60px;
  color: #f2f2f2;
  margin-top: 50px;
  font-family: "Open Sans", sans-serif;
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
  color: #fdd76e;
  font-size: 30px;
  height: 30px;
  font-family: "Open Sans", sans-serif;
`;
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
  height: 150px;
  width: 70vw;
  background-color: white;
  border-radius: 20px;
  margin-top: 250px;
  display: flex;
  align-items: center;
  padding: 20px;
  justify-content: space-around;
  flex-direction: column;
`;

const SearchBar = styled.div`
  width: 230px;
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
const Upper = styled.div`
  display: flex;
  flex-direction: row;
  width: 90%;
  justify-content: space-between;
  align-items: center;
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
