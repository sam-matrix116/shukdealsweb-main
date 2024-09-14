import React, { useEffect, useState } from 'react';
import './horizontalCarousel.css';
import { breakpoints } from '../../../helpers/displayViewHelper';
import i18next from 'i18next';

const HorizontalCarousel = ({ cardsLength, type, children }) => {
	const currentLanguage = i18next.language;
	const [currentIndex, setCurrentIndex] = useState(0);
	const [length, setLength] = useState(cardsLength);
	const [touchPosition, setTouchPosition] = useState(null);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	useEffect(() => {
		setLength(cardsLength);
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [children, cardsLength]);

	let show = 2; // Default value for mobile

	if (windowWidth >= breakpoints.tablet) {
		show = 3;
	}

	if (windowWidth >= breakpoints.desktop) {
		show = 4;
	}
	if (windowWidth >= breakpoints.wide && type === 'offer') {
		show = 5;
	}

	const next = () => {
		if (currentIndex < length - show) {
			setCurrentIndex((prevState) => prevState + 1);
		}
	};

	const prev = () => {
		if (currentIndex > 0) {
			setCurrentIndex((prevState) => prevState - 1);
		}
	};

	const handleTouchStart = (e) => {
		const touchDown = e.touches[0].clientX;
		setTouchPosition(touchDown);
	};

	const handleTouchMove = (e) => {
		const touchDown = touchPosition;

		if (touchDown === null) {
			return;
		}

		const currentTouch = e.touches[0].clientX;
		const diff = touchDown - currentTouch;

		if (diff > 5) {
			next();
		}

		if (diff < -5) {
			prev();
		}

		setTouchPosition(null);
	};
	console.log({ currentLanguage });
	return (
		<div className='carousel-container'>
			<div className='carousel-wrapper'>
				{currentIndex >= 0 && (
					<button onClick={prev} className='left-arrow'>
						<i
							className='fa-light fa-angle-left fa-4x'
							style={{ color: '#5b6b86' }}
						></i>
					</button>
				)}
				<div
					className={`carousel-content-wrapper`}
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
				>
					<div
						className={`carousel-content show-${cardsLength === 1 ? '1' : show} ${
							type !== 'navTab' ? 'gap-2' : 'gap-1'
						} `}
						style={{
							transform: ['he'].includes(currentLanguage)
								? `translateX(+${currentIndex * (100 / show)}%)`
								: `translateX(-${currentIndex * (100 / show)}%)`,
						}}
					>
						{children}
					</div>
				</div>
				{currentIndex < length - show && windowWidth >= breakpoints.desktop && (
					<button onClick={next} className='right-arrow'>
						<i
							className='fa-light fa-angle-right fa-4x'
							style={{ color: '#5b6b86' }}
						></i>
					</button>
				)}
			</div>
		</div>
	);
};

export default HorizontalCarousel;
