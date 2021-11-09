/* 
https://www.digitalocean.com/community/tutorials/how-to-integrate-the-google-maps-api-into-react-applications 
*/

import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
    width: '100%',
    height: '100%',
    borderRadius: '25px',
};

// Similar to the user's map but for vendors, only gets your current location and displays

class MapContainerLocationPicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userLat: 0, userLong: 0,  //Van position
            locationFound: false
        };
        this.setCurrentLocation = this.setCurrentLocation.bind(this);
    }

    async setCurrentLocation(pos) {
        this.setState({ userLat: pos.coords.latitude });
        this.setState({ userLong: pos.coords.longitude });
        this.setState({ locationFound: true });
        this.props.updatePosition([pos.coords.latitude, pos.coords.longitude]);
    }

    // Runs when the map is loaded - get the user's location
    async componentDidMount() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(await this.setCurrentLocation);
        }
        else {
            alert("Please enable location sharing with this device")
        }
    }

    // We don't want the marker to re-render every time the state changes because it flicks off for a frame
    shouldComponentUpdate() {
        return !this.state.locationFound;
    }

    render() {
        return (
            <Map
                google={this.props.google}
                zoom={14}
                style={mapStyles}
                initialCenter={{ lat: -37.8150, lng: -215.0450 }} // Melbourne CBD - just nicer than the default first render being in San Francisco
                center={{ lat: this.state.userLat, lng: this.state.userLong }}
            >
                <Marker position={{ lat: this.state.userLat, lng: this.state.userLong }}></Marker>
            </Map>
        );
    }
};

// this is Sam's key, should be fine because this repository is private
export default withRouter(GoogleApiWrapper({ apiKey: 'AIzaSyDn4NQVVcD0LCI6yGV3Rv2Y0emzPQtSNhs' })(MapContainerLocationPicker));