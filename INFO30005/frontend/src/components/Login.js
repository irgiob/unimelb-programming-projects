import React, { useState } from 'react';
import { loginUser } from "../APIcustomer";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../libs/contextLib";

import LoginIcon from '../icons/login.svg';
import { Link } from 'react-router-dom';
import { Button, TextField, Grid } from '@material-ui/core';

// The contents of the login pop up

const Login = (props) => {
	const history = useHistory();

	const { userHasAuthenticated } = useAppContext();
	const { vendorHasAuthenticated } = useAppContext();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// You gotta write something!
	function validateForm() {
		return email.length > 0 && password.length > 0;
	}

	// submit form
	async function handleSubmit(event) {
		event.preventDefault();
		let attempt = await loginUser({ email: email, password: password });
		// using API function to submit data to FoodBuddy API
		if (attempt) {
			userHasAuthenticated(true);
			// store the user in localStorage
			localStorage.setItem('user', JSON.stringify(attempt));

			// can't be both
			vendorHasAuthenticated(false);
			localStorage.removeItem("vendor");
			props.onLogin();
		}
	}

	return (
		<>
			<div  className="general main card">
				<form onSubmit={handleSubmit}>
					<Grid container direction={"column"} spacing={3}>
						<Grid item>
							<div  className="title">
								<div  className="Icon"><img height="80px" src={LoginIcon} alt="Login" /></div>
								<div  className="PageTitle"><h1>Log In</h1></div>
							</div>
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
							<Button
								type="sumbit"
								disabled={!validateForm()}
								variant="contained"
								color="secondary">
								Log In
							</Button>
						</Grid>
						<Grid item>
							<Link onClick={props.onRegisterRequest}>No profile? Sign Up Here</Link>
						</Grid>
					</Grid>
				</form>
			</div>
		</>
	)
};

export default Login;