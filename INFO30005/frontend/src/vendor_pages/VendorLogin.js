import React, { useState } from "react";
import { loginVendor, registerVendor } from "../APIvendor";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../libs/contextLib";
import { Grid, TextField, Button } from "@material-ui/core"


// A login box for vendors which can double as a registration box if passed a 'registering' boolean
export default function VendorLogin(props) {
    const history = useHistory();

    const { vendorHasAuthenticated } = useAppContext();
    const { userHasAuthenticated } = useAppContext();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const [isShort, setIsShort] = useState(true);
	const [noLetter, setNoLetter] = useState(true);
	const [noNumber, setNoNumber] = useState(true);

    // We definitely want something in each field before we allow a login request
    function validateFormOnLogin() {
        return name.length > 0 && password.length > 0;
    }

    // We definitely want something in each field before we allow a login request
    function validateFormOnRegister() {
        return (validatePassword() && name.length > 0 && password.length > 0);
    }

    // Submits the form to the API (either registering or login based on props)
    async function handleSubmit(event) {
        event.preventDefault();
        let attempt = false;

        if (props.registering) {
            attempt = await registerVendor({ vanName: name, password: password });
        }
        else {
            attempt = await loginVendor({ vanName: name, password: password });
        }

        if (attempt) {
            vendorHasAuthenticated(true);
            // store the user in localStorage
            localStorage.setItem('vendor', JSON.stringify(name));

            // can't be both vendor and customer so clear that stuff just in case
            userHasAuthenticated(false);
            localStorage.removeItem("user");

            history.push("/vendor/");
            props.onClose();
        }
    }
    
    // We ensure a degree of security with the passwords by enforcing some simple rules
	function validatePassword(){
		var short = false;
		var foundALetter = false;
		var foundANumber = false;
		var i = password.length;

		// Password must be longer than 8 chars
		if (i < 8){
			short = true;
		}

		// Password must have at least one number and at least one letter
		while (i--) {
			if((/[a-zA-Z]/).test(password[i])){
				foundALetter = true;
			}
			if((/\d/).test(password[i])){
				foundANumber = true;
			}
		}

		// We need the state variables to display tips for password strength
		if(isShort !== short){
			setIsShort(short);
		}
		if(noLetter === foundALetter){
			setNoLetter(!foundALetter);
		} 
		if(noNumber === foundANumber){
			setNoNumber(!foundANumber);
		}
		 
		// Only if all three rules are fulfilled will this return true
		return (foundALetter && foundANumber && !short);
	}

    // reusing the order popup box style
    return (
        <>
            <div className="general main card">
                {props.registering ?
                    <div  className='center'>
                        <h1>Register a Van</h1>
                    </div> :
                    <div  className='center'>
						<h1>Log in</h1>
					</div>}
                <form onSubmit={handleSubmit}>
                    <Grid container  className='center' direction={"column"} spacing={3}>
                        <Grid item>
                            <TextField
                                required
                                type="text"
                                name="name"
                                label="Van Name"
                                onChange={(e) => setName(e.target.value)}
                                variant="outlined"
                                fullWidth />
                        </Grid>
                        <Grid item>
                            <TextField
                                required
                                type="password"
                                name="password"
                                onChange={(e) => setPassword(e.target.value)}
                                variant="outlined"
                                label="Password"
                                fullWidth />
                        </Grid>
                        {props.registering &&
                        <Grid item>
                        <ol>
                            {isShort &&
                                <li>
                                    <p>Password must be 8 characters</p>
                                </li>
                            }
                            {noNumber &&
                                <li>
                                    <p>Password must contain a number (0-9)</p>
                                </li>
                            }
                            {noLetter &&
                                <li>
                                    <p>Password must contain an alphabet character</p>
                                </li>
                            }
                        </ol>
                        </Grid>
                        }
                        <Grid item>
                            {props.registering ?
                            <Button
                                type="submit"
                                disabled={!validateFormOnRegister()}
                                variant="contained"
                                color="secondary" >
                                Register
                            </Button>
                            :
                            <Button
                                type="submit"
                                disabled={!validateFormOnLogin()}
                                variant="contained"
                                color="secondary" >
                                Login
                            </Button>
                            }
                        </Grid>
                    </Grid>
                </form>
            </div>
        </>
    );
};