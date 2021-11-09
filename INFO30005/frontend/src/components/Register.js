import React, { useState } from 'react';
import { loginUser, registerUser } from "../APIcustomer";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../libs/contextLib";

import RegisterIcon from '../icons/id.svg';
import { Button, TextField, Grid } from '@material-ui/core';

// The contents of a registration pop up

const Register = (props) => {
	const history = useHistory();

	const { userHasAuthenticated } = useAppContext();
	const { vendorHasAuthenticated } = useAppContext();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fName, setFName] = useState("");
	const [lName, setLName] = useState("");

	const [isShort, setIsShort] = useState(true);
	const [noLetter, setNoLetter] = useState(true);
	const [noNumber, setNoNumber] = useState(true);

	function validateForm() {
		return (validatePassword() && email.length > 0 && password.length > 0 && fName.length > 0 && lName.length > 0);
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

	// submit form
	async function handleSubmit(event) {
		event.preventDefault();
		let attemptCreate = await registerUser({ email: email, password: password, firstName: fName, lastName: lName });
		// using API function to submit data to FoodBuddy API
		if (attemptCreate) {
			console.log("Create was true");
			let attemptLogin = await loginUser({ email: email, password: password });
			if (attemptLogin) {
				userHasAuthenticated(true);
				// store the user in localStorage
				localStorage.setItem('user', JSON.stringify(attemptLogin));

				// can't be both
				vendorHasAuthenticated(false);
				localStorage.removeItem("vendor");

				console.log("Registration successful");
				props.onLogin();
			}
		}
	}

	return (
		<>
			<div  className="general main card">
				<form onSubmit={handleSubmit}>
					<Grid container direction={"column"} spacing={3}>
						<Grid item>
							<div  className="title">
								<div  className="Icon"><img height="80px" src={RegisterIcon} alt="Register" /></div>
								<div  className="PageTitle"><h1>Register</h1></div>
							</div>
						</Grid>
						<Grid item>
							<TextField
								required
								type="text"
								name="fName"
								onChange={(e) => setFName(e.target.value)}
								variant="outlined"
								label="First Name"
								fullWidth />
						</Grid>
						<Grid item>
							<TextField
								required
								type="text"
								name="lName"
								onChange={(e) => setLName(e.target.value)}
								variant="outlined"
								label="Last Name"
								fullWidth />
						</Grid>
						<Grid item>
							<TextField
								required
								type="text"
								name="email"
								onChange={e => setEmail(e.target.value)}
								variant="outlined"
								label="Email"
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
								type="submit"
								disabled={(!validateForm())}
								variant="contained"
								color='secondary'>
								Sign up
							</Button>
						</Grid>
					</Grid>
				</form>
			</div>
		</>
	)
};

export default Register;