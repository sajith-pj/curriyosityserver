import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './ChangePassword.css'
import { useHistory } from 'react-router-dom'
axios.defaults.withCredentials = true
export default function ChangePassword() {
    const [password,setPassword] = useState()
    const [newPassword,setNewPassword] = useState()
    const [confirmPassword,setConfirmNewPassword] = useState()
    const [msg,setMsg] = useState(false)
    const [passwordMsg,setPasswordMsg] = useState(false)
    const history = useHistory()
    const changePassword = ( event )=>{
        event.preventDefault()
        if(newPassword !== confirmPassword){
            setMsg(true)
            setTimeout( ()=>{
                setMsg(false)
            },3000)
        }else{
            axios.post('/admin/change-password',{password,newPassword},{withCredentials:true}).then(( response )=>{
                if (response.data.loggedIn === false) {
                    history.push('/admin/')
                  }
                  if(response.data.changePassword === true){
                    setPasswordMsg(true)
                    setTimeout( ()=>{
                        setPasswordMsg(false)
                    },3000)
                }
        })
        }
    }
    const ValidityCheck = () => {
        axios.get('http://localhost:3001/admin/change-password', { withCredentials: true }).then(response => {
          console.log(response);
          if (response.data.loggedIn === false) {
            history.push('/admin/')
          }
        })
      }

    useEffect( ()=>{
        ValidityCheck()
    },[])
    return (
        <div className="container">
            { msg ? 
            <div className="row">
                <div className="col-12">
                <div class="alert alert-danger" role="alert">
                    Please Check Your Password
                    </div>
                </div>
            </div>
            :null  }
            { passwordMsg ? 
            <div className="row">
                <div className="col-12">
                <div class="alert alert-success" role="alert">
                    Password Updated Successfully
                    </div>
                </div>
            </div>
            :null  }
            <div className="row  d-flex justify-content-center align-items-center" style={{height:"100vh"}}>
                <div className="col-12 col-md-6 change-password">
                <form onSubmit={changePassword}>
                    <div className="mb-3">
                        <label for="exampleInputPassword1" className="form-label"> Old Password</label>
                        <input type="password" className="form-control text-color " onChange={(event)=> setPassword(event.target.value)} value={password} />
                    </div>
                    <div className="mb-3">
                        <label for="exampleInputPassword1" className="form-label"  > New Password</label>
                        <input type="password" className="form-control text-color " onChange={ (event)=> setNewPassword(event.target.value)} value={newPassword} />
                    </div>
                    <div className="mb-3">
                        <label for="exampleInputPassword1" className="form-label" > Confirm Password</label>
                        <input type="password" className="form-control text-color " value={confirmPassword}
                         onChange={ (event)=> {setConfirmNewPassword(event.target.value); }} />
                    </div>
                    <button type="submit" className="btn btn-primary"> Change Password </button>
                </form>
            </div>
            </div>
        </div>
    )
}
