import React, { useEffect, useState } from 'react';
import './AddProducts.css'
import img from '../../assets/bg.jpg'
import axios from 'axios';
import { useHistory } from 'react-router';
axios.defaults.withCredentials = true;
export default function AddProducts() {

    const history = useHistory()
    const [productName,setProductName] = useState()
    const [category,setCategory] = useState()
    const [price,setPrice] = useState()
    const [description,setDescription] = useState()
    const [file,setFile] = useState()
    const [errorMsg,setErrorMsg] = useState(false)


    const ValidityCheck =()=>{
		axios.get('/admin/add-product',{withCredentials:true}).then(response =>{
    
     if(response.data.loggedIn === false){
       history.push('/admin/')
     }
    })
	}

	useEffect( ()=>{
			ValidityCheck()
	},[])

    const addProducts = (event)=>{
        event.preventDefault()
        const data = new FormData()
        data.append('productName',productName)
        data.append('category',category)
        data.append('price',price)
        data.append('description',description)
        data.append('file',file)
        axios.post('/admin/add-product',data, {withCredentials:true },{headers:{'Content-Type': 'multipart/form-data'}}).then( response =>{
            if(response.data.success){
            setProductName('')
            setCategory('')
            setPrice('')
            setDescription('')
            setFile('')
            history.push({pathname:'/admin/products',success: response.data.success})
            }else{
                setErrorMsg(true)
            }
        }).catch((err)=>{
            console.log(err);
        })
    }
    return (
        <div className="container">
            <div className="row mt-5"> 
                <div className="col-12 d-flex justify-content-center">
                    <h1> Add Products </h1>
                </div>
            </div>
      {errorMsg?      
      <div className="row">
                <div className="col-12">
                <div className="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Error Occured</strong> Please Input A Valid Information
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                </div>
            </div>
            :null
            }
            <div className="row">
            <div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
                    <img src='' alt="" className="product-image" />
                </div>
                <div className="col-12 col-md-6 mt-5">
                    <form  onSubmit={addProducts} encType="multipart/form-data">
                        <div className="mb-3">
                            <label for="exampleInputEmail1" className="form-label">Name</label>
                            <input type="text" className="form-control text-color" name="product-name" value={productName} required onChange={( event)=> setProductName(event.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label for="exampleInputPassword1" className="form-label"> Category</label>
                            <input type="text" className="form-control text-color" name="category" value={category} required onChange={( event)=> setCategory(event.target.value)}  />
                        </div>
                        <div className="mb-3">
                            <label for="exampleInputPassword1" className="form-label"> Price</label>
                            <input type="text" className="form-control text-color" name="price" value={price} required onChange={( event)=> setPrice(event.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label for="exampleInputPassword1" className="form-label"> Description </label>
                            <textarea name="description" className="form-control text-color"  cols="30" rows="5" value={description} required onChange={( event)=> setDescription(event.target.value)} ></textarea>
                        </div>
                        <div className="mb-3">
                            <label for="exampleInputPassword1" className="form-label"> Image</label>
                            <input type="file" className="form-control text-color" name="file" onChange={ (event)=> setFile(event.target.files[0])}/>
                        </div>
                        <div className="mb-3 d-flex justify-content-center">
                        <button type="submit" className="btn btn-success w-75"> Add</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
