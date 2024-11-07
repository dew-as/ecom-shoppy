import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { fetchCart, addToCart, removeFromCart } from '../redux/slices/cartSlice';
import { fetchWishlist, addToWishlist, removeFromWishlist } from '../redux/slices/wishListSlice';
import axiosConfig from '../api/axiosConfig';
import { decreaseCartItemQuantity } from '../redux/slices/cartSlice';
import { placeOrder } from '../redux/slices/orderSlice';

const Header = () => {
    const [showCartModal, setShowCartModal] = useState(false);
    const [showWishlistModal, setShowWishlistModal] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const isAdmin = useSelector((state) => state.auth.isAdmin);
    const cartItems = useSelector((state) => state.cart.items);
    const wishlistItems = useSelector((state) => state.wishlist.items);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCart());
            dispatch(fetchWishlist());
        }
    }, [isAuthenticated, dispatch]);

    const handleLogout = async () => {
        await axiosConfig.post('/users/logout');
        await dispatch(logout());
        navigate('/login');
    };

    const cartRef = useRef(null);
    const wishlistRef = useRef(null);
    const [cartPosition, setCartPosition] = useState({ top: 0, left: 0 });

    const openCartModal = () => {
        const cartRect = cartRef.current.getBoundingClientRect();
        setCartPosition({ top: cartRect.bottom + window.scrollY, left: cartRect.left + window.scrollX });
        setShowCartModal(true);
        console.log(cartItems[0]);

    };

    const handleRemoveCart = async (item) => {
        await dispatch(removeFromCart(item.productId._id))
        dispatch(fetchCart())
    }

    const handleRemoveWishlist = async (item) => {
        await dispatch(removeFromWishlist(item._id));
        dispatch(fetchWishlist());
    };

    const handleAddToCart = async (id) => {
        const quantity = 1; // You can modify this to accept user input
        await dispatch(addToCart({ productId: id, quantity: quantity }));
        await dispatch(fetchCart());
    };

    const handleDecreaseQuantity = async (item) => {
        await dispatch(decreaseCartItemQuantity(item.productId._id));
        dispatch(fetchCart());
    };

    const handlePlaceOrder = async () => {
        const orderData = cartItems.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity
        }));
        await dispatch(placeOrder({ items: orderData }));
        await dispatch(fetchCart())
        setShowCartModal(false); // Close modal after placing order
        navigate('/orders'); // Redirect to orders page
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <div>
                        <Link to="/" className="navbar-brand">Your Company</Link>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-toggle="collapse"
                            data-target="#navbarToggler"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>
                    <div className="collapse navbar-collapse" id="navbarToggler">
                        <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                            <li className="nav-item">
                                <Link to="/" className="nav-link">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/about" className="nav-link">About</Link>
                            </li>
                            {isAuthenticated && (
                                <>
                                    <li className="nav-item">
                                        <Link to="/profile" className="nav-link">Profile</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/products" className="nav-link">Products</Link>
                                    </li>
                                    <li className="nav-item" ref={wishlistRef}>
                                        <span
                                            onClick={() => setShowWishlistModal(true)}
                                            className="nav-link"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Wishlist <FaHeart className='text-danger' />
                                            <span>({wishlistItems.length})</span>
                                        </span>
                                    </li>
                                    <li className="nav-item" ref={cartRef}>
                                        <span
                                            onClick={openCartModal}
                                            className="nav-link"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Cart <FaShoppingCart />
                                            <span>({cartItems.length})</span>
                                        </span>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/orders" className="nav-link">Orders</Link>
                                    </li>
                                </>
                            )}
                            {
                                isAuthenticated && isAdmin && (
                                    <li className="nav-item">
                                        <Link to="/admin" className="nav-link">Admin Page</Link>
                                    </li>
                                )
                            }
                            {isAuthenticated ? (
                                <li className="nav-item">
                                    <Link to="/login" onClick={handleLogout} className="nav-link">Logout</Link>
                                </li>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link to="/login" className="nav-link">Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/register" className="nav-link">Register</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Cart Modal */}
            {showCartModal && (
                <div
                    className="modal show d-block"
                    style={{
                        position: 'absolute',
                        top: `${cartPosition.top}px`,
                        left: `${cartPosition.left}px`,
                        zIndex: 1050,
                        width: '250px'
                    }}
                    tabIndex="-1"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Your Cart</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowCartModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {cartItems.length > 0 ? (
                                    <div>
                                        {cartItems.map((item) => (
                                            <div key={item._id} className='border border-1 p-2 m-1'>
                                                <p>{item.productId.title}</p>
                                                <div className='d-flex justify-content-between'>
                                                    <p>Quanityt: {item.quantity}</p>
                                                    <p>
                                                        <span onClick={() => handleAddToCart(item.productId._id)} className="cursor-pointer btn btn-outline-primary me-2">
                                                            +
                                                        </span>
                                                        <span
                                                            onClick={() => handleDecreaseQuantity(item)}
                                                            className="cursor-pointer btn btn-outline-danger">
                                                            -
                                                        </span>

                                                    </p>
                                                </div>
                                                <div className='d-flex justify-content-between'>
                                                    <p>Price: {Math.round(item.price)}</p>
                                                    <button
                                                        className='btn btn-secondary'
                                                        onClick={() => { handleRemoveCart(item) }}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={handlePlaceOrder} className='btn btn-secondary w-100 mt-2'>Place Order</button>                                    </div>
                                ) : (
                                    <p>Your cart is empty.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Wishlist Modal */}
            {showWishlistModal && (
                <div
                    className="modal show d-block"
                    style={{
                        position: 'absolute',
                        top: `${wishlistRef.current.getBoundingClientRect().bottom}px`,
                        left: `${wishlistRef.current.getBoundingClientRect().left}px`,
                        zIndex: 1050,
                        width: '250px'
                    }}
                    tabIndex="-1"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Your Wishlist</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowWishlistModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {wishlistItems.length > 0 ? (
                                    wishlistItems.map((item) => (
                                        <div key={item._id}>
                                            <p><Link to={'/products/' + item._id}>{item.title}</Link></p>
                                            <button
                                                onClick={() => handleRemoveWishlist(item)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p>Your wishlist is empty.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
