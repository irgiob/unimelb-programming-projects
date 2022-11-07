import { useRef, useState } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import axios from "axios";
import NuNavTitle from "../../components/NuNavTitle";
import { BASE_URL } from "../../constant/Endpoints";
import NuDataTable from "../../components/NuDataTable";
import { Input, Modal } from "rsuite";
import { getAdminInfo, toasterMsg } from "../../services/utils";
import { SuccessMessage, ErrorMessage } from "../../components/NuMessage";

export default function HotelierGroups() {
  let navigate = useNavigate();
  let location = useLocation();
  let stateFromPrePage: { hotelierGroup: any } = location.state as {
    hotelierGroup: any;
  };
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAddHotelierModal, setShowAddHotelierModa] = useState(false);
  const [showHotelConfirmModal, setShowHotelConfirmModal] = useState(false)

  const addedHotelier = useRef<any>()
  const [removedHotelier, setRemovedHotelier] = useState<any>({});
  const [removedHotel, setRemovedHotel] = useState<any>({})
  const removeHotelCheck = (hotelInfo: any) => {
    console.log(hotelInfo);
    setRemovedHotel(hotelInfo);
    setShowHotelConfirmModal(true);
  };
  const removeHotelierCheck = (hotelierInfo: any) => {
    console.log(hotelierInfo);
    setRemovedHotelier(hotelierInfo);
    setShowConfirmModal(true);
  };
  const removeHotel = () => {
    setShowConfirmModal(false);
    axios
      .post(BASE_URL + "/RemoveHotel", {
        id: removedHotel.id
      }, {
        headers: {
          Authorization: `Bearer ${getAdminInfo().token}`,
        },
      })
      .then((response) => {
        console.log("removed hotel data..", response.data);
        if(response.data.errorCode === 200){
          toasterMsg(SuccessMessage("Removed hotel successfully."))
          navigate('/adminHomepage')
        }else{
          toasterMsg(ErrorMessage(response.data.errorMessage))
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const closeConfrimModal = () => {
    setShowConfirmModal(false);
  };
  const closeAddHotelierModal = () => {
    setShowAddHotelierModa(false);
  };
  const addHotelier = () => {
    console.log(addedHotelier.current.value);
    axios
      .post(
        BASE_URL + "/AddHotelierToGroup",
        {
          email: addedHotelier.current.value,
          groupId: stateFromPrePage.hotelierGroup.id,
        },
        {
          headers: {
            Authorization: `Bearer ${getAdminInfo().token}`,
          },
        }
      )
      .then((response) => {
        console.log("Fetched Clients data..", response.data);
        if (response.data.errorCode === 200) {
          toasterMsg(SuccessMessage("Onboard hotelier successfully!"));
          navigate('/adminHomepage');
          addedHotelier.current.value = ''
          
        } else {
          toasterMsg(ErrorMessage(response.data.args));
        }
      })
      .catch((err) => {
        console.error(err);
      });
    setShowAddHotelierModa(false);
  };
  const removeHotelier = () => {
    axios
      .post(
        BASE_URL + "/RemoveHotelierFromGroup",
        {
          //@ts-ignore
          userId: removedHotelier.id,
          groupId: stateFromPrePage.hotelierGroup.id,
        },
        {
          headers: {
            Authorization: `Bearer ${getAdminInfo().token}`,
          },
        }
      )
      .then((response) => {
        console.log("Removed hotelier data..", response.data);
        if (response.data.errorCode === 200) {
          toasterMsg(SuccessMessage("Removed hotelier successfully!"));
          setShowConfirmModal(false);
          navigate("/adminhomepage");
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
        <Link style={{ textDecoration: "none" }} to="/adminhomepage">
          <NuNavTitle
            title={`${stateFromPrePage.hotelierGroup.name}`}
            showArrowBack={true}
          />
        </Link>
      </Header>
      <CardContainer>
        <NuDataTable
          type="hoteliers"
          addItem={() => setShowAddHotelierModa(true)}
          title="Hoteliers"
          data={stateFromPrePage.hotelierGroup.hotelierList}
          removeHotelierCheck={removeHotelierCheck}
        />
      </CardContainer>
      <CardContainer>
        <NuDataTable
          type="hotelsUnderGroup"
          hideToolbarButton={true}
          title="Hotels"
          data={stateFromPrePage.hotelierGroup.hotelList}
          removeHotelCheck={removeHotelCheck}
        />
      </CardContainer>
      <Modal open={showHotelConfirmModal} onClose={()=>setShowHotelConfirmModal(false)}>
        <Modal.Header>
          <Modal.Title>
            Are you sure you want to remove{" "}
            <b>
              { 
                removedHotel.name
              }?
            </b> 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body></Modal.Body>
        <Modal.Footer>
          <Button onClick={removeHotel}>Ok</Button>
          <Button onClick={()=>setShowHotelConfirmModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
      <Modal open={showConfirmModal} onClose={closeConfrimModal}>
        <Modal.Header>
          <Modal.Title>
            Are you sure you want to remove{" "}
            <b>
              { 
                removedHotelier.firstName
              }{" "}
            </b>
            from this group?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body></Modal.Body>
        <Modal.Footer>
          <Button onClick={removeHotelier}>Ok</Button>
          <Button onClick={closeConfrimModal}>Cancel</Button>
        </Modal.Footer>
      </Modal>
      <Modal open={showAddHotelierModal} onClose={closeAddHotelierModal}>
        <Modal.Header>
          <Modal.Title>Add a hotelier into a group.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Input
            placeholder="Hotelier email"
            ref={addedHotelier}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={addHotelier}>Ok</Button>
          <Button onClick={closeAddHotelierModal}>Cancel</Button>
        </Modal.Footer>
      </Modal>
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
const Header = styled.div`
  width: 80vw;
  height: 100px;
  align-self: center;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
