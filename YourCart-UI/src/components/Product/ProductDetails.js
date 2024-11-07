import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, fetchCart } from '../../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../../redux/slices/wishListSlice';
import axiosConfig from '../../api/axiosConfig';
import { Container, Row, Col, Card, Badge, ListGroup, Button } from 'react-bootstrap';
import { FaHeart } from 'react-icons/fa';
import checkAuth from '../../auth/checkAuth';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isInCart, setIsInCart] = useState(false);
    const dispatch = useDispatch();

    const cartItems = useSelector((state) => state.cart.items);
    const wishlistItems = useSelector((state) => state.wishlist.items); // Select wishlist items from Redux state

    // Check if product is in wishlist by finding its ID in wishlistItems
    const isInWishlist = wishlistItems.some(item => item._id === id);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosConfig.get(`/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        const checkCartStatus = () => {
            const foundInCart = cartItems.some(item => item.productId === id);
            setIsInCart(foundInCart);
        };

        dispatch(fetchWishlist()); // Fetch wishlist to ensure it's up to date
        fetchProduct();
        checkCartStatus();
    }, [id, dispatch, cartItems]);

    const handleAddToCart = async () => {
        if (!isInCart) {
            const quantity = 1;
            await dispatch(addToCart({ productId: id, quantity }));
            await dispatch(fetchCart());
            setIsInCart(true);
        }
    };

    const handleWishlistToggle = async () => {
        if (isInWishlist) {
            await dispatch(removeFromWishlist(id));
        } else {
            await dispatch(addToWishlist(id));
        }
        dispatch(fetchWishlist());
    };

    if (!product) return <p>Loading...</p>;

    return (
        <Container className="my-5">
            <Row>
                <Col md={6}>
                    <Card>
                        <Card.Img variant="top" src={product.thumbnail} alt={product.title} />
                        <Card.Body>
                            <Row>
                                {product.images.slice(0, 2).map((img, index) => (
                                    <Col key={index} md={6}>
                                        <img src={img} alt={`Product ${index}`} className="img-fluid mb-2" />
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <h2>{product.title}</h2>
                    <p><strong>Description:</strong> {product.description}</p>
                    <h4 className="text-primary">${product.price}</h4>
                    <Badge bg="success" className="mb-2">{product.availabilityStatus}</Badge>
                    <p><strong>Discount:</strong> {product.discountPercentage}%</p>
                    <p><strong>Rating:</strong> {product.rating}</p>
                    <p><strong>Stock:</strong> {product.stock}</p>
                    <p><strong>Brand:</strong> {product.brand}</p>
                    <p><strong>Warranty:</strong> {product.warrantyInformation}</p>
                    <p><strong>Shipping:</strong> {product.shippingInformation}</p>
                    <p><strong>Return Policy:</strong> {product.returnPolicy}</p>
                    <p><strong>Minimum Order Quantity:</strong> {product.minimumOrderQuantity}</p>

                    <div className="d-flex align-items-center my-3">
                        <Button
                            variant="primary"
                            onClick={handleAddToCart}
                            className="me-3"
                            disabled={isInCart}
                        >
                            {isInCart ? 'In Cart' : 'Add to Cart'}
                        </Button>
                        <FaHeart
                            onClick={handleWishlistToggle}
                            className={isInWishlist ? 'text-danger' : 'text-secondary'}
                            size={24}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>

                    <h5>Reviews</h5>
                    <ListGroup variant="flush">
                        {product.reviews.map((review, index) => (
                            <ListGroup.Item key={index}>
                                <strong>{review.reviewerName}</strong> ({review.reviewerEmail}): {review.comment}
                                <br />
                                <small>Rating: {review.rating} - {new Date(review.date).toLocaleDateString()}</small>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
};

export default checkAuth(ProductDetails);
