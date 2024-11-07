import React, { useState } from 'react';
import axios from 'axios';
import axiosConfig from '../../api/axiosConfig';

const AddProduct = () => {
    const [productData, setProductData] = useState({
        title: '',
        description: '',
        category: '',
        price: '',
        discountPercentage: '',
        rating: '',
        stock: '',
        tags: '',
        brand: '',
        warrantyInformation: '',
        shippingInformation: '',
        availabilityStatus: '',
        returnPolicy: '',
        minimumOrderQuantity: '',
        images: [],
    });

    const [thumbnail, setThumbnail] = useState(null);

    const handleChange = (e) => {
        setProductData({
            ...productData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setProductData({
            ...productData,
            images: Array.from(e.target.files),
        });
    };

    const handleThumbnailChange = (e) => {
        setThumbnail(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(productData).forEach((key) => {
            if (key === 'tags') {
                formData.append(key, JSON.stringify(productData[key].split(',')));
            } else if (key === 'images') {
                productData.images.forEach((file) => {
                    formData.append('images', file);
                });
            } else {
                formData.append(key, productData[key]);
            }
        });

        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        try {
            const response = await axiosConfig.post('products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(response.data);
            alert('Product added successfully!');
        } catch (error) {
            console.error(error);
            alert('Error adding product');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="needs-validation" noValidate>
                <div className="row g-3">
                    <div className="col-md-6">
                        <input type="text" name="title" placeholder="Title" onChange={handleChange} required className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <textarea name="description" placeholder="Description" onChange={handleChange} required className="form-control"></textarea>
                    </div>
                    <div className="col-md-6">
                        <input type="text" name="category" placeholder="Category" onChange={handleChange} required className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <input type="number" name="price" placeholder="Price" onChange={handleChange} required className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <input type="number" name="discountPercentage" placeholder="Discount %" onChange={handleChange} required className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <input type="number" name="rating" placeholder="Rating" onChange={handleChange} required className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <input type="number" name="stock" placeholder="Stock" onChange={handleChange} required className="form-control" />
                    </div>
                    <div className="col-md-12">
                        <input type="text" name="tags" placeholder="Tags (comma-separated)" onChange={handleChange} className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <input type="text" name="brand" placeholder="Brand" onChange={handleChange} required className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <input type="text" name="warrantyInformation" placeholder="Warranty Info" onChange={handleChange} required className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <input type="text" name="shippingInformation" placeholder="Shipping Info" onChange={handleChange} required className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <input type="text" name="availabilityStatus" placeholder="Availability Status" onChange={handleChange} required className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <input type="text" name="returnPolicy" placeholder="Return Policy" onChange={handleChange} required className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <input type="number" name="minimumOrderQuantity" placeholder="Min Order Quantity" onChange={handleChange} required className="form-control" />
                    </div>
                </div>

                <div className="mt-4">
                    <label htmlFor="images" className="form-label">Images:</label>
                    <input type="file" multiple onChange={handleFileChange} accept="image/*" className="form-control" />
                </div>

                <div className="mt-4">
                    <label htmlFor="thumbnail" className="form-label">Thumbnail:</label>
                    <input type="file" onChange={handleThumbnailChange} accept="image/*" className="form-control" />
                </div>

                <div className="mt-4">
                    <button type="submit" className="btn btn-primary">Add Product</button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
