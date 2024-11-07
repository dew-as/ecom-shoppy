// src/components/Home.js

import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
    return (
        <div className="container w-50 my-2">
            <Carousel interval={2000} fade controls={false}>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://img.freepik.com/free-vector/flat-design-paddle-tennis-twitch-background_23-2151030701.jpg"
                        alt="First slide"
                        style={{ objectFit: 'cover', height: '400px' }}
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://img.freepik.com/free-psd/horizontal-banner-template-big-sale-with-woman-shopping-bags_23-2148786758.jpg"
                        alt="Second slide"
                        style={{ objectFit: 'cover', height: '400px' }}
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://img.freepik.com/free-vector/horizontal-banner-template-black-friday-sales_23-2150860326.jpg"
                        alt="Third slide"
                        style={{ objectFit: 'cover', height: '400px' }}
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://img.freepik.com/free-psd/online-sale-banner-template_23-2149225726.jpg"
                        alt="Fourth slide"
                        style={{ objectFit: 'cover', height: '400px' }}
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://img.freepik.com/free-psd/horizontal-banner-template-sale-with-woman-shopping-bags_23-2148845737.jpg"
                        alt="Fifth slide"
                        style={{ objectFit: 'cover', height: '400px' }}
                    />
                </Carousel.Item>
            </Carousel>
        </div>
    );
};

export default Home;
