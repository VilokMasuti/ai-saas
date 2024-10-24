import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name:"cart",
  initialState,
  reducers:{
    addtoCart(state,action){
    state.cartItems.push(action.payload)
    }
  },
  removeFromCart(state,action){
    let cpyCartitem = [...state.cartItems];
    cpyCartitem = cpyCartitem.filter((item) => item.id !== action.payload);
    state.cartItems=cpyCartitem;
    return state;
  }

})

export const  {addtoCart,removeFromCart} = cartSlice.actions
export default cartSlice.reducer;
