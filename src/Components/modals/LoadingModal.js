import React, { useState } from 'react';
import { useTranslation } from "react-i18next";

function LoadingModal({ setIsmodalVisible, isModalVisible, data }) {
    const { t } = useTranslation();
	return (
		<>
			{isModalVisible && (
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

export default LoadingModal;
