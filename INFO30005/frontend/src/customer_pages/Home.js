import "../App.css";
import React, { useState } from 'react';

import { useAppContext } from "../libs/contextLib";
import { useOrders } from "../APIcustomer";

import MapComponent from '../components/MapComponent';
import DialogBox from '../components/DialogBox';
import Login from '../components/Login';
import Register from '../components/Register';

import { Button } from "@material-ui/core";
import LoginIcon from '../icons/login.svg';
import Logo from '../icons/Logo.svg';
import QAIcon from '../icons/q&a.svg';

// Home is the landing page for a user where they pick a van to order from

const Home = () => {
	const { isAuthenticated } = useAppContext();

	const [loginPopup, setLoginPopup] = useState(false);
	const [registerPopup, setRegisterPopup] = useState(false);

	// This page handles logins with popups
	const onClickLogin = () => setLoginPopup(true);
	const onRegisterRequest = () => {
		setLoginPopup(false);
		setRegisterPopup(true);
	};

	const onClose = () => {
		setLoginPopup(false);
		setRegisterPopup(false);
	};

	const { loading, orders, error } = useOrders();
	let order = orders[0];

	return <>
		<DialogBox open={loginPopup} onClose={onClose}>
			<Login
				onLogin={onClose}
				onRegisterRequest={onRegisterRequest} />
		</DialogBox>
		<DialogBox open={registerPopup} onClose={onClose}>
			<Register onLogin={onClose} />
		</DialogBox>
		<div id="desktop" class="main-container">
			<div class="Home header">
				{isAuthenticated ?
						<>
						<img height="110px" src={Logo} alt="Logo" />
						<div class="Home header card">
							<div class="col1">
								<div><img height="60px" src={LoginIcon} alt="Login" /></div>
							</div>
							<div class="col2">
								<h3>Select a van on the map or view your order history</h3>
							</div>
							<div class="col3">
								<div><Button href='/past-orders' variant='contained' color='secondary'>
									View Past Orders
									</Button>
								</div>
							</div>
						</div>
						</>
						:
						(
						<>
						<img height="110px" src={Logo} alt="Logo" />
						<div class="card">
							<div class="col1">
								<div><img height="60px" src={LoginIcon} alt="Login" /></div>
							</div>
							<div class="col2">
								<h3>Welcome to Snacks in a Van!</h3>
								<h3>Please Log in to place an order</h3>
							</div>
							<div class="col3">
								<div><Button onClick={onClickLogin} variant='contained' color='secondary'>
									Log in
									</Button>
								</div>
							</div>
						</div>
						</>)
					}

			</div>

			<div id="map" class="Home main card">
				<MapComponent />
			</div>

		</div>
		<div class="Home right-container">
			<div class="about-us card">
				<div class='center'>
				<img height='60px' src={QAIcon} />
				<h2>Who are we?</h2>
				<p>Snacks in a Van is a new start up company operating in Melbourne.
				We run a fleet of food trucks that work as popup cafes. Around 100 of 
				our vans are spreaded throughout the city.</p>
				<h2>Our Vendors</h2>
				<p>Our vendors drive around Melbourne, parking wherever they think there are customers.
					They have no fixed schedule and are mobile and flexible.</p>
				<h2>Why us?</h2>
				<p>Our app allows you to find the van closest to you no matter where you
					are. To save time, registered customers are also able to order their 
					snacks in advance of arriving at the van.</p>
				</div>
			</div>
		</div>

		<div id="mobile">
			<div class="map"><MapComponent /></div>
		</div>
	</>
};

export default Home;