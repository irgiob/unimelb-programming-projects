import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../../assets/logo1.png";
import Colors from "../../constant/Colors";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Button,
  IconButton,
  Input,
  InputGroup,
  Modal,
  Popover,
  DatePicker,
  Whisper,
  MaskedInput,
} from "rsuite";
import EyeIcon from "@rsuite/icons/legacy/Eye";
import EyeSlashIcon from "@rsuite/icons/legacy/EyeSlash";
import React from "react";
import AdminIcon from "@rsuite/icons/Admin";
import NuDataTable from "../../components/NuDataTable";
import { BASE_URL } from "../../constant/Endpoints";
import { getAdminInfo, toasterMsg } from "../../services/utils";
import {
  ErrorMessage,
  SuccessMessage,
  WarningMessage,
} from "../../components/NuMessage";

export default function AdminHomepage() {
  let navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showOnboardHotelier, setShowOnboardHotelier] = useState(false);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [visible, setVisible] = React.useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [allHotelierGroups, setAllHotelierGroups] = useState([]);

  const groupName = useRef<any>();
  const email = useRef<any>();
  const firstName = useRef<any>();
  const lastName = useRef<any>();
  const phoneNumber = useRef<any>();
  const password = useRef<any>();
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(new Date());

  const closeAddGroupModal = () => {
    setShowAddGroupModal(false);
  };
  const closeOnboardModal = () => {
    setShowOnboardHotelier(false);
  };
  const onBoardHotelier = () => {
    console.log(getAdminInfo().token);
    console.log(firstName.current.value);
    console.log(lastName.current.value);
    console.log(phoneNumber.current.value);
    console.log(dateOfBirth);

    let date = new Date(dateOfBirth ? dateOfBirth : "1999-01-01")
      .toISOString()
      .substring(0, 10);
    if (
      email.current.value === "" ||
      firstName.current.value === "" ||
      lastName.current.value === "" ||
      phoneNumber.current.value === "" ||
      dateOfBirth === null ||
      date === "" ||
      password.current.value === ""
    ) {
      toasterMsg(WarningMessage("Please fill out all fields."));
    } else {
      axios
        .post(
          BASE_URL + "/OnboardHotelier",
          {
            firstName: firstName.current.value,
            lastName: lastName.current.value,
            email: email.current.value,
            password: password.current.value,
            phoneNumber: phoneNumber.current.value,
            dateOfBirth: date,
            roleLevel: 2,
          },
          {
            headers: {
              Authorization: `Bearer ${adminInfo.token}`,
            },
          }
        )
        .then((response) => {
          console.log("Fetched Clients data..", response.data);
          if (response.data.errorCode === 200) {
            toasterMsg(SuccessMessage("Onboard hotelier successfully!"));
            setShowOnboardHotelier(false);
            getAllUsers();
          } else {
            toasterMsg(ErrorMessage(response.data.args));
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
  const getHotelierGroups = () => {
    axios
      .get(BASE_URL + "/ViewAllHotelierGroup", {
        headers: {
          Authorization: `Bearer ${getAdminInfo().token}`,
        },
      })
      .then((response) => {
        console.log("Fetched all hotelier groups data..", response.data);
        if (response.data.errorCode === 200) {
          setAllHotelierGroups(response.data.args);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const addHotelierGroup = () => {
    console.log(groupName.current.value);
    axios
      .post(
        BASE_URL + "/CreateHotelierGroup",
        {
          name: groupName.current.value,
        },
        {
          headers: {
            Authorization: `Bearer ${getAdminInfo().token}`,
          },
        }
      )
      .then((response) => {
        console.log("Fetched create hotelier group res..", response.data);
        if (response.data.errorCode === 200) {
          toasterMsg(SuccessMessage("Created hotelier group successfully!"));
          setShowAddGroupModal(false);
          getHotelierGroups();
        } else {
          toasterMsg(ErrorMessage(response.data.args));
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    setAdminInfo(getAdminInfo());
    console.log(getAdminInfo());
    if (getAdminInfo().roleLevel !== undefined) {
      getAllUsers();
      getHotelierGroups();
    } else {
      navigate("/adminlogin");
    }
  }, []);
   
  const getAllUsers = () => {
    axios
      .get(BASE_URL + "/ViewAllUsers", {
        headers: {
          Authorization: `Bearer ${getAdminInfo().token}`,
        },
      })
      .then((response) => {
        console.log("Fetched all users data..", response.data);
        setAllUsers(
          response.data.args.filter((item: any) => item.roleLevel !== 3)
        );
        
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const logout = () => {
    sessionStorage.removeItem("adminInfo");
    setAdminInfo(null);
    navigate("/adminlogin");
  };
  const navToBookedStays = () => {
    navigate("/adminBookedStays");
  };
  const navToHotels = () => {
    navigate("/adminHotels");
  };

  const handleChange = () => {
    setVisible(!visible);
  };

  const DefaultPopover = React.forwardRef(({ ...props }, ref: any) => {
    return (
      //@ts-ignore
      <Popover ref={ref} title={adminInfo.firstName} {...props}>
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
            <LogoName>NüRoom Admin Dashboard</LogoName>
          </LogoWrapper>
          <ButtonContainer>
            <SignInBtn
              onClick={navToBookedStays}
              color="yellow"
              appearance="primary"
            >
              Booked Stays
            </SignInBtn>
            <SignInBtn
              onClick={navToHotels}
              color="yellow"
              appearance="primary"
            >
              Hotels{" "}
            </SignInBtn>
            <Whisper
              trigger="click"
              placement={"bottom"}
              controlId={`control-id-bottomEnd`}
              speaker={<DefaultPopover />}
            >
              <ProfileIcon icon={<AdminIcon />} circle size="lg" />
            </Whisper>
          </ButtonContainer>
        </NavBar>
        <Modal open={showAddGroupModal} onClose={closeAddGroupModal}>
          <Modal.Header>
            <Modal.Title>Create a new hotelier group.</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Input ref={groupName} placeholder="Hotelier group name" />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={addHotelierGroup}>Ok</Button>
            <Button onClick={closeAddGroupModal}>Cancel</Button>
          </Modal.Footer>
        </Modal>

        <Modal open={showOnboardHotelier} onClose={closeOnboardModal}>
          <Modal.Header>
            <Modal.Title>Onboard a New Hotelier</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputWrapper>
              <InputTitle>Hotelier Email</InputTitle>
              <Input
                ref={email}
                placeholder="Hotelier email" 
              />
            </InputWrapper>
            <InputWrapper>
              <InputTitle>Hotelier First Name</InputTitle>
              <Input ref={firstName} placeholder="Hotelier first name" />
            </InputWrapper>
            <InputWrapper>
              <InputTitle>Hotelier Last Name</InputTitle>
              <Input ref={lastName} placeholder="Hotelier last name" />
            </InputWrapper>
            <InputWrapper>
              <InputTitle>Hotelier Date of Birth</InputTitle>
              <DatePicker value={dateOfBirth} onChange={setDateOfBirth} />
            </InputWrapper>

            <InputWrapper>
              <InputTitle>Hotelier Phone Number</InputTitle>
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
            <Button onClick={onBoardHotelier}>Onboard</Button>
            <Button onClick={closeOnboardModal}>Cancel</Button>
          </Modal.Footer>
        </Modal>
        <SubContainer>
          <NuDataTable
            type="allUsers"
            addItem={() => setShowOnboardHotelier(true)}
            title="All Users"
            data={allUsers}
          />
        </SubContainer>
        <SubContainer>
          <NuDataTable
            type="hotelierGroups"
            addItem={() => setShowAddGroupModal(true)}
            title="All Hotelier Groups"
            data={allHotelierGroups}
          />
        </SubContainer>
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
  width: 80vw;
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
