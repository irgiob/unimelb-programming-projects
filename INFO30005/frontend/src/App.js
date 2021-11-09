import './App.css';
import Sidebar from './components/Sidebar';
import React, { useState, useEffect } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

//context (similar to global variables) used for maintaining authentication
import { AppContext } from "./libs/contextLib";
import { BrowserRouter as Router, Route } from 'react-router-dom';

// customer pages
import Home from './customer_pages/Home';
import PastOrders from './customer_pages/PastOrders';
import Menu from "./customer_pages/Menu";
import Profile from "./customer_pages/Profile";

// vendor pages
import ManageOrders from "./vendor_pages/ManageOrders";
import VendorHome from "./vendor_pages/VendorHome";

// Colour shared accross elements
const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#ffccbc',
		},
		secondary: {
			main: '#b9f6ca',
		},
	},
})

function App() {
	// We have to track user authentication seperate from vendor authentication, otherwise a logged in user
	// could access the vendor side (the endpoints still wouldn't work for them though)
	const [isAuthenticated, userHasAuthenticated] = useState(false);
	const [vendorAuthenticated, vendorHasAuthenticated] = useState(false);

	useEffect(() => {
		/* This will maintain a 'logged in' view of the site, entering a dummy value in user or vendor
		   won't give you access though - all the endpoints will fail for you without a valid token
		*/
		// Check for a logged in user upon loading
		if (localStorage.getItem("user")) {
			const foundUser = JSON.parse(localStorage.getItem("user"));
			userHasAuthenticated(true);
		}
		// Check for a logged in vendor upon loading
		if (localStorage.getItem("vendor")) {
			const foundUser = JSON.parse(localStorage.getItem("vendor"));
			vendorHasAuthenticated(true);
		}
		console.log("App");
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<div className="App">
				<AppContext.Provider value={{ isAuthenticated, userHasAuthenticated, vendorAuthenticated, vendorHasAuthenticated }}>
					<Router>
						<div  className="flex-container">
							<div id="desktop"  className="nav">
								<Sidebar />
							</div>
							<div id="mobile"  className="nav">
								<Sidebar />
							</div>

							{/*customer routes*/}
							<Route exact path="/" component={Home} />
							<Route exact path="/past-orders" component={PastOrders} />
							<Route exact path="/menu" component={Menu} />
							<Route exact path="/profile" component={Profile} />

							{/*vendor routes*/}
							<Route path="/vendor/manage-orders" component={ManageOrders} />
							<Route exact path="/vendor" component={VendorHome} />
						</div>
					</Router>
				</AppContext.Provider>
			</div >
		</ThemeProvider>
	);
}

export default App;
