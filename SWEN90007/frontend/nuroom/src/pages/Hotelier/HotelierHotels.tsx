import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom"; 
import Button from "@mui/material/Button"; 
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios"; 
import NuNavTitle from "../../components/NuNavTitle";
import { BASE_URL } from "../../constant/Endpoints";
import NuDataTable from "../../components/NuDataTable"; 
import { Input, SelectPicker } from "rsuite";
import { SuccessMessage, ErrorMessage } from "../../components/NuMessage";
import Colors from "../../constant/Colors";
import { getHotelierInfo, toasterMsg } from "../../services/utils";

export default function HotelierHotels() {
  let navigate = useNavigate();
  let location = useLocation();
  const stateFromPrePage: { hotelInfo: any } = location.state as {
    hotelInfo: any;
  }; 

  const name = useRef<any>();
  const country = useRef<any>();
  const state = useRef<any>();
  const street = useRef<any>();
  const streetNo = useRef<any>();
  const postcode = useRef<any>();
  const imageURL = useRef<any>();
  const amenityName = useRef<any>();
  const amenityDesc = useRef<any>();
  const amenityImage = useRef<any>(); 
  const initialAmenityList = [...stateFromPrePage.hotelInfo.hotelAmenityList]
  const [amenityList, setAmenityList] = useState<any[]>([]);
  const [allRooms, setAllRooms] = useState([])
  const [groups, setGroups] = useState([])
  const [groupId, setGroupId] = useState()

  useEffect(() => {
    if (getHotelierInfo().roleLevel === undefined) {
      navigate("/loginpage");
    } else {
      getRooms()
      getHotelierGroups()
      name.current.value = stateFromPrePage.hotelInfo.name;
      country.current.value = stateFromPrePage.hotelInfo.country;
      state.current.value = stateFromPrePage.hotelInfo.state;
      street.current.value = stateFromPrePage.hotelInfo.street;
      postcode.current.value = stateFromPrePage.hotelInfo.postcode;
      streetNo.current.value = stateFromPrePage.hotelInfo.streetNo;
      imageURL.current.value = stateFromPrePage.hotelInfo.imageURL;
      setAmenityList(JSON.parse(JSON.stringify(stateFromPrePage.hotelInfo.hotelAmenityList)))
      setGroupId(stateFromPrePage.hotelInfo.hotelierGroupId)
    }
  }, []);
  const getHotelierGroups = () =>{
    axios
      .get(BASE_URL + "/ViewHotelierGroup", {
        headers: {
          Authorization: `Bearer ${getHotelierInfo().token}`,
        },
      })
      .then((response) => {
        console.log("Fetched get hotelier groups data..", response.data);
        if(response.data.errorCode === 200){
          let data = response.data.args.map((item:any)=>({label:item.name,value:item.id}))
          console.log(data)
          setGroups(data)
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
  const getRooms = () =>{
    console.log(stateFromPrePage.hotelInfo.hotelierGroupName)
    
    axios
      .post(
        BASE_URL + "/ViewHotelRooms", 
        {
          id: stateFromPrePage.hotelInfo.id
        },
        {
          headers: {
            Authorization: `Bearer ${getHotelierInfo().token}`,
          },
        }
      )
      .then((response) => {
        console.log("Get hotel rooms res data..", response.data);
        if (response.data.errorCode === 200) {
           setAllRooms(response.data.args)
        } 
      })
      .catch((err) => {
        console.error(err);
      });
  }
  const addAmenity = () => {
    const temp = amenityList;
    temp.push({
      name: amenityName.current.value,
      description: amenityDesc.current.value,
      imageUrl: amenityImage.current.value,
    });
    amenityName.current.value = "";
    amenityDesc.current.value = "";
    amenityImage.current.value = "";
    setAmenityList([...temp]);
  };
  const removeAmenity = (idx: number) => {
    console.log(idx);
    let temp = amenityList;
    temp.splice(idx, 1);
    console.log(temp);
    setAmenityList([...temp]);
  };
  const modifyHotel = () => {
    console.log(amenityList);
    
    let tempStreet = stateFromPrePage.hotelInfo.streetNo === streetNo.current.value ? null:streetNo.current.value
    console.log(tempStreet)
    let tempAmenityList = JSON.stringify(initialAmenityList) === JSON.stringify(amenityList) ? null: amenityList
    console.log("amenityList ", tempAmenityList)
    axios
      .post(
        BASE_URL + "/ModifyHotel",
        {
          versionNo: stateFromPrePage.hotelInfo.versionNo,
          id: stateFromPrePage.hotelInfo.id,
          name: name.current.value,
          hotelierGroupId: groupId,
          country: country.current.value,
          state: state.current.value,
          street: street.current.value,
          postcode: postcode.current.value,
          imageURL: imageURL.current.value, 
          isActive: 1,
          streetNo: streetNo.current.value,
          hotelAmenityList: amenityList,
        },
        {
          headers: {
            Authorization: `Bearer ${getHotelierInfo().token}`,
          },
        }
      )
      .then((response) => {
        console.log("modify hotel res data..", response.data);
        if (response.data.errorCode === 200) {
          toasterMsg(SuccessMessage("Modified hotel successfully!"));
          navigate(-1)
        } else {
          toasterMsg(ErrorMessage(response.data.errorMessage));
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const navToCreateRoom = ()=>{
    navigate('/createRoom',{
      state: {
        hotelInfo: stateFromPrePage.hotelInfo
      }
    })
  }
  return (
    <MainContainer>
      <Header>
        <Link style={{ textDecoration: "none" }} to="/hotelierHomepage">
          <NuNavTitle
            title={`${stateFromPrePage.hotelInfo.name}`}
            showArrowBack={true}
          />
        </Link>
      </Header>

      <CardContainer>
        <InputWrapper>
          <InputTitle>Hotel Name</InputTitle>
          <Input ref={name} placeholder="Hotel Name" />
        </InputWrapper>
        <InputWrapper>
          <InputTitle>Country</InputTitle>
          <Input ref={country} placeholder="Country" />
        </InputWrapper>
        <InputWrapper>
          <InputTitle>State</InputTitle>
          <Input ref={state} placeholder="State" />
        </InputWrapper>
        <InputWrapper>
          <InputTitle>Street</InputTitle>
          <Input ref={street} placeholder="Street" />
        </InputWrapper>
        <InputWrapper>
          <InputTitle>Street No.</InputTitle>
          <Input ref={streetNo} placeholder="Street No." />
        </InputWrapper>

        <InputWrapper>
          <InputTitle>Postcode</InputTitle>
          <Input ref={postcode} placeholder="Postcode" />
        </InputWrapper>
        <InputWrapper>
          <InputTitle>Image URL</InputTitle>
          <Input ref={imageURL} placeholder="Image URL" />
        </InputWrapper>
        <InputWrapper>
          <InputTitle>Hotelier Group</InputTitle>
          <SelectPicker defaultValue={stateFromPrePage.hotelInfo.hotelierGroupId} onSelect={(val:any)=>setGroupId(val)} data={groups}   />
        </InputWrapper>
      </CardContainer>
      <SecondCardContainer>
        <SubCard>
          <InputWrapper>
            <InputTitle>Hotel Amenity Name</InputTitle>
            <Input ref={amenityName} placeholder="Hotel Amenity Name" />
          </InputWrapper>
          <InputWrapper>
            <InputTitle>Hotel Amenity Description</InputTitle>
            <Input ref={amenityDesc} placeholder="Hotel Amenity Description" />
          </InputWrapper>
          <InputWrapper>
            <InputTitle>Hotel Amenity Image</InputTitle>
            <Input ref={amenityImage} placeholder="Hotel Amenity Image URL" />
          </InputWrapper>
          <Button onClick={addAmenity} variant="contained">
            Add Amenity
          </Button>
        </SubCard>
        <>
          {amenityList.map((item: any, idx: number) => (
            <SubCard key={idx}>
              <InputWrapper>
                <InputTitle>Hotel Amenity Name</InputTitle>
                <Text>{item.name}</Text>
              </InputWrapper>
              <InputWrapper>
                <InputTitle>Hotel Amenity Description</InputTitle>
                <Text>{item.description}</Text>
              </InputWrapper>
              <InputWrapper>
                <InputTitle>Hotel Amenity Image</InputTitle>
                <Text>{item.imageUrl}</Text>
              </InputWrapper>
              <DeleteBtn onClick={() => removeAmenity(idx)}>
                <DeleteIcon fontSize="large" color="error" />
              </DeleteBtn>
            </SubCard>
          ))}
        </>
      </SecondCardContainer>

      <BottomBtn>
        <Button onClick={modifyHotel} variant="contained">
          Modify Hotel
        </Button>
      </BottomBtn>
      <CardContainer>
        <NuDataTable
          type="rooms" 
          title="Rooms"
          data={allRooms}
          addItem={navToCreateRoom}
        />
      </CardContainer>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  font-size: 32px;
  padding-left: 5vw;
  padding-right: 5vw;
  display: flex;
  flex-direction: column;
`;
const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const SecondCardContainer = styled.div`
  flex-direction: row;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 50px;
`;
const SubCard = styled.div`
  margin: 20px;
  width: 26%;
  height: 300px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0px 0px 5px 2px ${Colors.shadow};
`;
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;
const InputTitle = styled.div`
  margin-bottom: 3px;
  font-weight: bold;
  font-size: 17px;
  color: ${Colors.black};
  margin-left: 5px;
`;
const Header = styled.div`
  width: 80vw;
  height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: center;
`;
const Text = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
  max-height: 20px;
  margin-left: 5px;
`;

const DeleteBtn = styled.div`
  align-self: center;
  margin-top: 40px;
  &:hover {
    cursor: pointer;
  }
`;
const BottomBtn = styled.div`
  margin-bottom: 50px;
  width: 230px;
  align-self: center;
`;
