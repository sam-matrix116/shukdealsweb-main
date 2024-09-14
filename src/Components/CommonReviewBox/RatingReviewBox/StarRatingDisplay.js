import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faStar as fasStar,
	faStarHalfAlt,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import './StarRatingDisplay.css'; // Import your custom CSS for styling

const StarRatingDisplay = ({ rating, size }) => {
	// Calculate the number of full stars and half stars
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating - fullStars >= 0.5;
	const totalStars = 5;

	// Create an array to hold the stars
	const stars = [];

	// Fill the array with full stars
	for (let i = 0; i < fullStars; i++) {
		stars.push(
			<FontAwesomeIcon
				key={i}
				icon={fasStar}
				className='star-icon filled'
				style={{ fontSize: size }}
			/>
		);
	}

	// Add a half star if necessary
	if (hasHalfStar) {
		stars.push(
			<FontAwesomeIcon
				key={fullStars}
				icon={faStarHalfAlt}
				className='star-icon filled'
				style={{ fontSize: size }}
			/>
		);
	}

	// Fill the rest with empty stars
	while (stars.length < totalStars) {
		stars.push(
			<FontAwesomeIcon
				key={stars.length}
				icon={fasStar}
				className='star-icon empty'
			/>
		);
	}

	return (
		<div className='star-rating' style={{ fontSize: size }}>
			{stars.map((star, index) => (
				<span key={index} className='star-container'>
					{star}
				</span>
			))}
		</div>
	);
};

export default StarRatingDisplay;
