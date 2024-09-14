import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import './style.css';

const StarRatingHandler = ({ rating , totalStars, onRatingChange }) => {
	const handleStarClick = (index) => {
		if (onRatingChange) {
			onRatingChange(index + 1);
		}
	};

	return (
		<div className='select-star-rating'>
			{[...Array(totalStars)].map((_, index) => {
				const starValue = index + 1;
				const icon = starValue <= rating ? solidStar : regularStar;
				return (
					<FontAwesomeIcon
						key={index}
						icon={icon}
						className='select-star-icon'
						onClick={() => handleStarClick(index)}
					/>
				);
			})}
		</div>
	);
};

export default StarRatingHandler;
