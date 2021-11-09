import React, { useState, useEffect } from "react";
import { Button, Fab, Badge, Box, IconButton } from "@material-ui/core";
import { Rating } from '@material-ui/lab';

import { useFoods, getRating, getAllVans } from "../APIcustomer";
import { useAppContext } from "../libs/contextLib";
import Cart from "../components/Cart";
import DialogBox from "../components/DialogBox";
import { useHistory } from "react-router-dom";

import Logo from "../icons/Logo.svg";
import SignIcon from "../icons/sign.svg";
import BagIcon from "../icons/bag.svg";
import DrinkIcon from "../icons/drink.svg";
import LoadingIcon from "../icons/Loading.svg";
import PlaceOrder from '../icons/PlaceOrder.svg';
import CloseIcon from "@material-ui/icons/CloseRounded";

// The menu is where a logged in user can construct a 'cart'

export default function Menu(props) {
    const { loading, foods, error } = useFoods();
    const [van, setVan] = useState({});			// {_id, name}
    const [cart, setCart] = useState([]); 		// [{_id, name, quantity, ppi}]	
    const [rating, setRating] = useState(0);
    const [cartPopup, setCartPopup] = useState(false);
    const { isAuthenticated } = useAppContext();
    const history = useHistory();

    /*
      This effect runs only on the first render - here I initialize some of the state variables
      from their localStorage counterparts
    */
    useEffect(() => {
        async function init() {
            // Check if this menu is for editing an existing order
            if (props.editing !== undefined) {
                // Set the van to order from to be the same as in the old order
                let copyVan = { _id: props.vanID, name: "EDIT" };
                setVan(copyVan);

                // Reconstruct the cart from the old order
                let reconstruct = [];

                props.cartData.forEach(element => {
                    console.log("Adding + " + JSON.stringify(element))
                    reconstruct.push({ _id: element._id, name: element.name, quantity: element.quantity, ppi: element.ppi, img: element.img });
                });
                console.log("building" + JSON.stringify(reconstruct));
                await setCart(reconstruct);
            }

            // proceed for a fresh order if this isn't an edit scenario
            else {
                // Check for a pre-existing cart (unfinished order perhaps)
                const savedCart = await JSON.parse(localStorage.getItem('cart'));
                if (savedCart) {
                    setCart(savedCart);
                }

                // Check what van we're ordering from - if there be one selected
                let copyVan = { _id: "", name: "" };
                let vanTarget_n = await JSON.parse(localStorage.getItem('currentVanName'));
                let vanTarget_id = null;
                if (vanTarget_n) {
                    /* Because the van ID could be used as a token we won't store it in local storage
                     We also might be resuming a previous session and cannt assume the user has gone through
                     the map so we re-get the vans here */
                    let allvans = await getAllVans();
                    allvans.forEach(van => {
                        if (van.vendorName === vanTarget_n){
                            vanTarget_id = van._id;
                        }
                    })
                    copyVan.name = vanTarget_n;
                    copyVan._id = vanTarget_id;
                    console.log(copyVan);
                    setVan(copyVan);
                }

                else {
                    alert("You must first select a van to place this order with!");
                    history.push("/");
                }
            }
        }
        init();
    }, [])

    // Gets a vans rating to display in the header
    const getVanRating = async () => {
        let ratings = await getRating(van._id);
        let meanRate = 0;
        let count = 0;
        let buildup = 0;
        if (ratings.length > 0) {
            ratings.forEach(rating => {
                buildup += rating.rating;
                count++;
            })
            meanRate = (buildup / count).toFixed(2);
        }
        // Default to zero, it's the only option which isn't technically a lie
        else {
            meanRate = 0;
        }
        setRating(meanRate);
    }
    getVanRating();

    /*
        This effect runs everytime the current cart changes, it saves the cart to localStorage
    */
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart])

    /*
          This code renders while the food list is still loading
    */
    if (loading) {
        return (
            <div  className='loading'>
                <img height="130px" src={LoadingIcon} />
            </div>
        );
    }

    // render in error
    if (error) {
        return <p>Something went wrong: {error.message}</p>;
    }

    // regular display of the foods available and the cart
    return (
        <>
            <div id="desktop"  className="main-container">
                <div  className="Home header">
                    <img height="110px" src={Logo} alt="Logo" />
                    <div  className="card">
                        <div  className="title">
                            <div  className="Icon"><img height="70px" src={SignIcon} /></div>
                            <div  className="PageTitle">
                                <div><h2>{van.name}</h2></div>
                                <Box component="fieldset" borderColor="transparent">
                                    <Rating precision={0.25} value={rating} readOnly />
                                </Box>
                            </div>
                        </div>
                    </div>
                </div>

                <div  className="Home main card">
                    <div id="menu-type">
                        <h2>Drinks</h2>
                    </div>
                    <div id="menu-items">
                        {foods.slice(0, 4).map(food => (
                            <Food key={food._id} {...food} />
                        ))}
                    </div>
                    <div id="menu-type">
                        <h2>Snacks</h2>
                    </div>
                    <div id="menu-items">
                        {foods.slice(4, 8).map(food => (
                            <Food key={food._id} {...food} />
                        ))}
                    </div>
                </div>

            </div>

            <div  className="Home right-container card">
                {cart.length === 0 && isAuthenticated &&
                    <div  className='centered'>
                        <Cart manifest={cart} setManifest={setCart} addToCart={AddToCart} van={van} editing={props.editing} />
                    </div>
                }
                <div>
                    {cart.length > 0 && isAuthenticated &&
                        <>
                            <div  className='right-title'>
                                <div  className="Icon"><img height="60px" src={DrinkIcon} /></div>
                                <div  className="PageTitle"><h2>Current Order</h2>
                                </div>
                            </div>
                            <div>
                                <Cart manifest={cart} setManifest={setCart} addToCart={AddToCart} van={van} editing={props.editing} />
                            </div>
                        </>
                    }{!isAuthenticated &&
                        <div  className='centered'>
                            <div><img height="120px" src={PlaceOrder} /></div>
                        </div>
                    }
                </div>
            </div>


            <div id="mobile">
                <DialogBox open={cartPopup} onClose={() => setCartPopup(false)} fullScreen={true} >
                    <IconButton
                        style={{
                            margin: 0,
                            bottom: 'auto',
                            left: 20,
                            top: 20,
                            right: 'auto',
                            position: 'fixed',
                        }}
                        onClick={() => setCartPopup(false)}>
                        <CloseIcon />
                    </IconButton>
                    {cart.length > 0 && isAuthenticated &&
                        <div  className='right-title'>
                            <div  className="Icon"><img height="60px" src={DrinkIcon} /></div>
                            <div  className="PageTitle"><h2>Current Order</h2>
                            </div>
                        </div>
                    }
                    <Cart manifest={cart} setManifest={setCart} addToCart={AddToCart} van={van} editing={props.editing} />
                </DialogBox>
                <>
                    <div  className="adjHeight title">
                        <div  className="Icon"><img height="70px" src={SignIcon} /></div>
                        <div  className="PageTitle">
                            <div><h2>{van.name}</h2></div>
                            <div>
                                <Box component="fieldset" borderColor="transparent">
                                    <Rating precision={0.25} value={rating} readOnly />
                                </Box>
                            </div>
                        </div>
                    </div>
                    <div id="menu-type">
                        <h2>Drinks</h2>
                    </div>
                    <div id="menu-items">
                        {foods.slice(0, 4).map(food => (
                            <Food key={food._id} {...food} />
                        ))}
                    </div>
                    <div id="menu-type">
                        <h2>Snacks</h2>
                    </div>
                    <div id="menu-items">
                        {foods.slice(4, 8).map(food => (
                            <Food key={food._id} {...food} />
                        ))}
                    </div>
                </>

                {isAuthenticated &&

                    <Fab
                        onClick={() => setCartPopup(true)}
                        color="primary"
                        style={{
                            margin: 0,
                            top: 'auto',
                            right: 20,
                            bottom: 20,
                            left: 'auto',
                            position: 'fixed',
                        }}>
                        <Badge color="error" badgeContent={cart.length} color='secondary'>
                            <img height="38px" src={BagIcon} />
                        </Badge>
                    </Fab>
                }
            </div>
        </>
    );

    // this function can be used to increase or decrease the quantity of an item in cart
    async function AddToCart(_id, name, delta, ppi, img) {
        if (cart.length > 0) {
            let copycart = [...cart];
            // look for this food already being in the cart
            for (var i = 0; i < copycart.length; i++) {
                if (copycart[i]._id === _id) {
                    // if this food is already in there, increment and save
                    copycart[i].quantity = copycart[i].quantity + delta;


                    if (copycart[i].quantity === 0) {
                        let fugitive = copycart[i]._id;
                        copycart = copycart.filter(food => food._id !== fugitive);
                    }
                    await setCart(copycart);
                    return;
                }
            }
            // Add one of the item to cart
            copycart.push({ _id: _id, name: name, quantity: delta, ppi: ppi, img: img })
            await setCart(copycart);
            return;
        }
        // fresh cart with just this item
        else {
            let newCart = [{ _id: _id, name: name, quantity: delta, ppi: ppi, img: img }];
            setCart(newCart);
        }
    }

    // format for showing foods in the menu.
    function Food(food) {
        const { isAuthenticated } = useAppContext();
        return (

            <div  className="menu-flex">
                <div>
                    <img height="140vh"  className="food-img" src={"data:" + food.img.contentType + ";base64, " + btoa(String.fromCharCode(...new Uint8Array(food.img.data.data)))} alt="" />
                </div>
                <div><p>{food.name}</p></div>
                <div><p>${food.price.toFixed(2)}</p></div>
                <div>
                    <Button variant='contained' color='secondary' className="addtocartbutton"
                        disabled={!isAuthenticated}
                        onClick={() => { AddToCart(food._id, food.name, 1, food.price.toFixed(2), food.img) }}>
                        Add to Cart
					</Button>
                </div>
            </div>

        );
    }
}