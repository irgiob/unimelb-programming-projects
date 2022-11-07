import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import axios from "axios";
import NuNavTitle from "../../components/NuNavTitle";
import { BASE_URL } from "../../constant/Endpoints";
import NuDataTable from "../../components/NuDataTable";
import { Input, Modal } from "rsuite";
import { getAdminInfo, toasterMsg } from "../../services/utils";
import { ErrorMessage, SuccessMessage } from "../../components/NuMessage";

export default function AdminHotels() {
  let navigate = useNavigate();
  let location = useLocation();
  let stateFromPrePage: { hotelierGroup: any } = location.state as {
    hotelierGroup: any;
  };
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [removedHotel, setRemovedHotel] = useState<any>({});
  const [allHotels, setAllHotels] = useState([]);

  useEffect(() => {
    if (getAdminInfo().roleLevel !== undefined) {
      getHotels();
    } else {
      navigate("/adminlogin");
    }
  }, []);
  const closeConfrimModal = () => {
    setShowConfirmModal(false);
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
          getHotels()
        }else{
          toasterMsg(ErrorMessage(response.data.errorMessage))
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getHotels = () => {
    axios
      .get(BASE_URL + "/ViewAllHotels", {
        headers: {
          Authorization: `Bearer ${getAdminInfo().token}`,
        },
      })
      .then((response) => {
        console.log("Fetched Clients data..", response.data);
        if (response.data.errorCode === 200) {
          setAllHotels(response.data.args);
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
        <Link style={{ textDecoration: "none" }} to="/adminhomepage">
          <NuNavTitle title={`All Hotels`} showArrowBack={true} />
        </Link>
      </Header>
      <CardContainer>
        <NuDataTable
          type="hotelsUnderGroup"
          hideToolbarButton={true}
          title="Hotels"
          data={allHotels}
          removeHotelCheck={removeHotelCheck}
        />
      </CardContainer>
      <Modal open={showConfirmModal} onClose={closeConfrimModal}>
        <Modal.Header>
          <Modal.Title>
            Are you sure you want to remove this hotel from listing?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Hotel Name:{" "}
          {
            //@ts-ignore
            removedHotel.name
          }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={removeHotel}>Ok</Button>
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
