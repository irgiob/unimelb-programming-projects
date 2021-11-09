import React, { useState } from "react";

import { Button, TextField, Box } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import CheckIcon from '@material-ui/icons/Check';

import moment from 'moment';

import { useOrders, useFoods, cancelOrder, rateAVan } from "../APIcustomer";
import { useAppContext } from "../libs/contextLib";

import Logo from "../icons/Logo.svg"
import TasksIcon from "../icons/tasks.svg";
import LoadingIcon from "../icons/Loading.svg";
import NoOrderHistory from '../icons/NoOrderHistory.svg';
import ClockIcon from "../icons/clock.svg";
import RatingIcon from "../icons/Rating.svg";
import SelectCardIcon from "../icons/SelectCard.svg";
import CardDetailsIcon from '../icons/cardDetails.svg';

import DialogBox from "../components/DialogBox";
import Menu from "./Menu"; //This page will masquerade as a menu when the user wants to edit an order.

// Past orders lets a customer view both their ongoing and their archived orders

export default function PastOrders() {
	const { loading, orders, error } = useOrders();
	const { F_loading, foods, F_error } = useFoods(); //we need to compare id's with foods to get english names for display
	const { isAuthenticated } = useAppContext();

	const [editingMode, setEditingMode] = useState(false);
	const [editThis, setEditThis] = useState({});

	const [highlightedOrder, setHighlightedOrder] = useState({});

	const [orderPopup, setOrderPopup] = useState(false);
	const [showRatingPopup, setShowRatingPopup] = useState(false);
	const [ratingThisOrder, setRatingThisOrder] = useState(null);
	const [rating, setRating] = useState(0);
	const [ratingMessage, setRatingMessage] = useState("");
	const [value, setValue] = useState(0);

	const MINS_TO_EDIT = 10;
	const MINS_TO_DISCOUNT = 15;
	const DISCOUNT = 20;

	const headerStyle = {
		paddingBottom: 15
	}

	// While either orders or foods are loading, display a loading page
	if (loading || F_loading) {
		return (<div  className='loading'>
			<img height="130px" src={LoadingIcon} />
		</div>);
	}
	if (error || F_error) {
		return <p>Something went wrong: {error.message}</p>;
	}

	// We don't get the names of foods from the server so we have to match the ID's with a list of foods
	function printSnacks(snacks) {
		let nameQuantityPairs = [];
		// the keys will be the IDs
		let keys = Object.keys(snacks);
		for (var i = 0; i < keys.length; i++) {
			let _id = keys[i];
			// look for a food with the same ID and pair that name with the quantity from the order
			for (var j = 0; j < foods.length; j++)
				if (_id === foods[j]._id) {
					nameQuantityPairs.push({ _id: _id, name: foods[j].name, quantity: Object.values(snacks)[i], ppi: foods[j].price, img: foods[j].img });
				}
		}
		return nameQuantityPairs;
	}

	// Sets this page to 'editing mode' which lets it pretend to be the menu while the user changes their order
	function overwriteOrderAndRefresh(snacksWithNames, order) {
		setEditThis({ cartData: snacksWithNames, orderID: order._id });
		setEditingMode(true);
	}

	// Cancels and order and refreshes the page afterwards
	async function cancelAndRefresh(orderID) {
		await cancelOrder(orderID);
		window.location.reload();
	}

	// Lets a user rate an order
	async function openRatingPopup(order) {
		setRatingThisOrder(order);
		await setShowRatingPopup(true);
		setOrderPopup(false);
	}
	function closeRatingPopup() {
		setShowRatingPopup(false);
		setRatingThisOrder(null);
		setRatingMessage("")
		setRating(0);
	}

	// Sends a rating to the server
	async function sendRateAVan() {
		await rateAVan(ratingThisOrder.orderedFrom, rating, ratingMessage);
		closeRatingPopup();
	}

	// The highlighted order will render in the right of screen with additional information
	function HighlightedOrder() {
		let order = highlightedOrder;

		// If there's no order selected don't display one!
		let probe = Object.keys(order);
		if (probe.length === 0) {
			return (
				<div  className='SelectCardIcon'>
					<div><img height='110px' src={SelectCardIcon} /></div>
				</div>
			)
		}

		// Get the name of the food and the quantity lined up in a list
		let nameQuantityPairs = printSnacks(order.snacks);

		// The age of an order determines whether a discount will be applied and whether the customer
		// is allowed to edit and cancel it
		const timeAgo = moment().diff(moment(order.orderTime), 'minutes');
		let displayStatus = order.orderStatus;
		let editable = true;
		let discount = false;

		// Orders which are older than 10 minutes aren't allowed to be edited, we 
		// convey this to the customer by changing the status to 'In progress'
		if (timeAgo >= MINS_TO_EDIT && order.orderStatus === "PENDING") {
			if (timeAgo >= MINS_TO_DISCOUNT) {
				displayStatus = "IN PROGRESS - Will be discounted";
				discount = true;
			} else {
				displayStatus = "IN PROGRESS";
			}
		}
		if (displayStatus !== "PENDING") {
			editable = false;
		}

		return (
			<>
				<div  className='highlighted-order'>
					<div  className='center'><img height='70px' src={CardDetailsIcon} /></div>
					<div  className='center'><h2>{order.vanName}</h2></div>
					<div  className='time-date'>
						<div  className='date'>{moment(order.orderTime).format("MMMM Do YYYY")}</div>
						<div  className='time'>
							<div><img height='15px' src={ClockIcon} /></div>
							<div>{moment(order.orderTime).format("h:mm a")}</div>
						</div>
					</div>
					<div  className='time-date'>
						<div  className='time'>
							{displayStatus === "PENDING" &&
								<div  className='org-text'><b>Pending</b></div>
							}
							{displayStatus === "IN PROGRESS - Will be discounted" &&
								<div  className='org-text'><b>Being prepared - Sorry for the delay</b></div>
							}
							{displayStatus === "IN PROGRESS" &&
								<div  className='org-text'><b>Being prepared</b></div>
							}

							{order.orderStatus === "READY" &&
								<div  className='green-text'><b>Waiting for pickup</b></div>
							} {order.orderStatus === "COMPLETE" &&
								<div  className='green-text'><b>Completed <CheckIcon fontSize='inherit' /></b></div>
							} {order.orderStatus === "CANCELLED" &&
								<div  className='red-text'><b>Cancelled</b></div>
							}
						</div>
					</div>

					{
						order.orderStatus === "PENDING" && !discount &&
						<div  className='time-date'>
							<div  className='date'>
								<div  className='green-text'><b>{MINS_TO_DISCOUNT - timeAgo} minutes until discount applies</b></div>
							</div>
						</div>
					}


					<div  className='time-date'><div  className='date'><h3>Order summary</h3></div></div>

					{nameQuantityPairs.map(food => (
						<div key={food._id}  className='time-date'>
							<div  className='date'><p>{food.quantity + "x " + food.name}</p></div>
							<div  className='time'>
								<div><p><b>${(food.quantity * food.ppi).toFixed(2)}</b></p></div>
							</div>
						</div>
					))}
					<hr  className='new'></hr>
					{
						order.orderStatus === "PENDING" && discount &&
						<div  className='time-date'>
							<div  className='date'>
								<div  className='green-text'><b>{DISCOUNT}% Discount will apply</b></div>
							</div>
						</div>
					}
					{
						(order.orderStatus === "READY" || order.orderStatus === "COMPLETE") && order.discounted &&
						<div  className='time-date'>
							<div  className='date'>
								<div  className='green-text'><b>{DISCOUNT}% Discount (${(order.totalCost * 100 / (100 - DISCOUNT)).toFixed(2)})</b></div>
							</div>
							<div  className='time'>
								<div  className='green-text right'><b>-${ (( order.totalCost * 100 / (100 - DISCOUNT) ) - order.totalCost).toFixed(2) }</b></div>
							</div>
						</div>
					}
						<div  className='time-date'>
							<div  className='date'>TOTAL</div>
							<div  className='time'>
								<h2>${order.totalCost.toFixed(2)}</h2>
							</div>
						</div>		
				</div>
				{editable &&
								<div class='buttons'>
									<div><Button variant='outlined' onClick={() => { cancelAndRefresh(order._id) }}>CANCEL</Button></div>
									<div><Button variant='outlined' onClick={() => { overwriteOrderAndRefresh(nameQuantityPairs, order) }}>EDIT</Button></div>
								</div>
								}

			</>
		)
	}

	// This is the structure of each individual order in the list on the left hand side
	function Order(order) {
		// Get those english names
		let nameQuantityPairs = printSnacks(order.snacks);

		// calculate the difference between 'now' and when the order was placed (in minutes)
		const timeAgo = moment().diff(moment(order.orderTime), 'minutes');
		let displayStatus = order.orderStatus;
		let editable = true;

		// Orders which are older than 10 minutes aren't allowed to be edited, we 
		// convey this to the customer by changing the status to 'In progress'
		if (timeAgo >= MINS_TO_EDIT && order.orderStatus === "PENDING") {
			if (timeAgo >= MINS_TO_DISCOUNT) {
				displayStatus = "IN PROGRESS - Will be discounted";
			} else {
				displayStatus = "IN PROGRESS";
			}
		}
		if (displayStatus !== "PENDING") {
			editable = false;
		}

		return (
			<>
				{order.orderStatus === "READY" || order.orderStatus === "PENDING" ?
					<>
						<div id="OrderCard"  className='gray' onClick={() => { setHighlightedOrder(order); order.onClick(); }}>
							<div>
								<div>
									<h3>{order.vanName}</h3>
									<b>{moment(order.orderTime).format("MMMM Do YYYY")} at <img height='12px' src={ClockIcon} /> {moment(order.orderTime).format("h:mm a")}</b>
								</div>
								<div>
									{nameQuantityPairs.slice(0, 2).map(food => (
										<p key={food._id}>{food.quantity + "x " + food.name}</p>
									))}
									{nameQuantityPairs.length > 2 &&
										<p>. . .</p>
									}

								</div>
							</div>
							<div class='right-side'>
								<div class='Total'>
									<div class='total-text'>{order.discounted && <>(Discounted) </>}TOTAL</div>
									<div class='dollas'><h2>${order.totalCost.toFixed(2)}</h2></div>
								</div>
								{order.orderStatus === "READY" &&
									<div  className='Status'><div><b  className='green-text'>READY FOR PICKUP</b></div></div>
								}
								{order.orderStatus === "PENDING" &&
									<div  className='Status'>
										{displayStatus === "PENDING" ?
											<div  className='org-text'><b>PENDING</b></div>
										:
											<div  className='org-text'><b>BEING PREPARED</b></div>
										}
									</div>
								}
								{editable &&
								<div class='Status cancelbtn'>
									<div><Button variant='outlined' onClick={() => { cancelAndRefresh(order._id) }}>CANCEL</Button></div>
									<div><Button variant='outlined' onClick={() => { overwriteOrderAndRefresh(nameQuantityPairs, order) }}>EDIT</Button></div>
								</div>
								}
								
							</div>
						</div>

					</>
					: 
					<>
						<div id="OrderCard"  className='gray' onClick={() => { setHighlightedOrder(order); order.onClick(); }}>
							<div>
								<div>
									<h3>{order.vanName}</h3>
									<b>{moment(order.orderTime).format("MMMM Do YYYY")} at <img height='12px' src={ClockIcon} /> {moment(order.orderTime).format("h:mm a")}</b>
								</div>
								<div>
									{nameQuantityPairs.slice(0, 2).map(food => (
										<p key={food._id}>{food.quantity + "x " + food.name}</p>
									))}
									{nameQuantityPairs.length > 2 &&
										<p>. . .</p>
									}

								</div>
							</div>
							<div class='right-side'>
								<div class='Total'>
									<div class='total-text'>{order.discounted && <>(Discounted) </>}TOTAL</div>
									<div class='dollas'><h2>${order.totalCost.toFixed(2)}</h2></div>
								</div>
								{order.orderStatus === "CANCELLED" &&
									<div  className='Status'><div><b  className='red-text'>{order.orderStatus}</b></div></div>
								} {order.orderStatus === "COMPLETE" &&
									<div  className='Status'>
										<div>
											<Button size='small' variant='contained' color='secondary' className="addtocartbutton"
												onClick={() => openRatingPopup(order)}>
												Rate this experience
									</Button>
										</div>
										<div  className='text'><b>COMPLETED</b></div>
									</div>
								}
							</div>
						</div>
					</>
				}

			</>
		)
	}

	// This is the structure of the page
	if (editingMode) {
		return (
			<Menu editing={editThis.orderID} vanID={editThis.orderedFrom} cartData={editThis.cartData} />
		)
	}
	
	else {
		// Seperate the orders into sublists based on status. Ready first, then pending, then completed.
		let readys = [];
		let pendings = [];
		let completeds = [];
		let cancelleds = [];
		orders.forEach(order => {
			if (order.orderStatus === "READY") {
				readys.push(order);
			}
			else if (order.orderStatus === "PENDING") {
				pendings.push(order);
			}
			else if (order.orderStatus === "COMPLETE") {
				completeds.push(order);
			}
			else if (order.orderStatus === "CANCELLED") {
				cancelleds.push(order);
			}
		});

		return (
			<>
				<div id="desktop"  className="main-container">
					<div  className="Home header">
						<a href="/"><img height="110px" src={Logo} alt="Logo" /></a>
						<div  className="card">
							<div  className="title">
								<div  className="Icon"><img height="70px" src={TasksIcon} /></div>
								<div  className="PageTitle">
									<div><h2>Past Orders</h2></div>
								</div>
							</div>
						</div>

					</div>

					<div  className="Home main card">
						{isAuthenticated ?
							<div>
								{(readys.length === 0 && pendings.length === 0 &&
									completeds.length === 0 && cancelleds.length === 0) &&
									<div  className='NoOrderHistory'>
										<div><img height='110px' src={NoOrderHistory} /></div>
									</div>

								}
								{(readys.length > 0 || pendings.length > 0) &&
									<div id="order-type">
										<h2>In Progress</h2>
									</div>
								}
								{readys.length > 0 &&
									<div>
										<div id="past-orders">
											{readys.reverse().map(order => (
												<Order key={order._id} {...order} onClick={() => null} />
											))}
										</div>
									</div>
								}
								{pendings.length > 0 &&
									<>
										<div>
											<div id="past-orders">
												{pendings.reverse().map(order => (
													<Order key={order._id} {...order} onClick={() => null} />
												))}
											</div>
										</div>
									</>

								}

								{completeds.length > 0 &&
									<>
										<div id="order-type">
											<h2>Archived Orders</h2>
										</div>
										<div>
											<div id="past-orders">
												{completeds.reverse().map(order => (
													<Order key={order._id} {...order} onClick={() => null} />
												))}
												{cancelleds.reverse().map(order => (
													<Order key={order._id} {...order} onClick={() => null} />
												))}
											</div>
										</div>
									</>
								}
							</div>
							:
							<div id="div-button">
								<p>Please Login to view your orders</p>
							</div>
						}
					</div>

				</div>
				<div id='desktop'  className="Home right-container">
					<div  className="Home right card">
						<HighlightedOrder />
					</div>
				</div>

				<div id="mobile">
					<DialogBox open={orderPopup} onClose={() => setOrderPopup(false)}>
						<HighlightedOrder />
					</DialogBox>
					<>
						<div  className="adjHeight title">
							<div  className="Icon"><img height="70px" src={TasksIcon} /></div>
							<div  className="PageTitle">
								<div><h2>Past Orders</h2></div>
							</div>
						</div>
						<div  className='general main card'>
							{isAuthenticated ?
								<div>
									{(readys.length === 0 && pendings.length === 0 &&
										completeds.length === 0 && cancelleds.length === 0) &&
										<div  className='NoOrderHistory'>
											<div><img height='110px' src={NoOrderHistory} /></div>
										</div>

									}
									{(readys.length > 0 || pendings.length > 0) &&
										<div id="order-type">
											<h2>In Progress</h2>
										</div>
									}
									{readys.length > 0 &&
										<div>
											<div id="past-orders">
												{readys.reverse().map(order => (
													<Order key={order._id} {...order} onClick={() => setOrderPopup(true)} />
												))}
											</div>
										</div>
									}
									{pendings.length > 0 &&
										<>
											<div>
												<div id="past-orders">
													{pendings.reverse().map(order => (
														<Order key={order._id} {...order} onClick={() => setOrderPopup(true)} />
													))}
												</div>
											</div>
										</>

									}

									{completeds.length > 0 &&
										<>
											<div id="order-type">
												<h2>Archived Orders</h2>
											</div>
											<div>
												<div id="past-orders">
													{completeds.reverse().map(order => (
														<Order key={order._id} {...order} onClick={() => setOrderPopup(true)} />
													))}
													{cancelleds.reverse().map(order => (
														<Order key={order._id} {...order} onClick={() => setOrderPopup(true)} />
													))}
												</div>
											</div>
										</>
									}
								</div>
								:
								<div id="div-button">
									<p>Please Login to view your orders</p>
								</div>
							}
						</div>
					</>
				</div>

				{ratingThisOrder !== null && //This conditional stops the code from trying to read the order before it's assigned
					<DialogBox open={showRatingPopup} onClose={closeRatingPopup}>
						<div  className="VanPopUp">
							<div  className='center'>
								<div><img height='50px' src={RatingIcon} /></div>
								<div><h3>Rate your experience with</h3><h3>{ratingThisOrder.vanName}</h3></div>
							</div>
							<Box component="fieldset" borderColor="transparent">
								<Rating precision={0.5}
									value={value}
									onChange={(event, newValue) => {
										setValue(newValue);
										setRating(newValue);
										console.log(newValue);
									}}
								/>
							</Box>
							<TextField
								type="text"
								name="ratingMessage"
								onChange={e => setRatingMessage(e.target.value)}
								variant="outlined"
								label="Tell us more!"
								fullWidth />
							<div  className='feedback-btn'>
								<Button
									size='small'
									variant="contained"
									color='secondary'
									onClick={() => { sendRateAVan() }}>
									Send Feedback
						</Button></div>
						</div>
					</DialogBox>
				}
			</>
		);
	}
}