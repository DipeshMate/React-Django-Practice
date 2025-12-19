import React, { useState } from "react";
import { Link , NavLink as Nav} from "react-router-dom";
import './Styles.css';
import axios from "axios";

const LoginPage=()=> {
  const [state, setState] = useState({email: "", password: "" });

  const handleChange = (e) => {
    const value = e.target.value;
    setState({
      ...state,
      [e.target.name]: value
    });
  };

  const handleOnSubmit = (e) => {
    (e).preventDefault();

    const { email, password } = state;
    alert(`You are login with email: ${email} and password: ${password}`);

  }    

  return (
    <div className="sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Log in</h1>
        <span>or use your account</span>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={state.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
        />
        <Link to={'/reset-password'}>
        <a href="#">Forgot your password?</a>
        </Link>
        <button>Log In</button>
        <div className='create-account'>
        <span>Don't have an Account? </span>
        <Link to={'/register'}>
            <a className='create-account-btn' style={{backgroundColor:'#007bff',color:'#fff',padding:'1px 8px', textDecoration:'none',borderRadius:'10px'}} href="#"> Create Account</a>
        </Link>
        </div> 

      </form>
    </div>
  );
}

export default LoginPage;
