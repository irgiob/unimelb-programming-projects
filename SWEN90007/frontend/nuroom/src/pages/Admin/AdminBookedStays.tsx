import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import axios from "axios";
import NuNavTitle from "../../components/NuNavTitle";
import { BASE_URL } from "../../constant/Endpoints";
import NuDataTable from "../../components/NuDataTable";
import { dummyAllBookings } from "../../constant/DummyData";
import { Input, Modal } from "rsuite";
import { getAdminInfo } from "../../services/utils";

export default function AdminBookedStays() {
  let navigate = useNavigate();
  let location = useLocation();
  let stateFromPrePage: { hotelierGroup: any } = location.state as {
    hotelierGroup: any;
  };
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAddHotelierModal, setShowAddHotelierModa] = useState(false);
  const [addedHotelier, setAddedHotelier] = useState("");
  const [removedHotelier, setRemovedHotelier] = useState({});
  const [allBookings, setAllBookings] = useState([]);
  useEffect(() => {
    if (getAdminInfo().roleLevel !== undefined) {
      getBookings();
    } else {
      navigate("/adminlogin");
    }
  }, []);
  const getBookings = () => {
    axios
      .get(BASE_URL + "/ViewAllBookedStays", {
        headers: {
          Authorization: `Bearer ${getAdminInfo().token}`,
        },
      })
      .then((response) => {
        console.log("Fetched Clients data..", response.data);
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
  const closeAddHotelierModal = () => {
    setShowAddHotelierModa(false);
  };
  const addHotelier = () => {
    console.log(addedHotelier);
    setShowAddHotelierModa(false);
  };
  const removeHotelier = () => {
    setShowConfirmModal(false);
  };

  return (
    <MainContainer>
      <Header>
        <Link style={{ textDecoration: "none" }} to="/adminhomepage">
          <NuNavTitle title={`All Booked Stays`} showArrowBack={true} />
        </Link>
      </Header>
      <CardContainer>
        <NuDataTable
          type="bookings"
          hideToolbarButton={true} 
          title="All booked stays"
          data={allBookings} 
        />
      </CardContainer>

      <Modal open={showConfirmModal} onClose={closeConfrimModal}>
        <Modal.Header>
          <Modal.Title>
            Are you sure you want to remove{" "}
            {
              //@ts-ignore
              removedHotelier.first_name
            }{" "}
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
            value={addedHotelier}
            onChange={(val: string) => setAddedHotelier(val)}
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
  height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: center;
`;
