import React, { useState, useEffect } from "react";

import ConfirmOrderPopup from './ConfirmOrderPopup';
import { useAppContext } from "../libs/contextLib";
import { Button, IconButton, Dialog } from "@material-ui/core";

import DialogBox from '../components/DialogBox';

import BagEmpty from '../icons/BagEmpty.svg';
import AddIcon from '@material-ui/icons/AddCircle';
import RemoveIcon from '@material-ui/icons/RemoveCircle';

/*
    The cart is displayed alongside the menu, it accumulates foods and enables order confirmation
*/
export default function Cart(props) {

    const [showOrderConfirm, setShowOrderConfirm] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0.00);
    const { isAuthenticated } = useAppContext();

    function togglePopup() {
        setShowOrderConfirm(!showOrderConfirm);
    }

    // Everytime to foods to be ordered updates so too should the total price
    useEffect(() => {
        var runningtotal = 0.00;
        for (var i = 0; i < props.manifest.length; i++) {
            runningtotal += (props.manifest[i].quantity * props.manifest[i].ppi);
        }
        setTotalPrice(runningtotal);
    }, [props.manifest])

    // You can't have a cart if you can't order
    if (!isAuthenticated) {
        return (
            <></>
        )
    }

    // If there's at least one item in the cart, display this
    if (props.manifest.length > 0) {
        return (
            <div id="cartList">
                <div>
                    {props.manifest.map(food => (
                        <CartItem key={food._id} {...food} />
                    ))}
                </div>
				<div><hr></hr></div>
				<div  className='Total-container'>
					<div  className='total-text'>TOTAL</div>
					<div  className='dollas'><h2>${totalPrice.toFixed(2)}</h2></div>
				</div>
				<div  className='buttons'>
					<div><Button variant='contained' className="cartBottomButtons"
						onClick={() => { clearCart() }}>Empty cart</Button></div>
					<div><Button variant='contained' color='secondary' className="cartBottomButtons"
						onClick={() => { setShowOrderConfirm(true) }}>Confirm order</Button></div>
				</div>

                <DialogBox open={showOrderConfirm} onClose={togglePopup}>
                    <ConfirmOrderPopup handleClose={togglePopup} handleCompletion={clearCart} cart={props.manifest} price={totalPrice} van={props.van} editing={props.editing} />
                </DialogBox>
            </div>
        );
    }

    else if (isAuthenticated) {
        return (
            <div  className='BagEmpty'>
                <div><img src={BagEmpty} /></div>
                <div><h3>Click on items to add them to your cart!</h3></div>
            </div>
        )
    }

    // empty cart
    function clearCart() {
        props.setManifest([]);
        localStorage.setItem('cart', null);
    }

    // add one of a food to the cart
    function plusMe(_id, name) {
        props.addToCart(_id, name, 1);
    }

    // minus one of a food from the cart
    function minusMe(_id, name) {
        props.addToCart(_id, name, -1);
    }

    // format for showing foods in the menu.
    function CartItem(food) {
        return (
            <div id="cartItem">
                <div><hr></hr></div>
                <div  className="flex-row">
                    <div  className='col1'>
                        <img height="80px" width='80px'  className="food-img" src={"data:" + food.img.contentType + ";base64, " + btoa(String.fromCharCode(...new Uint8Array(food.img.data.data)))} alt="" />
                    </div>
                    <div  className='col2'>
                        <div>{food.name}</div>
                        <div id="cartSmalltext"><b>${(food.quantity * food.ppi).toFixed(2)}</b></div>
                    </div>
                    <div  className='col3'>
                        <IconButton color='primary' className="minusser" onClick={() => { minusMe(food._id, food.name) }}><RemoveIcon /></IconButton>
                        {food.quantity}
                        <IconButton color='primary' className="plusser" onClick={() => { plusMe(food._id, food.name) }}><AddIcon /></IconButton>
                    </div>
                </div>
            </div>
        );
    }
}