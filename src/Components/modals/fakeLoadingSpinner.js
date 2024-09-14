import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function FakeLoadingSpinner() {
	const [loading, setLoading] = useState();
    const location = useLocation()
	useEffect(() => {
		setLoading(true);
		document.body.style.overflow = 'hidden';
		setTimeout(() => {
			setLoading(false);
			document.body.style.overflow = 'auto';
		}, 1500);
	}, [location.pathname]);

	return (
		<>
			{loading && (
				<div
					style={
						{
							// flex: 1,
							// height: 500,
							// width: 500,
							// backgroundColor : 'red',
							// position: 'absolute'
						}
					}
					className='spinner-container'
				>
					<div className='loading-spinner'></div>
				</div>
			)}
		</>
	);
}

export default FakeLoadingSpinner;
