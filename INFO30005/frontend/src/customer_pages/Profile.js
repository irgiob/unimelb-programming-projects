import React, { useState, useEffect } from 'react';
import { useAppContext } from "../libs/contextLib";
import { useHistory } from "react-router-dom";
import { updateUser } from '../APIcustomer';
import DialogBox from '../components/DialogBox';
import { Grid, Button, TextField } from '@material-ui/core';

import Logo from '../icons/Logo.svg';
import AuthorIcon from '../icons/author.svg';

// The profile page lets a user change their name or password

export default function Profile() {
    const history = useHistory()
    const { isAuthenticated } = useAppContext();
    const user = JSON.parse(localStorage.getItem("user"));
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);

    const [password, setPassword] = useState("");
    const [passwordPopup, setPasswordPopup] = useState(false);

    const [isShort, setIsShort] = useState(true);
	const [noLetter, setNoLetter] = useState(true);
	const [noNumber, setNoNumber] = useState(true);

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

	// Sends a new name to the server
    const updateName = async (event) => {
        event.preventDefault();
        const body = {};
        if (firstName !== user.firstName)
            body.newFirstName = firstName;
        if (lastName !== user.lastName)
            body.newLastName = lastName;

        let attempt = await updateUser(body);
        // using API function to submit data to FoodBuddy API
        if (attempt) {
            // update the user in localStorage
            localStorage.setItem('user', JSON.stringify(attempt));
            console.log("Update successful");
            history.go(0)
        }
    }

	// Sends a new password to the server
    const updatePassword = async (event) => {
        event.preventDefault();

        let attempt = await updateUser({ newPassword: password });
        // using API function to submit data to FoodBuddy API
        if (attempt) {
            // update the user in localStorage
            localStorage.setItem('user', JSON.stringify(attempt));
            console.log("Update successful");
            history.go(0)
        }
    }

    return <>
        <DialogBox open={passwordPopup} onClose={() => setPasswordPopup(false)}>
            <div  className="general main card">
                <Grid container direction={"column"} spacing={3}>
                    <Grid item>
                        <div  className="title">
                            <div  className="PageTitle"><h1>Change Password</h1></div>
                        </div>
                    </Grid>
                    <Grid item>
                        <TextField
                            required
                            type="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            variant="outlined"
                            label="New Password"
                            fullWidth />
                    </Grid>
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
                    <Grid item>
                        <Button
                            disabled={!validatePassword()}
                            onClick={updatePassword}
                            variant="contained"
                            color="secondary">
                            Change Password
							</Button>
                    </Grid>
                </Grid>
            </div>
        </DialogBox>
		
		<div id="desktop"  className="profile-container">
			<div  className="Home header">
				<a href="/"><img height="110px" src={Logo} alt="Logo" /></a>
				<div  className="card">
					<div  className="title">
						<div  className="Icon"><img height="70px" src={AuthorIcon} /></div>
						<div  className="PageTitle">
							<div><h2>Profile Page</h2></div>
						</div>
					</div>
				</div>
			</div>
			
			<div  className='Home right-container card'>
				{isAuthenticated &&
				<div  className='form-container'>
				<Grid container direction={"column"} spacing={4}>
					<Grid item>
						<h2>Update Profile</h2>
					</Grid>
					<Grid item>
						<TextField
							type="text"
							onChange={(e) => setFirstName(e.target.value)}
							variant="standard"
							color="primary"
							label="First Name"
							defaultValue={firstName}
							fullWidth
							/>
					</Grid>
					<Grid item>
						<TextField
							type="text"
							onChange={(e) => setLastName(e.target.value)}
							variant="standard"
							color="primary"
							label="Last Name"
							defaultValue={lastName} 
							fullWidth/>
					</Grid>
					<Grid item>
						<TextField
							disabled
							type="text"
							variant="standard"
							color="primary"
							label="Email Name"
							defaultValue={user.email} 
							fullWidth/>
					</Grid>
					<Grid item>
					<Grid container direction={"row"} spacing={4}>
						<Grid item>
							<Button
								variant='contained'
								color='secondary'
								onClick={updateName}>
								Update Name
							</Button>
						</Grid>
						<Grid item>
							<Button
								variant='contained'
								color='secondary'
								onClick={() => setPasswordPopup(true)}>
								Change Password
							</Button>
						</Grid>
					</Grid>
					</Grid>
					
				</Grid>

				</div>
				}
			</div>
		</div>

        <div id="mobile">
            {isAuthenticated &&
                <>
				<div  className="adjHeight title">
					<div  className="Icon"><img height="70px" src={AuthorIcon} /></div>
					<div  className="PageTitle">
						<div><h2>Profile Page</h2></div>
					</div>
				</div>
                    
				<div  className='general main card'>
				{isAuthenticated &&
				<div  className='form-container'>
					<Grid container direction={"column"} spacing={4}>
						<Grid item>
							<h2>Update Profile</h2>
						</Grid>
						<Grid item>
							<TextField
								type="text"
								onChange={(e) => setFirstName(e.target.value)}
								variant="standard"
								color="primary"
								label="First Name"
								defaultValue={firstName}
								fullWidth
								/>
						</Grid>
						<Grid item>
							<TextField
								type="text"
								onChange={(e) => setLastName(e.target.value)}
								variant="standard"
								color="primary"
								label="Last Name"
								defaultValue={lastName} 
								fullWidth/>
						</Grid>
						<Grid item>
							<TextField
								disabled
								type="text"
								variant="standard"
								color="primary"
								label="Email Name"
								defaultValue={user.email} 
								fullWidth/>
						</Grid>
						<Grid item>
						<div  className='buttons'>
							<div><Button variant='contained' color='secondary'
								onClick={updateName}>Update Name</Button></div>
							<div><Button variant='contained' color='secondary'
								onClick={() => setPasswordPopup(true)}>Change Password</Button></div>
						</div>
					</Grid>
					
				</Grid>

				</div>
				}
			</div>

                </>
            }
        </div>
    </>;



}