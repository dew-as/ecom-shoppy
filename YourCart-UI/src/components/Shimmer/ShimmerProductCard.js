// src/components/ShimmerProductCard.js
import React from 'react';
import { Card, Col } from 'react-bootstrap';
import './ShimmerProductCard.css'; // CSS for shimmer effect

const ShimmerProductCard = () => (
    <Col md={4} className="mb-4">
        <Card className="shimmer-card">
            <div className="shimmer-image"></div>
            <Card.Body>
                <div className="shimmer-title"></div>
                <div className="shimmer-text"></div>
                <div className="shimmer-text"></div>
            </Card.Body>
        </Card>
    </Col>
);

export default ShimmerProductCard;
