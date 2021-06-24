import React, { useEffect, useState } from 'react';
import './Login.css'
import logo from '../../assets/logo.png'
import { useHistory } from 'react-router-dom';
import axios from 'axios';
export default function Login() {

	const history =  useHistory()
	const [email,setEmail] = useState('')
	const [password,setPassword] = useState('')
	const [userData,setUserData] = useState({})




	const doLogin = ( event ) => {
		event.preventDefault()
		axios.post('/admin/login',{email,password}).then( response =>{
			if(response.data.status){
				history.push({pathname:'/admin/products'})
			}else{
				history.push({pathname:'/admin/'})

			}
		})
	}
	return (
		<div className="login-background">
		<div className="container">
			<div className="row login-section">
				<div className="col-12 login-container">
					<div className="row">
						<div className="col-6">
							<h1 className="text-color font-dosis">Login</h1>
						</div>
						<div className="col-6">
							<img src={logo} className="logo-img"  alt=" " />
						</div>
					</div>
					<form className="login-form" onSubmit={ doLogin }>
						<div className="mb-3 mt-4">
							<label for="email-id " className="form-label text-color font-dosis">
								Email Address
					</label>
							<input type="email" className="form-control text-color" placeholder=" example@gmail.com" onChange={ ( event )=> setEmail(event.target.value)}  value={email} name="email-id" aria-describedby="emailHelp" />
						</div>
						<div className="mb-3 mt-4">
							<label for="password" className="form-label text-color  font-dosis" >
								Password
					</label>
							<input type="password" value={password} onChange={(event)=> setPassword(event.target.value)}  placeholder=" Password " className="form-control text-color" name="password" />
						</div>
			
						<button type="submit" className="btn btn-outline-white login-btn w-100 mt-3">
							Login
				</button>
					</form>
				</div>
			</div>
		</div>
		</div>
	);
}
