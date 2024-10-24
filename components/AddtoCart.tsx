"use client";

import { useDispatch, useSelector } from "react-redux";
import { addtoCart, removeFromCart } from "../store/silce/cartslice";
import React from 'react'
import { Button,  } from './ui/button'


const AddtoCart = ({ProductItem}:any) => {
  const { cart } = useSelector((state) => state);
  console.log(cart?.cartItems);
  const dispatch = useDispatch();

  function handleAddToCart() {
    dispatch(addtoCart(ProductItem));
  }

  function handleRemoveFromCart() {
    dispatch(removeFromCart(ProductItem?.id));
  }

  return (
    <div className="mt-8 max-w-md">
    <Button
      type="button"
      onClick={
        cart?.cartItems.some((item: { id: any; }) => item.id === ProductItem.id)
          ? handleRemoveFromCart
          : handleAddToCart
      }
    >
      {cart?.cartItems.some((item) => item.id === ProductItem.id)
        ? "Remove from cart"
        : "Add to cart"}
    </Button>
  </div>

  )
}

export default AddtoCart
