import React from 'react';
import { useTranslation } from "react-i18next";
// import "./spinner.css";

export default function LoadingSpinner() {
    const { t } = useTranslation();
	return (
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
	);
}
