import React, { useState, useRef, useEffect } from 'react';
import './VerticalThumbnailCrousel.css'; // Import the updated CSS file
import { Endpoints } from '../../../API/Endpoints';
const $ = window.jQuery;

const VerticalThumbnailCrousel = ({ images, isUrl = true }) => {
	useEffect(() => {
		if (images) {
			$('.deal-slider').owlCarousel({
				loop: true,
				items: 1,
				margin: 0,
				stagePadding: 0,
				autoplay: false,
			});

			let dotcount = 1;

			$('.deal-slider .owl-dot').each(function () {
				$(this).addClass('dotnumber' + dotcount);
				$(this).attr('data-info', dotcount);
				dotcount = dotcount + 1;
			});

			let slidecount = 1;

			$('.deal-slider .owl-item')
				.not('.cloned')
				.each(function () {
					$(this).addClass('slidenumber' + slidecount);
					slidecount = slidecount + 1;
				});

			$('.deal-slider .owl-dot').each(function () {
				let grab = $(this).data('info');
				let slidegrab = $('.slidenumber' + grab + ' img').attr('src');
				$(this).css('background-image', 'url(' + slidegrab + ')');
			});

			let amount = $('.deal-slider .owl-dot').length;
			let gotowidth = 100 / amount;
			// alert(gotowidth)
			$('.deal-slider .owl-dot').css(
				'height',
				// gotowidth == 100 ? 40 : gotowidth + '%'
				gotowidth == 100 ? 40 : 30 + '%'
			);
			if (gotowidth == 100) {
				$('.deal-slider .owl-dots').removeClass('disabled');
			}
		}
	}, [images]);

	return (
		<div className='deal-slider owl-theme owl-carousel owl-loaded owl-drag'>
			{images &&
				images.map((image, index) => (
					<img
					style={{
						// objectFit: 'contain'
						// height: '800px'
					}}
						src={isUrl ? image : Endpoints.baseUrl + image?.image}
						alt={`Thumbnail ${index + 1}`}
						className='deal-item'
					/>
				))}
		</div>
	);
};

export default VerticalThumbnailCrousel;
