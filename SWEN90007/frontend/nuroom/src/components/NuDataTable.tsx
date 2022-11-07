import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import styled from "styled-components";
import Colors from "../constant/Colors";
import { TableCell, TableRow } from "@mui/material";
import React from "react";

const muiCache = createCache({
  key: "mui-datatables",
  prepend: true,
});

function MemoNuDataTable(props: any) {
  console.log("render NuDatatable");
  let navigate = useNavigate();
  let text = "";
  switch (props.type) {
    case "allUsers":
      text = "Onboard Hotelier";
      break;
    case "hotelierGroups":
      text = "Create Hotelier Group";
      break;
    case "allHotels":
      text = "Add Hotel";
      break;
    case "hoteliers":
      text = "Add hotelier";
      break;
    case "hotelsUnderGroup":
      text = "Create Hotel";
      break;
    case "rooms":
      text = "Create Room";
      break;
    default:
      break;
  }
  const HeaderElements = () => {
    return (
      <Button
        style={{ textTransform: "none" }}
        onClick={props.addItem}
        variant="contained"
        color="info"
      >
        {text}
      </Button>
    );
  };

  let columns: any[] = [
    {
      name: "#",
      label: "#",
      options: {
        filter: false,
        customBodyRender: (value: any, meta: any) => {
          return meta.rowIndex + 1;
        },
      },
    },
  ];
  switch (props.type) {
    case "allUsers":
      columns.push(
        {
          name: "firstName",
          label: "First Name",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "lastName",
          label: "Last Name",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "dateOfBirth",
          label: "Date of Birth",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "roleLevel",
          label: "Role",
          options: {
            filter: true,
            customBodyRender: (value: any, meta: any) => {
              switch (value) {
                case 1:
                  return "Customer";
                  break;
                case 2:
                  return "Hotelier";
                  break;
                default:
                  return "Customer";
              }
            },
          },
        },
        {
          name: "phoneNumber",
          label: "Phone Number",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "email",
          label: "Email",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        }
      );
      break;
    case "hotelierGroups":
      columns.push(
        {
          name: "id",
          label: "Id",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "name",
          label: "Group Name",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "hotelierList",
          label: "No. of Hoteliers",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value ? value.length : 0;
            },
          },
        },
        {
          name: "hotelList",
          label: "No. of Hotels",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value ? value.length : 0;
            },
          },
        },
        {
          name: "Action",
          options: {
            filter: false,
            customHeadLabelRender: () => <TableHeader>Action</TableHeader>,
            customBodyRenderLite: (dataIndex: any, rowIndex: any) => {
              return (
                <ViewBtn
                  style={{ textTransform: "none" }}
                  variant="contained"
                  onClick={() =>
                    navigate("/hotelierGroups", {
                      state: { hotelierGroup: props.data[dataIndex] },
                    })
                  }
                >
                  View
                </ViewBtn>
              );
            },
          },
        }
      );
      break;
    case "hoteliers":
      columns.push(
        {
          name: "id",
          label: "Id",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "firstName",
          label: "First Name",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "lastName",
          label: "Last Name",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "email",
          label: "Email",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "phoneNumber",
          label: "Phone Number",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "Action",
          options: {
            filter: false,
            customHeadLabelRender: () => <TableHeader>Action</TableHeader>,
            customBodyRenderLite: (dataIndex: any, rowIndex: any) => {
              return (
                <Button
                  color="error"
                  style={{ textTransform: "none" }}
                  variant="contained"
                  onClick={() =>
                    props.removeHotelierCheck(props.data[dataIndex])
                  }
                >
                  Remove
                </Button>
              );
            },
          },
        }
      );
      break;
    case "hotelsUnderGroup":
      columns.push(
        {
          name: "imageURL",
          label: "Picture",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return <img src={value} style={{ height: 40, width: 40,borderRadius:5 }} />;
            },
          },
        },
        {
          name: "name",
          label: "Hotel Name",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "hotelierGroupName",
          label: "Hotelier Group",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "country",
          label: "Country",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "state",
          label: "State",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "street",
          label: "Street",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "streetNo",
          label: "Street No.",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "postcode",
          label: "Postcode",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "isActive",
          label: "Status",
          options: {
            filter: true,
            customBodyRender: (value: any, meta: any) => {
              return value === 1 ? "Active" : "Inactive";
            },
          },
        }
      );
      if (props.roleLevel === 2) {
        columns.push({
          name: "Action",
          options: {
            filter: false,
            customHeadLabelRender: () => <TableHeader>Action</TableHeader>,
            customBodyRenderLite: (dataIndex: any, rowIndex: any) => {
              return (
                <Button
                  color="info"
                  style={{ textTransform: "none" }}
                  variant="contained"
                  onClick={() => props.navToHotels(props.data[dataIndex])}
                >
                  View
                </Button>
              );
            },
          },
        });
      } else {
        columns.push({
          name: "Action",
          options: {
            filter: false,
            customHeadLabelRender: () => <TableHeader>Action</TableHeader>,
            customBodyRenderLite: (dataIndex: any, rowIndex: any) => {
              return (
                <Button
                  color="error"
                  style={{ textTransform: "none" }}
                  variant="contained"
                  disabled={!props.data[dataIndex].isActive}
                  onClick={() => props.removeHotelCheck(props.data[dataIndex])}
                >
                  Remove
                </Button>
              );
            },
          },
        });
      }
      break;
    case "bookings":
      columns.push(
        {
          name: "id",
          label: "Id",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "hotel",
          label: "Picture",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return <img src={value ? value.imageURL :''} style={{ height: 40, width: 40,borderRadius:5}} />;
            },
          },
        },
        {
          name: "startDate",
          label: "Check-in Date",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return new Date(value).toISOString().substring(0, 10);
            },
          },
        },
        {
          name: "endDate",
          label: "Check-out Date",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return new Date(value).toISOString().substring(0, 10);
            },
          },
        },
        {
          name: "hotel",
          label: "Hotel",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value ? value.name : 'hotel name';
            },
          },
        },
        {
          name: "hotel",
          label: "Street No",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value ? value.streetNo : '';
            },
          },
        },
        {
          name: "totalNumGuest",
          label: "No. of Guests",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "status",
          label: "Status",
          options: {
            filter: true,
            customBodyRender: (value: any, meta: any) => {
              switch (value) {
                case "PENDING":
                  return (
                    <span style={{ color: "blue", fontWeight: "bold" }}>
                      Pending
                    </span>
                  );
                  break;
                case "COMPLETED":
                  return (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      Completed
                    </span>
                  );
                  break;
                case "CANCELLED":
                  return (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      Cancelled
                    </span>
                  );
                  break;
              }
            },
          },
        }
      );
      if (props.roleLevel !== 3) {
        columns.push({
          name: "Action",
          options: {
            filter: false,
            customHeadLabelRender: () => <TableHeader>Action</TableHeader>,
            customBodyRenderLite: (dataIndex: any, rowIndex: any) => {
              return props.isCustomer ? (
                <Button
                  color="error"
                  style={{ textTransform: "none" }}
                  variant="contained"
                  disabled={props.data[dataIndex].status !== "PENDING"}
                  onClick={(e) => {
                    e.stopPropagation();
                    props.modifyBookingCheck(props.data[dataIndex]);
                  }}
                >
                  Modify
                </Button>
              ) : (
                <Button
                  color="error"
                  style={{ textTransform: "none" }}
                  variant="contained"
                  disabled={props.data[dataIndex].status !== "PENDING"}
                  onClick={(e) => {
                    e.stopPropagation();
                    props.cancelBookingCheck(props.data[dataIndex]);
                  }}
                >
                  Cancel
                </Button>
              );
            },
          },
        });
      }
      break;
    case "rooms":
      columns.push(
        {
          name: "imageURL",
          label: "Picture",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return <img src={value} style={{ height: 40, width: 40,borderRadius:5 }} />;
            },
          },
        },
        {
          name: "roomType",
          label: "Room Type",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "description",
          label: "Description",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "numBathrooms",
          label: "Bathrooms",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "numBedrooms",
          label: "Bedrooms",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "numBeds",
          label: "Beds",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "quantity",
          label: "Quantity",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        },
        {
          name: "price",
          label: "Price",
          options: {
            filter: false,
            customBodyRender: (value: any, meta: any) => {
              return value;
            },
          },
        }
      );
      break;
    default:
      break;
  }

  let tableOptions = {
    selectableRows: "none",
    customToolbar: () => {
      return !props.hideToolbarButton && <HeaderElements />;
    },
  };
  if (props.type === "bookings") {
    let expandRowOptions = {
      expandableRows: true,
      expandableRowsHeader: true,
      expandableRowsOnClick: true,
      renderExpandableRow: (rowData: any, rowMeta: any) => {
        const colSpan = rowData.length + 1;
        return props.data[rowMeta.dataIndex].bookingRoomList.map(
          (item: any) => (
            <TableRow>
              <TableCell colSpan={colSpan}>
                Number of rooms: {item.numberOfRooms} / Room Type:
                {item.room.roomType} / Total Price:{" "}
                {item.numberOfRooms * item.room.price}
              </TableCell>
            </TableRow>
          )
        );
      },
      onRowExpansionChange: (
        curExpanded: any,
        allExpanded: any,
        rowsExpanded: any
      ) => console.log(curExpanded, allExpanded, rowsExpanded),
    };
    tableOptions = Object.assign(expandRowOptions, tableOptions);
  }
  return (
    <CacheProvider value={muiCache}>
      <MUIDataTable
        title={props.title}
        data={props.data}
        columns={columns}
        //@ts-ignore
        options={tableOptions}
      />
    </CacheProvider>
  );
}
const TableHeader = styled.div`
  font-weight: bolder;
`;
const ViewBtn = styled(Button)`
  color: ${Colors.white};
  background-color: ${Colors.primary};
  &:hover {
    background-color: ${Colors.primary};
  }
`;
const NuDataTable = React.memo(MemoNuDataTable);
export default NuDataTable;
