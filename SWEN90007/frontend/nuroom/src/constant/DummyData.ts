export const dummyAllUsers = [
  {
    id: "123",
    first_name: "Marvin",
    last_name: "Bai",
    role_type: "Hotelier",
    email: "zhongyib@student.unimelb.edu.au",
  },
  {
    id: "124",
    first_name: "Hernan",
    last_name: "Romano",
    role_type: "Hotelier",
    email: "zhongyib@student.unimelb.edu.au",
  },
  {
    id: "126",
    first_name: "Xiang",
    last_name: "Guo",
    role_type: "Customer",
    email: "zhongyib@student.unimelb.edu.au",
  },
  {
    id: "1233",
    first_name: "Gio",
    last_name: "Basrewan",
    role_type: "Customer",
    email: "zhongyib@student.unimelb.edu.au",
  },
];
export const dummyAllHotels = [
  {
    id: '123',
    hotel_name: 'Hotel name 1',
    hotelier_group_id: '1232',
    hotelier_group_name: 'Group name',
    number_of_rooms: 12,
    country: 'Australia',
    street: '1234 Swanston',
  },
  {
    id: '123',
    hotel_name: 'Hotel name 2',
    hotelier_group_id: '1232',
    hotelier_group_name: 'Group name',
    number_of_rooms: 12,
    country: 'Australia',
    street: '1234 Swanston',
  },
  {
    id: '123',
    hotel_name: 'Hotel name 3',
    hotelier_group_id: '1232',
    hotelier_group_name: 'Group name',
    number_of_rooms: 12,
    country: 'Australia',
    street: '1234 Swanston',
  }
]
export const dummyHotelierGroups = [
  {
    id:'123',
    group_name: 'Group 1',
    hotelier_list: dummyAllUsers,
    hotel_list: dummyAllHotels,
  },
  {
    id:'123',
    group_name: 'Group 2',
    hotelier_list: dummyAllUsers,
    hotel_list: dummyAllHotels,
  },
  {
    id:'123',
    group_name: 'Group 3',
    hotelier_list: dummyAllUsers,
    hotel_list: dummyAllHotels,
  }
]

export const dummyAllBookings = [
  {
    id:'123',
    start_date: '2022-02-03',
    end_date: '2022-02-11',
    rooms: [
      {
        id:'111',
        room_address:'123 Swanston',
        hotel: 'Hotel name',
      },
      {
        id:'111',
        room_address:'123 Swanston',
        hotel: 'Hotel name',
        
      },
      {
        id:'111',
        room_address:'123 Swanston',
        hotel: 'Hotel name',
        
      }
    ]
  }
]