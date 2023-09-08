import React from 'react'
import { Footer, Navbar } from "../components";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { setUser } from '../redux/action';
import { useDispatch } from 'react-redux';
import axios from "axios";
const Register = () => {
    const dispatch = useDispatch()
    const [email, ChangeEmail] = useState("");
    const [password, ChangePassword] = useState("");
    const [gender, setGender] = useState("");
    function onChangeEmail(e) {
        ChangeEmail(e.target.value);
    }
    const navigate = useNavigate()
    function onChangePassword(e) {
        ChangePassword(e.target.value);
    }
    async function onSubmit(e) {
        e.preventDefault();
        dispatch(setUser({email,gender,brand:[]}))
        await axios.post("http://localhost:4000/register", { email, password , gender})
            .then((res) => {
                if (res.data.authenticated) {
                    alert(' auth successful user redirected to login page')
                    navigate('/login')
                }
            })
            .catch((err) => console.log(err));
        ChangeEmail("");
        ChangePassword("");
        setGender("")

    }

    return (
        <>
            <Navbar />
            <div className="container my-3 py-3">
                <h1 className="text-center">Register</h1>
                <hr />
                <div class="row my-4 h-100">
                    <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
                        <form>
                            <div class="form my-3">
                                <label for="Email">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="Email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={onChangeEmail}
                                />
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="Male"onClick={()=>setGender("Male")} />
                                <label class="form-check-label" for="Male" onClick={()=>setGender("Male")}>
                                    Male
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="Female" onClick={()=>setGender("Female")} />
                                <label class="form-check-label" for="Female" onClick={()=>setGender("Female")}>
                                    Female
                                </label>
                            </div>
                            <div className="form  my-3">
                                <label for="Password">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="Password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={onChangePassword}
                                />
                            </div>
                            <div className="my-3">
                                <p>Already has an account? <Link to="/login" className="text-decoration-underline text-info">Login</Link> </p>
                            </div>
                            <div className="text-center">
                                <button className="my-2 mx-auto btn btn-success" onClick={onSubmit}>
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Register