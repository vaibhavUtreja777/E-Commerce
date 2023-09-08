import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Footer, Navbar } from "../components";
import Axios from "axios";
import { setUser } from '../redux/action';
import { useDispatch , useSelector } from 'react-redux';
import { useState } from 'react';

const Login = () => {
  const dispatch = useDispatch()
  const state = useSelector((state) => state.handleCart);
  const [email, ChangeEmail] = useState("");
  const [password, ChangePassword] = useState("");
  function onChangeEmail(e) {
    ChangeEmail(e.target.value);
  }
  function onChangePassword(e) {
    ChangePassword(e.target.value);
  }
  const navigate = useNavigate()
  async function onSubmit(e) {
    e.preventDefault();
    
    ChangeEmail("");
    ChangePassword("");
    await Axios.post('http://localhost:4000/login', {username:email,password})
      .then (async(res) => {
        if (res.data.authenticated) {
          const {gender , brand} = res.data.data
          if(state.length <= 0 )
            dispatch(setUser({email,gender,brand}))
          else {
            dispatch(setUser({email,gender,brand : state[state.length-1].Brand}))
            await Axios.post('http://localhost:4000/brand' , {username : email , brand  : state[state.length-1].Brand})
          }

          navigate(-1)
          
        } 
      })
      .catch(err => {
        console.log(err)
      })
  }
  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Login</h1>
        <hr />
        <div class="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form>
              <div class="my-3">
                <label for="display-4">Email address</label>
                <input
                  type="email"
                  class="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  value={email}
                  onChange={onChangeEmail}
                />
              </div>
              <div class="my-3">
                <label for="floatingPassword display-4">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  value={password}
                  onChange={onChangePassword}
                />
              </div>
              <div className="my-3">
                <p>New Here? <Link to="/register" className="text-decoration-underline text-info">Register</Link> </p>
              </div>
              <div className="text-center">
                <button class="my-2 mx-auto btn btn-success"onClick={onSubmit} >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
