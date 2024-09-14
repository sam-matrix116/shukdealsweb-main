import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';

function ResendTimer({ timerDuration, callingApi }) {
    const { t } = useTranslation();
	const [timeLeft, setTimeLeft] = useState(timerDuration);
	const [isDisabled, setIsDisabled] = useState(false);

	const startTimer = () => {
		if (isDisabled) {
			return;
		}
		callingApi();
		setIsDisabled(true);
		setTimeLeft(timerDuration);

		const interval = setInterval(() => {
			setTimeLeft((prevTime) => prevTime - 1);
		}, 1000);

		setTimeout(() => {
			clearInterval(interval);
			setIsDisabled(false);
		}, timerDuration * 1000);
	};

	return (
		<div className=' d-flex gap-1 justify-content-end my-3'>
			<Link
				className='resendButton'
				onClick={startTimer}
				aria-disabled={isDisabled}
				style={{
					fontSize: '16px',
					pointerEvents: isDisabled ? 'none' : 'auto',
					fontWeight: isDisabled ? 'normal' : 'bold',
				}}
			>
				{t("Resend OTP")}
			</Link>
			{isDisabled && <div style={{ fontSize: '18px' }}>: {timeLeft}s</div>}
		</div>
	);
}

export default ResendTimer;
