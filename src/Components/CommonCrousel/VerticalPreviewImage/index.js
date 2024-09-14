import React, { useState, useRef, useEffect } from 'react';
import './VerticalPreviewImage.css';

const VerticalPreviewImage = ({ images }) => {
	const [selectedImage, setSelectedImage] = useState();
	const sliderRef = useRef(null);

	const handleThumbnailClick = (index) => {
		setSelectedImage(images[index]);
	};

	useEffect(() => {
		setSelectedImage(images?.[0]);
	}, [images]);

	return (
		<div className='vertical-slider-container'>
			<div className='slider' ref={sliderRef}>
				{images &&
					images.map((image, index) => (
						<img
							key={index}
							src={image}
							alt={`Thumbnail ${index + 1}`}
							className={
								selectedImage === image ? 'active slider-img rounded-10' : ' rounded-10'
							}
							onClick={() => handleThumbnailClick(index)}
						/>
					))}
			</div>
			<div className='image-box'>
				<img src={selectedImage} alt=''/>
			</div>
		</div>
	);
};

export default VerticalPreviewImage;
