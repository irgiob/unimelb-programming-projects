import React, { useState } from "react";
import MapContainerLocationPicker from "../components/LocationPicker";
import { useAppContext } from "../libs/contextLib";
import { useHistory } from "react-router-dom";
import Logo from "../icons/Logo.svg";
import { openForBusiness } from "../APIvendor";
import VendorLogin from "./VendorLogin";
import DialogBox from "../components/DialogBox";
import { Button, TextField } from "@material-ui/core";

// The landing page for vendors where they can confirm their location to open for business

export default function VendorHome() {
    const history = useHistory();
    const { vendorAuthenticated } = useAppContext();
    const { vendorHasAuthenticated } = useAppContext();

    const [description, setDescription] = useState("");          //Optional text 
    const [geolocation, setGeolocation] = useState([]);

    const [loginPopup, setLoginPopup] = useState(false);
    const [registerPopup, setRegisterPopup] = useState(false);

    // closes the login popup form
    const onClose = () => {
        setLoginPopup(false);
        setRegisterPopup(false);
    };

    // logs out the vendor
    async function closeAndLogOut() {
        vendorHasAuthenticated(false);
        localStorage.clear();
        history.push("/vendor");
    }

    // Sets the location of the van and changes it's status to 'OPEN' using the openForBusiness endpoint
    async function handleSubmit(event) {
        event.preventDefault();
        if (geolocation.length !== 2) {
            alert("Your location is not available - please allow your browser to access location");
            return;
        }
        if (await openForBusiness(description, geolocation)) {
            history.push("/vendor/manage-orders");
        }
        else {
            alert("Something went wrong setting your status");
        }
    }

    return <>
        <DialogBox open={loginPopup || registerPopup} onClose={onClose}>
            <VendorLogin registering={registerPopup} onClose={onClose} />
        </DialogBox>
        <div id="desktop"  className="main-container">
            {vendorAuthenticated ?
                <div id="map"  className="home main card">
                    <MapContainerLocationPicker updatePosition={setGeolocation} />
                    <div  className="overlay dimmed">&nbsp;</div>
                    <div  className="overlay map">
                        <h3>Van Setup</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <TextField
                                    required
                                    type="text"
                                    name="description"
                                    onChange={(e) => setDescription(e.target.value)}
                                    variant="filled"
                                    color="secondary"
                                    label="Additional description of your location"
                                    fullWidth />
                            </div>
                            <p></p>
                            <Button
                                variant='contained'
                                color='secondary'
                                type="submit">
                                Open for business!
                            </Button>
                            <div style={{ width: "10px", height: "auto", display: "inline-block" }} />
                            <Button
                                variant='contained'
                                color='secondary'
                                onClick={() => closeAndLogOut()}>
                                Close and log out
                            </Button>
                        </form>
                    </div>
                </div>
                :
                <div  className="general main card centered column">
                    <img height="150px" src={Logo} alt="Logo" />
                    <h1>Welcome, vendor.</h1>
                    <p>You must log in to a van to set it's location</p>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setLoginPopup(true)}>
                        Log in to existing account
                        </Button>
                    <div style={{ height: "10px", width: "auto", display: "inline-block" }} />
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setRegisterPopup(true)}>
                        Register a new Van
                    </Button>
                </div>
            }
        </div>

        <div id="mobile">
            {vendorAuthenticated ?
                <div  className="map">
                    <MapContainerLocationPicker updatePosition={setGeolocation} />
                    <div  className="overlay dimmed">&nbsp;</div>
                    <div  className="overlay map">
                        <h3>Van Setup</h3>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                required
                                type="text"
                                name="description"
                                onChange={(e) => setDescription(e.target.value)}
                                variant="filled"
                                color="secondary"
                                label="Additional description of your location"
                                fullWidth />
                            <p></p>
                            <Button
                                variant='contained'
                                color='secondary'
                                type="submit">
                                Open for business!
                            </Button>
                            <p></p>
                            <Button
                                variant='contained'
                                color='secondary'
                                onClick={() => closeAndLogOut()}>
                                Close and log out
                            </Button>
                        </form>
                    </div>
                </div>
                :
                <div  className="general main card">
                    <div  className="centered column">
                        <img height="150px" src={Logo} alt="Logo" />
                        <h1>Welcome, vendor.</h1>
                        <p>You must log in to a van to set it's location</p>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setLoginPopup(true)}>
                            Log in to existing account
                        </Button>
                        <div style={{ height: "10px", width: "auto", display: "inline-block" }} />
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setRegisterPopup(true)}>
                            Register a new van
                    </Button>
                    </div>
                </div>
            }
        </div>
    </>;
}