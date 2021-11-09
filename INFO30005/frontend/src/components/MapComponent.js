import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

import { getAllVans, getRating } from '../APIcustomer';
import haversine from 'haversine-distance'; // Euclidian distance formula on a sphere (Earth)
import { Button, Box } from "@material-ui/core";
import { Rating } from '@material-ui/lab'
import DialogBox from "../components/DialogBox";

import LocationIcon from '../icons/location.svg';

const NUM_VANS_SHOWN = 5;

const mapStyles = {
  borderRadius: '25px',
  width: '100%',
  height: '100%',
};

// The map container uses google-maps-react to let users pick a van from the 5 closest options

class MapContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showingPopup: false,  // Hides or shows the InfoWindow
      activeMarker: {},          // Shows the active marker upon click
      selectedVan: {},         // Shows the InfoWindow to the selected place upon a marker
      markers: [],               // All the markers to be displayed on the map
      userLat: 0,
      userLong: 0,
      rollingRating: 0
    };
    this.goToThisVan = this.goToThisVan.bind(this);
    this.setCurrentLocation = this.setCurrentLocation.bind(this);
  }

  // marker clicks and closes
  onMarkerClick = async(props, marker, e) => {
    // Rating isn't attatched the van by default, we have to go get em
    let ratings = await getRating(props._id);
    let meanRate = 0;
    let count = 0;
    let buildup = 0;
    if(ratings.length > 0){
      ratings.forEach(rating => {
        buildup += rating.rating;
        count++;
      })
      meanRate = (buildup / count).toFixed(2);
      console.log(meanRate);
    }
    // Mean rate set to zero by default so it isn't technically a misrepresentation
    else{
      meanRate = 0;
    }
    this.setState({
      selectedVan: props,
      activeMarker: marker,
      showingPopup: true,
      rollingRating: meanRate
    });
  };
  
  onClose = props => {
    if (this.state.showingPopup) {
      this.setState({
        showingPopup: false,
        activeMarker: null
      });
    }
  };


  // Sets the user's location
  async setCurrentLocation(pos) {
    this.setState({ userLat: pos.coords.latitude });
    this.setState({ userLong: pos.coords.longitude });
  }

  // Runs when the map is loaded - gets the vans from the backend - get the user's location
  async componentDidMount() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(await this.setCurrentLocation);
      console.log("Using current location");
    }
    else {
      this.setState({ userLat: -37.8150 });     //Melbourne CBD by default
      this.setState({ userLong: -215.0450 });
    }

    let vans = await getAllVans();
    let userAt = { latitude: this.state.userLat, longitude: this.state.userLong };

    vans.forEach(van => {
      if (van.geolocation !== null) {
        if (van.geolocation.length === 2) {
          let vanAt = { latitude: van.geolocation[0], longitude: van.geolocation[1] };
          // Use the haversine formula to get distance in meters to each van
          van.distance = haversine(userAt, vanAt);
        }
        else {
          van.status = "CLOSED";
        }
      }
      else {
        van.status = "CLOSED";
      }
    });
    this.setState({ markers: vans });
  }

  // Takes the vans we got from the backend and turns them into markers on the map,
  // I'm just assigning the important bits of the van's information to properties of the marker.

  // Note here we also pick out a set number of closest vans to display
  displayMarkers = () => {
    let vans = [...this.state.markers] // shallow copy
    vans = vans.filter(van => van.status === "OPEN"); // Only open vans should be shown
    let closestVans = vans.sort((a, b) => a.distance - b.distance).slice(0, NUM_VANS_SHOWN);
    
    return closestVans.map(marker => (
      <Marker
        key={marker._id}
        _id={marker._id}
        icon={LocationIcon}
        position={{ lat: marker.geolocation[0], lng: marker.geolocation[1] }}
        onClick={this.onMarkerClick}
        name={marker.vendorName}
        description={marker.locationDescription}
        distance={(marker.distance / 1000).toFixed(2)}
        />
    ));
  }

  // When you pick a marker that 'van's information gets saved and you move to menu
  goToThisVan() {
    localStorage.setItem('currentVanName', JSON.stringify(this.state.selectedVan.name));
    this.props.history.push("/menu");
  };

  render() {
    return (
      <Map
        google={this.props.google}
        zoom={12}
        style={mapStyles}
        initialCenter={{ lat: -37.8150, lng: -215.0450 }} // Melbourne CBD
        center={{ lat: this.state.userLat, lng: this.state.userLong }} 
      >
        <Marker position={{ lat: this.state.userLat, lng: this.state.userLong }} />

        {this.displayMarkers()}

        <DialogBox open={this.state.showingPopup} onClose={this.onClose}>
          <div  className="VanPopUp">
            <div><h3>{this.state.selectedVan.name}</h3></div>
            <div  className="address">
              <div><img src={LocationIcon} height="30px" /></div>
              <div><p>Distance: {this.state.selectedVan.distance} km</p></div>
            </div>
            <Box component="fieldset" borderColor="transparent">
				<Rating precision={0.25} value={this.state.rollingRating} readOnly />
			</Box>
            <div>
              <Button
                size='small'
                variant="contained"
                color='secondary'
                onClick={this.goToThisVan}>
                Order from {this.state.selectedVan.name}
              </Button>
            </div>

          </div>
        </DialogBox>
      </Map>
    );
  }
}

// this is Sam's key, should be fine for now because this repository is private
// the component is still called MapPage (not GoogleApiWrapper)
export default withRouter(GoogleApiWrapper({ apiKey: 'AIzaSyDn4NQVVcD0LCI6yGV3Rv2Y0emzPQtSNhs' })(MapContainer));