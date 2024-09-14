import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const CountDownRedirect = ({ timeInSeconds, redirectUrl }) => {
	const {t} = useTranslation();
	const [countdown, setCountdown] = useState(timeInSeconds);
	const navigate = useNavigate();
	useEffect(() => {
		if (countdown > 0) {
			const interval = setInterval(() => {
				setCountdown((prevCountdown) => prevCountdown - 1);
			}, 1000);

			return () => {
				clearInterval(interval);
			};
		}
		redirectToUrl();
	}, [countdown]);

	const redirectToUrl = () => {
		navigate(redirectUrl);
	};
	return (
		<div>
			{countdown > 0 ? (
				<div>
					<p>{t("Redirecting in")} {countdown} {t("seconds...")}</p>
					<div className=' d-flex justify-content-center'>
						<button
							onClick={redirectToUrl}
							disabled={!redirectUrl}
							className='button p-2'
						>
							{t("Redirect now")}
						</button>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default CountDownRedirect;
