import React, { useEffect, useState } from 'react';
import axiosConfig from '../../api/axiosConfig';
import ReactPaginate from 'react-paginate';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(20);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [updatedProduct, setUpdatedProduct] = useState({
        title: '',
        description: '',
        price: '',
        brand: '',
        stock: '',
        category: '',
        warrantyInformation: '',
        shippingInformation: ''
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosConfig.get(`products?page=${currentPage}&limit=${limit}`);
                setProducts(response.data.products);
                setPageCount(response.data.pageCount);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, [currentPage, limit]);

    const handleDeleteProduct = async (productId) => {
        try {
            await axiosConfig.delete(`products/${productId}`);
            setProducts(products.filter(product => product._id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const openModal = (product) => {
        setSelectedProduct(product);
        setUpdatedProduct({
            title: product.title,
            description: product.description,
            price: product.price,
            brand: product.brand,
            stock: product.stock,
            category: product.category,
            warrantyInformation: product.warrantyInformation,
            shippingInformation: product.shippingInformation
        });
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedProduct(null);
    };

    const handleUpdateProduct = async () => {
        try {
            const response = await axiosConfig.put(`products/${selectedProduct._id}`, updatedProduct);
            const updatedProducts = products.map(product =>
                product._id === selectedProduct._id ? response.data : product
            );
            setProducts(updatedProducts);
            closeModal();
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handlePageClick = (data) => {
        const selectedPage = data.selected + 1;
        setCurrentPage(selectedPage);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Product Management</h2>
            <Link to={'/admin/addProduct'}><button className='btn btn-success mb-3'>Add Product</button></Link>
            <div className="accordion" id="productAccordion">
                {products.map((product, index) => (
                    <div key={index} className="card mb-4">
                        <div className="card-header" id={`heading${product._id}`}>
                            <h5 className="mb-0">
                                <button className="btn btn-link" type="button" data-toggle="collapse" data-target={`#collapse${product._id}`} aria-expanded="true" aria-controls={`collapse${product._id}`}>
                                    {product.title}
                                </button>
                                <button className="btn btn-danger float-right ml-2" onClick={() => handleDeleteProduct(product._id)}>
                                    Delete
                                </button>
                            </h5>
                        </div>
                        <div id={`collapse${product._id}`} className="collapse show" aria-labelledby={`heading${product._id}`} data-parent="#productAccordion">
                            <div className="card-body">
                                <p className="mb-2">Price: ${product.price}</p>
                                <button className="btn btn-success" onClick={() => openModal(product)}>View/Edit Details</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedProduct && (
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                    <h2 className="mb-4">Product Details</h2>
                    <form className="needs-validation">
                        <div className="row g-3">
                            <div className="col-md-12">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={updatedProduct.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter product title"
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={updatedProduct.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter product description"
                                    required
                                    className="form-control"
                                ></textarea>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="price" className="form-label">Price</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={updatedProduct.price}
                                    onChange={handleInputChange}
                                    placeholder="Enter price"
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="brand" className="form-label">Brand</label>
                                <input
                                    type="text"
                                    id="brand"
                                    name="brand"
                                    value={updatedProduct.brand}
                                    onChange={handleInputChange}
                                    placeholder="Enter brand"
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="stock" className="form-label">Stock</label>
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    value={updatedProduct.stock}
                                    onChange={handleInputChange}
                                    placeholder="Enter stock quantity"
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="category" className="form-label">Category</label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    value={updatedProduct.category}
                                    onChange={handleInputChange}
                                    placeholder="Enter category"
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="warrantyInformation" className="form-label">Warranty Information</label>
                                <input
                                    type="text"
                                    id="warrantyInformation"
                                    name="warrantyInformation"
                                    value={updatedProduct.warrantyInformation}
                                    onChange={handleInputChange}
                                    placeholder="Enter warranty information"
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="shippingInformation" className="form-label">Shipping Information</label>
                                <input
                                    type="text"
                                    id="shippingInformation"
                                    name="shippingInformation"
                                    value={updatedProduct.shippingInformation}
                                    onChange={handleInputChange}
                                    placeholder="Enter shipping information"
                                    required
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <button className="btn btn-primary mt-3" onClick={handleUpdateProduct}>Update</button>
                        <button className="btn btn-secondary ml-2 mt-3" onClick={closeModal}>Close</button>
                    </form>
                </Modal>
            )}

            <ReactPaginate
                previousLabel={<span aria-hidden="true">&laquo;</span>}
                nextLabel={<span aria-hidden="true">&raquo;</span>}
                breakLabel={<span>...</span>}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName="pagination justify-content-center mt-4"
                activeClassName="active"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
            />
        </div>
    );
};

export default ProductManagement;
