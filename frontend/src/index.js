import React from 'react';
import ReactDOM from 'react-dom/client';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';


import { Home, Product, Products, AboutPage, ContactPage, Cart, Login, Register, Checkout, PageNotFound } from "./pages"
import ChatBot from "./pages/ChatBot/ChatBot"
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from './redux/action';
const root = ReactDOM.createRoot(document.getElementById('root'));


function Main(){
  const dispatch = useDispatch()
  useEffect(()=>{
      async function getUser(){
        await axios.get('http://localhost:4000/getUser')
          .then((res)=>{
            if(res.data.authenticated){
              dispatch(setUser(res.data.user))
            }
          })
          .catch((err)=>console.log(err))
      }
      getUser()
  },[])
  return(
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/product/*" element={<Product />} />
      </Routes>
    </>
  )
}
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Main/>
    </Provider>
  </BrowserRouter>
);