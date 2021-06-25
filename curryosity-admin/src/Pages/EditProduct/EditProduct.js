import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './EditProduct.css'
import axios from 'axios';
axios.defaults.withCredentials = true;
export default function EditProduct() {
	const location = useLocation();
	const history = useHistory();
	const [product,setProduct] = useState({});
	const [productName, setProductName] = useState();
	const [category, setCategory] = useState();
	const [price, setPrice] = useState();
	const [description, setDescription] = useState();
	const [file, setFile] = useState();
	const [contentType, setContentType] = useState();
	const [base, setBase] = useState();
	const [Id,setId] = useState();
	const [errorMsg, setErrorMsg] = useState(false);

	const getProduct = (proId) => {
		axios.get(
				'/admin/edit-product',
				{
					params: {
						proId: proId,
					},
				},
				{ withCredentials: true }
			)
			.then((response) => {
				if (response.data.loggedIn === false) {
					history.push('/admin/');
				}
                setProductName(response.data.productName)
                setCategory(response.data.category)
                setPrice(response.data.price)
                setDescription(response.data.description)
                setId(response.data._id)
				setContentType(response.data.contentType)
				setBase(response.data.base64)
                console.log(response.data)

			});
	};


	const  updateProduct = ( event, id )=>{
		event.preventDefault()
		const data = new FormData()
        data.append('productName',productName)
        data.append('category',category)
        data.append('price',price)
        data.append('description',description)
        data.append('file',file)
        data.append('id',Id)
			axios.post('/admin/update-product',data,{withCredentials:true},{headers:{'Content-Type': 'multipart/form-data'}}).then( response =>{
				if(response.data.updated === true){
					history.push('/admin/products')
				}
			})
	}


	useEffect(() => {
		getProduct(location.id);

	},[]);
    
	return (
		<div className="container">
			<div className="row mt-5">
				<div className="col-12 d-flex justify-content-center">
					<h1> Edit Products </h1>
				</div>
			</div>
			{errorMsg ? (
				<div className="row">
					<div className="col-12">
						<div className="alert alert-warning alert-dismissible fade show" role="alert">
							<strong>Error Occured</strong> Please Input A Valid Information
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="alert"
								aria-label="Close"
							></button>
						</div>
					</div>
				</div>
			) : null}
			<div className="row">
				<div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
                <img className="product-image" src= {` data:{{`+contentType+`}};base64,`+ base}  alt=" "/>
				</div>
				<div className="col-12 col-md-6 mt-5">
					<form onSubmit={updateProduct} encType="multipart/form-data">
						<div className="mb-3">
							<label for="exampleInputEmail1" className="form-label">
								Name
							</label>
							<input
								type="text"
								className="form-control text-color"
								name="product-name"
								value={ productName   }
								required
								onChange={(event) => setProductName( event.target.value )}
							/>
						</div>
						<div className="mb-3">
							<label for="exampleInputPassword1" className="form-label">
								{' '}
								Category
							</label>
							<input
								type="text"
								className="form-control text-color"
								name="category"
								value={category }
								required
								onChange={(event) => setCategory(event.target.value)}
							/>
						</div>
						<div className="mb-3">
							<label for="exampleInputPassword1" className="form-label">
								{' '}
								Price
							</label>
							<input
								type="text"
								className="form-control text-color"
								name="price"
								value={price }
								required
								onChange={(event) => setPrice(event.target.value)}
							/>
						</div>
						<div className="mb-3">
							<label for="exampleInputPassword1" className="form-label">
								{' '}
								Description{' '}
							</label>
							<textarea
								name="description"
								className="form-control text-color"
								cols="30"
								rows="5"
								value={description}
								required
								onChange={(event) => setDescription(event.target.value)}
							></textarea>
						</div>
						<div className="mb-3">
							<label for="exampleInputPassword1" className="form-label">
								{' '}
								Image
							</label>
							<input
								type="file"
								className="form-control text-color"
								name="file"
								onChange={(event) => setFile(event.target.files[0])}
							/>
						</div>
							<button type="submit" className="btn btn-success w-75">
								Update
							</button>
					</form>
				</div>
			</div>
		</div>
	);
}
