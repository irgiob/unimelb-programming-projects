import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { useAppContext } from "../libs/contextLib";
import { Link } from 'react-router-dom';

import "../App.css";
import DialogBox from '../components/DialogBox';
import Login from './Login';
import Register from './Register';

import { Button, IconButton } from '@material-ui/core';
import HomeIcon from '../icons/house.svg';
import ListIcon from '../icons/tasks.svg';
import ProfileIcon from '../icons/author.svg';

// The navigation bar

const Sidebar = () => {
	const { isAuthenticated } = useAppContext();
	const { userHasAuthenticated } = useAppContext();

	const history = useHistory();

	const [loginPopup, setLoginPopup] = useState(false);
	const [registerPopup, setRegisterPopup] = useState(false);

	const onClickLogin = () => setLoginPopup(true);
	const onClickRegister = () => setRegisterPopup(true);
	const onRegisterRequest = () => {
		setLoginPopup(false);
		setRegisterPopup(true);
	};

	const onClose = () => {
		setLoginPopup(false);
		setRegisterPopup(false);
	};
	function handleLogout() {
		userHasAuthenticated(false);
		localStorage.clear();
		history.push("/");
	}

	return (
		<>
			<DialogBox open={loginPopup} onClose={onClose}>
				<Login
					onLogin={onClose}
					onRegisterRequest={onRegisterRequest} />
			</DialogBox>
			<DialogBox open={registerPopup} onClose={onClose}>
				<Register onLogin={onClose} />
			</DialogBox>
			<div  className="Sidebar">
				<div  className="menuItems">
					{isAuthenticated ?
						<div>
							<Button onClick={handleLogout}>
								Log Out
						</Button>
							<IconButton size="large">
								<Link to="/profile"><img height="40px" src={ProfileIcon} alt="Profile" /></Link>
							</IconButton>
						</div>
						:
						(<div>
							<Button onClick={onClickRegister}>Sign Up</Button>
							<Button onClick={onClickLogin}>Log In</Button>
						</div>)
					}
					<IconButton size="large">
						<Link to="/"><img height="40px" src={HomeIcon} alt="Home" /></Link>
					</IconButton>
					{isAuthenticated &&
						<IconButton size="large">
							<Link to="/past-orders"><img height="40px" src={ListIcon} alt="Past Orders" /></Link>
						</IconButton>
					}
				</div>
			</div>

		</>
	)
}

export default Sidebar;
