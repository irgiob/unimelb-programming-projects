import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom"; 
import Colors from "../../constant/Colors"; 
import Button from "@mui/material/Button";
import axios from "axios"; 
import NuNavTitle from "../../components/NuNavTitle";
import { BASE_URL } from "../../constant/Endpoints"; 
import { IconButton, Input, InputGroup, SelectPicker } from "rsuite";
import DeleteIcon from "@mui/icons-material/Delete";
import { getHotelierInfo, toasterMsg } from "../../services/utils";
import { ErrorMessage, SuccessMessage } from "../../components/NuMessage";

export default function CreateHotel() {
  let navigate = useNavigate();
  let location = useLocation();
  // let stateFromPrePage: {hotelierGroup: any} = location.state as {hotelierGroup: any}
  
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
  const [amenityList, setAmenityList] = useState<any[]>([]);
  const [groups, setGroups] = useState([])
  const [groupId, setGroupId] = useState()

  useEffect(() => {
    if (getHotelierInfo().roleLevel === undefined) {
      navigate("/loginpage");
    }else{
      getHotelierGroups()
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
  const createHotel = () => {
    console.log(amenityList)
    console.log(groupId)
    axios
      .post(
        BASE_URL + "/CreateHotel",
        {
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
        console.log("Created hotel res data..", response.data);
        if (response.data.errorCode === 200) {
          toasterMsg(SuccessMessage("Created hotel successfully!"));
          navigate('/hotelierhomepage')
        } else {
          toasterMsg(ErrorMessage(response.data.args));
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <MainContainer>
      <Header>
        <Link style={{ textDecoration: "none" }} to="/hotelierHomepage">
          <NuNavTitle title={`Create a Hotel`} showArrowBack={true} />
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
          <SelectPicker onSelect={(val:any)=>setGroupId(val)} data={groups}   />
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
        <Button onClick={createHotel} variant="contained">
          Create Hotel
        </Button>
      </BottomBtn>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  font-size: 32px;
  padding-left: 10vw;
  padding-right: 5vw;
  display: flex;
  flex-direction: column;
`;
const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: 60%;
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
