"use client";
import Header from '../components/header/Header.tsx'
import { Provider } from "react-redux";
import store from "../store";
 export const ReduxProvider = ({children}) =>{
  return(
    <Provider store={store}>
    <Header/>
    {children}
    </Provider>
  )
 }
