import React from 'react';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

const InfoButton = ({ description }) => {
	const tooltip = (
		<Tooltip id='tooltip-info'>{description ?? 'Nothing to display'}</Tooltip>
	);

	return (
		<OverlayTrigger
			placement='top'
			overlay={tooltip}
			trigger={['hover', 'focus']}
		>
			<i className='selectContainer fa-solid fa-circle-info fa-lg'></i>
		</OverlayTrigger>
	);
};

export default InfoButton;
