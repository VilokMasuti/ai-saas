import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./silce/cartslice";

const store = configureStore({
  reducer:{
cart: cartReducer
  }
})

 export default store
