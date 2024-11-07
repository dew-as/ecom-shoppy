// src/components/ProductsList.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import axiosConfig from '../../api/axiosConfig';
import ReactPaginate from 'react-paginate';
import ShimmerProductCard from '../Shimmer/ShimmerProductCard';
import checkAuth from '../../auth/checkAuth';

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    const itemsPerPage = 20;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axiosConfig.get(`/products?page=${currentPage}&limit=${itemsPerPage}`);
                setProducts(response.data.products);
                setPageCount(Math.ceil(response.data.total / itemsPerPage));
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [currentPage]);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    return (
        <Container>
            <h2 className="my-4 text-center">All Products</h2>
            <Row>
                {loading
                    ? Array.from({ length: itemsPerPage }).map((_, index) => (
                        <ShimmerProductCard key={index} />
                    ))
                    : products.map((product) => (
                        <Col md={3} className="mb-4" key={product._id}>
                            <Card onClick={() => navigate(`/products/${product._id}`)}>
                                <Card.Img variant="top" src={product.thumbnail} alt={product.title} />
                                <Card.Body>
                                    <Card.Title>{product.title}</Card.Title>
                                    <Card.Text>Price: ${product.price}</Card.Text>
                                    <Card.Text>Category: {product.category}</Card.Text>
                                    <Link to={`/products/${product._id}`}>
                                        <Button variant="primary">View Details</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
            </Row>
            <ReactPaginate
                previousLabel={'← Previous'}
                nextLabel={'Next →'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={'pagination justify-content-center'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                activeClassName={'active'}
            />
        </Container>
    );
};

export default checkAuth(ProductsList);
