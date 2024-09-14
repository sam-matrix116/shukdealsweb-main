import React from 'react';
import { useTranslation } from "react-i18next";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
function CommonImageView({ uri, classname }) {
    const { t } = useTranslation();
	return (
		<Zoom>
			<img style={{
				// height: '100%'
				objectFit: 'cover'
			}} src={uri} className={classname} alt='' />
		</Zoom>
	);
}

export default CommonImageView;
