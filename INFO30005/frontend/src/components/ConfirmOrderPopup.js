import React from "react";
import { sendOrder, overwriteOrder } from "../APIcustomer";
import { useHistory } from "react-router-dom";
import { Button } from '@material-ui/core';

// The pop up specifically for confirming an order, formats the data for the server

export default function ConfirmOrderPopup(props) {
    const history = useHistory();

    // Confirms and sends the order off
    async function confirmMe() {
        if (props.editing !== undefined) {
            // When in editing mode the 'cart' needs to be an object where the keys
            // are literally the id of the food.
            let formattedCart = {};
            props.cart.forEach(element => {
                formattedCart[element._id] = element.quantity;
            });
            await overwriteOrder(props.editing, formattedCart);
            window.location.reload();
        }
        else {
            await sendOrder(props.cart, props.van._id);
        }
        props.handleCompletion();
        props.handleClose();
        history.push("/past-orders")
    }

    return (
        <div className="order-popup-box">
            <div className="opb-box">
                <div id="orderConfirmList">
                    {props.cart.map(food => (
                        <OrderItem key={food._id} {...food} />
                    ))}
                </div>
                <div><h3>Total: ${props.price.toFixed(2)}</h3></div>
                <div  className='buttons'><div><Button className="confirmOrder"
					color='secondary'
					variant='contained' onClick={() => { confirmMe() }}>CONFIRM</Button></div>
				</div>
            </div>
        </div>
    );

    // format for showing foods in the menu.
    function OrderItem(food) {
        return (
            <div id="orderConfirmListitem">
                <div><b>{food.quantity}x</b> {food.name} at ${food.ppi} each</div>
            </div>
			
        );
    }
};