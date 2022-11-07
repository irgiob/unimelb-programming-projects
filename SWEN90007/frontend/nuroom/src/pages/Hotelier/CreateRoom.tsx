import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Colors from "../../constant/Colors";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import NuNavTitle from "../../components/NuNavTitle";
import { BASE_URL } from "../../constant/Endpoints";
import { MaskedInput, Input, InputGroup, Modal } from "rsuite";
import DeleteIcon from "@mui/icons-material/Delete";
import { getHotelierInfo, toasterMsg } from "../../services/utils";
import { ErrorMessage, SuccessMessage } from "../../components/NuMessage";

export default function CreateRoom() {
  let navigate = useNavigate();
  let location = useLocation();
  let stateFromPrePage: { hotelInfo: any } = location.state as {
    hotelInfo: any;
  };
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAddHotelierModal, setShowAddHotelierModa] = useState(false);
  const [addedHotelier, setAddedHotelier] = useState("");
  const [removedHotelier, setRemovedHotelier] = useState({});
  const [showSuccessBar, setShowSuccessBar] = useState(false);
  const [showErrorBar, setShowErrorBar] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const roomType = useRef<any>();
  const quantity = useRef<any>();
  const price = useRef<any>();
  const numBedrooms = useRef<any>();
  const numBathrooms = useRef<any>();
  const numBeds = useRef<any>();
  const imageURL = useRef<any>();
  const description = useRef<any>();
  const amenityName = useRef<any>();
  const amenityDesc = useRef<any>();
  const amenityImage = useRef<any>();
  const [amenityList, setAmenityList] = useState<any[]>([]);

  useEffect(() => {
    if (getHotelierInfo().roleLevel === undefined) {
      navigate("/loginpage");
    } else {
    }
  }, []); 
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
   
  const createRoom = () => {
    console.log(amenityList);
    axios
      .post(
        BASE_URL + "/CreateRoom",
        {
          roomType: roomType.current.value,
          hotelId: stateFromPrePage.hotelInfo.id,
          quantity: quantity.current.value,
          price: price.current.value,
          numBedrooms: numBedrooms.current.value,
          numBathrooms: numBathrooms.current.value,
          description: description.current.value,
          numBeds: numBeds.current.value,
          imageURL: imageURL.current.value,
          roomAmenityList: amenityList,
        },
        {
          headers: {
            Authorization: `Bearer ${getHotelierInfo().token}`,
          },
        }
      )
      .then((response) => {
        console.log("Created room res data..", response.data);
        if (response.data.errorCode === 200) {
          toasterMsg(SuccessMessage("Created hotel successfully!"));
          navigate(-1)
        } else {
          toasterMsg(ErrorMessage(response.data.args));
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const navBack = () =>{
    navigate(-1)
  }
  return (
    <MainContainer>
      <Header onClick={navBack}>
          <NuNavTitle
            title={`Create a Room for ${stateFromPrePage.hotelInfo.name}`}
            showArrowBack={true}
          />
      </Header>
      <CardContainer>
        <InputWrapper>
          <InputTitle>Room Type</InputTitle>
          <Input ref={roomType} placeholder="Room Type" />
        </InputWrapper>
        <InputWrapper>
          <InputTitle>Quantity</InputTitle>
          <MaskedInput
            ref={quantity}
            placeholder="Quantity"
            placeholderChar=" "
            mask={[/\d/, /\d/, /\d/, /\d/]}
          />
        </InputWrapper>
        <InputWrapper>
          <InputTitle>Price</InputTitle>
          <MaskedInput
            ref={price}
            placeholder="Price"
            placeholderChar=" "
            mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
          />
        </InputWrapper>
        <InputWrapper>
          <InputTitle>Number of Bedrooms</InputTitle>
          <MaskedInput
            ref={numBedrooms}
            placeholder="Number of Bedrooms"
            placeholderChar=" "
            mask={[/\d/, /\d/, /\d/, /\d/]}
          />
        </InputWrapper>
        <InputWrapper>
          <InputTitle>Number of Bathrooms</InputTitle>
          <MaskedInput
            ref={numBathrooms}
            placeholder="Number of Bathrooms"
            placeholderChar=" "
            mask={[/\d/, /\d/, /\d/, /\d/]}
          />
        </InputWrapper>

        <InputWrapper>
          <InputTitle>Number of Beds</InputTitle>
          <MaskedInput
            ref={numBeds}
            placeholder="Number of Beds"
            placeholderChar=" "
            mask={[/\d/, /\d/, /\d/, /\d/]}
          />
        </InputWrapper>
        <InputWrapper>
          <InputTitle>Description</InputTitle>
          <Input ref={description} placeholder="Description" />
        </InputWrapper>
        <InputWrapper>
          <InputTitle>Image URL</InputTitle>
          <Input ref={imageURL} placeholder="Image URL" />
        </InputWrapper>
      </CardContainer>
      <SecondCardContainer>
        <SubCard>
          <InputWrapper>
            <InputTitle>Room Amenity Name</InputTitle>
            <Input ref={amenityName} placeholder="Room Amenity Name" />
          </InputWrapper>
          <InputWrapper>
            <InputTitle>Room Amenity Description</InputTitle>
            <Input ref={amenityDesc} placeholder="Room Amenity Description" />
          </InputWrapper>
          <InputWrapper>
            <InputTitle>Room Amenity Image</InputTitle>
            <Input ref={amenityImage} placeholder="Room Amenity Image URL" />
          </InputWrapper>
          <Button onClick={addAmenity} variant="contained">
            Add Amenity
          </Button>
        </SubCard>
        <>
          {amenityList.map((item: any, idx: number) => (
            <SubCard key={idx}>
              <InputWrapper>
                <InputTitle>Room Amenity Name</InputTitle>
                <Text>{item.name}</Text>
              </InputWrapper>
              <InputWrapper>
                <InputTitle>Room Amenity Description</InputTitle>
                <Text>{item.description}</Text>
              </InputWrapper>
              <InputWrapper>
                <InputTitle>Room Amenity Image</InputTitle>
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
        <Button onClick={createRoom} variant="contained">
          Create Room
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
  &:hover{
    cursor: pointer;
  }
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
