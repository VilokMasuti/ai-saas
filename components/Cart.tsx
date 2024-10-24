"use client";

import { useDispatch, useSelector } from "react-redux";

import { useEffect, useState } from "react";

const Cart = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const { cart } = useSelector((state) => state);
  console.log(cart?.cartItems);
  const dispatch = useDispatch();
  if (!cart?.cartItems.length)
    return <h1 className="text-4xl font-bold p-10">Cart is empty.</h1>;
  return (
    <div>Cart</div>
  )
}

export default Cart
