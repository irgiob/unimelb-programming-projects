import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import moment from 'moment';

import { useFoods } from "../APIcustomer";
import { useVanOrders, markAsComplete, markAsReady, closeThisVan } from "../APIvendor";
import { useAppContext } from "../libs/contextLib";
import { Button, ButtonGroup, TextField, Checkbox } from "@material-ui/core";
import CheckIcon from '@material-ui/icons/Check';

import Logo from "../icons/Logo.svg";
import FilterIcon from "../icons/filter.svg";
import SelectCardIcon from "../icons/SelectCard.svg";
import CardDetailsIcon from '../icons/cardDetails.svg';
import ClockIcon from "../icons/clock.svg";
import UserIcon from "../icons/user.svg";
import LoadingIcon from "../icons/Loading.svg";
import TabletView from '../icons/TabletView.svg';

import DialogBox from "../components/DialogBox";

// Manage orders is the main business page for a vendor where they can see all their orders

export default function ManageOrders() {
    const history = useHistory();
    const { loading, orders, error } = useVanOrders();
    const { F_loading, foods, F_error } = useFoods(); //we need to get english names for display
    const { vendorAuthenticated } = useAppContext();
    const { vendorHasAuthenticated } = useAppContext();
    const [highlightedOrder, setHighlightedOrder] = useState({});

    const [filterPopup, setFilterPopup] = useState(false);
    const [filterDate, setFilterDate] = useState("");
    const [filterOrder, setFilterOrder] = useState("");
    const [filterName, setFilterName] = useState("");
    const [showComplete, setShowComplete] = useState(false);
    const [showCancelled, setShowCancelled] = useState(false);

	const MINS_TO_DISCOUNT = 15;
	const DISCOUNT = 20;

	// While orders or foods are loading, display a loading page
    if (loading || F_loading) {
        return (<div  className='loading'>
			<img height="130px" src={LoadingIcon} />
		</div>);
    }
    if (error || F_error) {
        history.push("/vendor");
    }

	// Changes an order's status to 'READY' as in ready for pick up
    async function readyfy(id) {
        await markAsReady(id);
        window.location.reload();
    }

	// Change an order's status to 'COMPLETE' after a customer picks it up
    async function completeify(id) {
        await markAsComplete(id);
        window.location.reload();
    }

	// Sets the vans status to 'CLOSED' and takes you to the homepage to set a new location
    async function closeMe() {
        await closeThisVan();
        history.push("/vendor");
    }

	// More of an 'end of the day' close up - this logs the vendor out as well
    async function closeAndLogOut() {
        await closeThisVan();
        vendorHasAuthenticated(false);
        localStorage.clear();
        history.push("/vendor");
    }

    /* Orders only contain the ID's of the foods, those aren't useful to the chefs
    so we get the equivalent food and print the name instead */
    function printSnacks(snacks) {
        let nameQuantityPairs = [];
        // the keys are the ID's from the order
        let keys = Object.keys(snacks);
        for (var i = 0; i < keys.length; i++) {
            let _id = keys[i];
            // look for the equivalent food
            for (var j = 0; j < foods.length; j++)
                if (_id === foods[j]._id) {
                    nameQuantityPairs.push({ _id: _id, name: foods[j].name, quantity: Object.values(snacks)[i] });
                }
        }
        return nameQuantityPairs;
    }

	// The scrolling list on the left can display the total number of items in an order
    function countSnacks(snacks) {
        let quantities = Object.values(snacks);
        let count = 0;
        for (var i = 0; i < quantities.length; i++) {
            count += quantities[i];
        }
        return count;
    }

    //  The highlighted order will render in the right of screen with more information
    function HighlightedOrder() {
        let order = highlightedOrder;
        console.log(order);

        // If there's no order selected don't display one!
        let probe = Object.keys(order);
        if (probe.length === 0) {
            return (
                <div  className='SelectCardIcon'>
					<div><img height='110px' src={SelectCardIcon} /></div>
				</div>
            )
        }

        let status = order.orderStatus;

        // Get the name of the food and the quantity lined up in a list
        let nameQuantityPairs = printSnacks(order.snacks);

		// While an order is pending we need to know how long is left until the discount deadline
        const timeAgo = moment().diff(moment(order.orderTime), 'minutes');
		let discount = false;

        if(timeAgo >= MINS_TO_DISCOUNT){
            discount = true;
        }

        return (
			<>
            <div  className='highlighted-order'>
				<div  className='center'><img height='70px' src={CardDetailsIcon} /></div>
				<div  className='center'><h2>Order #{order.orderNumber}</h2></div>
				<div  className='center'><h3>{order.vanName}</h3></div>
				<div  className='time-date'>
					<div  className='date'>{moment(order.orderTime).format("MMMM Do YYYY")}</div>
					<div  className='time'>
						<div><img height='15px' src={ClockIcon} /></div>
						<div>{moment(order.orderTime).format("h:mm a")}</div>
					</div>
				</div>
				<div  className='time-date'>
					<div  className='date'>
						{order.orderStatus === "PENDING" &&
						<div  className='org-text'><b>Preparing</b></div>
						}
                        {order.orderStatus === "READY" &&
						<div  className='green-text'><b>Waiting for pickup</b></div>
						} 
                        {order.orderStatus === "COMPLETE" &&
						<div  className='green-text'><b>Completed<CheckIcon fontSize='inherit' /></b></div>
						}
                        {order.orderStatus === "CANCELLED" &&
						<div  className='red-text'><b>Cancelled</b></div>
						}
					</div>
					<div  className='time'>
						<div><img height='15px' src={UserIcon} /></div>
						<div>{order.name}</div>
					</div>
				</div>
                {
                    order.orderStatus === "PENDING" && !discount &&
                    <div  className='time-date'>
                        <div  className='date'>
                            <div  className='red-text'><b>{MINS_TO_DISCOUNT - timeAgo} minutes until discount applies</b></div>
                        </div>
				    </div>
                }
				{
                    order.orderStatus === "PENDING" && discount &&
                    <div  className='time-date'>
                        <div  className='date'>
                            <div  className='red-text right'><b>{DISCOUNT}% Discount will apply</b></div>
                        </div>
				    </div>
                }
				<h3>Order summary</h3>
				{nameQuantityPairs.map(food => (
					<div key={food._id}>
						<p>{food.quantity + "x " + food.name}</p>
					</div>
				))}
				<hr  className='new'></hr>
                {
                    (order.orderStatus === "READY" || order.orderStatus === "COMPLETE") && order.discounted &&
                    <div  className='time-date'>
                        <div  className='date'>
                            <div  className='red-text'><b>{DISCOUNT}% Discount (${(order.totalCost * 100 / (100 - DISCOUNT)).toFixed(2)})</b></div>
                        </div>
						<div  className='time'>
							<div  className='red-text right'><b>-${ (( order.totalCost * 100 / (100 - DISCOUNT) ) - order.totalCost).toFixed(2) }</b></div>
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
			
			{status === "PENDING" &&
				<div  className='center pad-bot'>
					<div><Button variant="contained" color='secondary' onClick={() => { readyfy(order._id) }}>Order Ready!</Button></div>
				</div>
			}
			{status === "READY" &&
				<div  className='center pad-bot'>
					<div><Button variant="contained" color='secondary' onClick={() => { completeify(order._id) }}>Picked up by {order.name}</Button></div>
				</div>
			}

			</>
        )
    }

    // Orders in the left hand side scrolling panel will be smaller and display only some information
    function Order(order) {
        let numItems = countSnacks(order.snacks);

        return (
			<div id="OrderCard"  className='gray' onClick={() => setHighlightedOrder(order)}>
				<div>
					<div>
						<h3>Order #{order.orderNumber}
						</h3>
						<b>{moment(order.orderTime).format("MMMM Do YYYY")} at <img height='12px' src={ClockIcon} /> {moment(order.orderTime).format("h:mm a")}</b>
					</div>
					<div>
					{numItems === 1 ?
						<p>{numItems} Item</p>
						: <p>{numItems} Items</p>
					}
					</div>
				</div>
				<div class='right-side'>
					<div class='Total'>
						<div class='total-text'>{order.discounted && <>(Discounted) </>}TOTAL</div>
						<div class='dollas'><h2>${order.totalCost.toFixed(2)}</h2></div>
					</div>
					<div  className='Status'><div>
						{order.orderStatus === "READY" &&
							<b  className='green-text'>READY FOR PICKUP</b>
						} {order.orderStatus === "PENDING" &&
							<b  className='org-text'>PREPARING</b>
						} {order.orderStatus === "CANCELLED" &&
							<b  className='red-text'>CANCELLED</b>
						} {order.orderStatus === "COMPLETE" &&
							<b  className='green-text'>COMPLETED</b>
						}
						
						</div></div>
				</div>
			</div>
        )
    }

	// The structure of the page

	// We want to separate orders based on their status because pendings are a higher priority e.c.t.
    let readys = [];
    let pendings = [];
    let completeds = [];
    let cancelleds = [];
    orders.forEach(order => {
        if ((filterOrder !== "" && parseInt(order.orderNumber) !== parseInt(filterOrder)) ||
            (filterName !== "" && order.name.toLowerCase() !== filterName.toLowerCase()) ||
            (filterDate !== "" && order.orderTime.substring(0, 10) !== filterDate)) {
            return;
        }

        if (order.orderStatus === "READY") {
            readys.push(order);
        }
        else if (order.orderStatus === "PENDING") {
            pendings.push(order);
        }
        else if (showComplete && order.orderStatus === "COMPLETE") {
            completeds.push(order);
        }
        else if (showCancelled && order.orderStatus === "CANCELLED") {
            cancelleds.push(order);
        }
    });


    return (
        <>
            <DialogBox open={filterPopup} onClose={() => setFilterPopup(false)} fullScreen={false}>
				
				<div class='filter'>
					<div class='filter-title'>
						<div><img height='40px' src={FilterIcon} /></div>
						<div><h1>Filter by</h1></div>
					</div>
					<div class='filter-container'>
						<div>
							<TextField
								label="Date of order"
								type="date"
								onChange={e => setFilterDate(e.target.value)}
								defaultValue={filterDate}
								InputLabelProps={{
									shrink: true,
								}}
							/>
							<br />
							<TextField
								label="Order Number"
								type="number"
								defaultValue={filterOrder}
								onChange={(e) => setFilterOrder(e.target.value)}
							/>
							<br />
							<TextField
								label="Customer Name"
								type="text"
								defaultValue={filterName}
								onChange={(e) => setFilterName(e.target.value)}
							/>
							<br />
						</div>
						<div>
							<Checkbox
								checked={showComplete}
								onChange={(e) => setShowComplete(e.target.checked)}
							/>
							<label>Show complete orders</label>
							<br />
							<Checkbox
								checked={showCancelled}
								onChange={(e) => setShowCancelled(e.target.checked)}
							/>
							<label>Show cancelled orders</label>
						</div>
					</div>
				</div>
				
            </DialogBox>
            <div id="desktop"  className="main-container">
                <div  className="Home header">
                    <a href="/"><img height="110px" src={Logo} alt="Logo" /></a>
                    <div class="Home header">
						<div>
						<ButtonGroup>
								<Button variant='contained' color='secondary' className="addtocartbutton"
									onClick={() => closeMe()}>
									Close up shop
								</Button>
								<Button variant='contained' color='secondary' className="addtocartbutton"
									onClick={() => closeAndLogOut()}>
									Close and log out
								</Button>
							</ButtonGroup>
						</div>
						<div>
							<Button variant='text'
								onClick={() => setFilterPopup(true)}>
								Filter orders
							</Button>
						</div>
                    </div>
                </div>

                <div  className="Home main card">
                    <div id="page-order-list">
                        {!vendorAuthenticated ?
                            <div id="div-button">
                                <p>You must log in to access this page</p>
                                <button className="cartBottomButtons" onClick={() => { history.push("/vendor") }}>Log in/Register</button>
                            </div>
                            :
                            <div>
                                {pendings.length > 0 &&
                                    <>
									<div id="order-type">
										<h2>Orders to be Prepared</h2>
									</div>
									<div>
										<div id="past-orders">
											{pendings.map(order => (
											<Order key={order._id} {...order} />
											))}
										</div>
									</div>
									</>
                                }

                                {readys.length > 0 &&
									<>
									<div id="order-type">
										<h2>Ready for Pick Up</h2>
										
									</div>
									<div>
										<div id="past-orders">
											{readys.map(order => (
											<Order key={order._id} {...order} />
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
											<Order key={order._id} {...order} />
											))}
										</div>
									</div>
									</>
                                }

                                {cancelleds.length > 0 &&
                                   <>
								   <div id="order-type">
									   <h2>Cancelled Orders</h2>
								   </div>
								   <div>
									   <div id="past-orders">
										   {cancelleds.reverse().map(order => (
										   <Order key={order._id} {...order} />
										   ))}
									   </div>
								   </div>
								   </>
                                }
                            </div>
                        }
                    </div>
                </div>

            </div>
            <div  className="Home right-container">
                <div  className="Home right card">
                    <HighlightedOrder />
                </div>
            </div>

			<div id='mobile'>
				<div  className='loading'>
					<img height="130px" src={TabletView} />
				</div>
			</div>

        </>);
}