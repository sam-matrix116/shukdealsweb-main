import React, { useState, useEffect } from 'react';

import CustomHeader from '../CustomHeader';
import CustomFooter from '../CustomFooter';
import { getLoggedInUser } from '../../helpers';
import { Endpoints } from '../../API/Endpoints';
import ToastMessage from '../../Utils/ToastMessage';
import LoadingSpinner from '../Loader';
import { FetchApi } from '../../API/FetchApi';
import { Link } from 'react-router-dom';

const CommonHelpCenter = () => {
	const user = getLoggedInUser();
	const [data, setData] = useState();
	const [isLoading, setIsLoading] = useState();

	const getFaqs = async () => {
		try {
			setIsLoading(true);
			let resp = await FetchApi(Endpoints.getFaqs);
			if (resp && resp.status) {
				setData(resp.data);
				setIsLoading(false);
			}
		} catch (e) {
			setIsLoading(false);
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};
	useEffect(() => {
		getFaqs();
	}, []);

	return (
		<>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<div>
					<CustomHeader />
					<div className='main'>
						<div className='container py-5'>
							<h1 className='text-gray1 text-center fs-30 medium pb-3 fs-30'>
								Frequently Asked Questions
							</h1>
							<div className='faq pt-3'>
								<div className='container'>
									<div className='accordion' id='accordionExample'>
										{data?.map((item, index) => (
											<div key={index} className='accordion-item border-0 border-bottom'>
												<h2 className='accordion-header' id={`heading-${index}`}>
													<button
														className='accordion-button fs-22 regular text-gray1 border-0 shadow-none bg-white py-md-4'
														type='button'
														data-bs-toggle='collapse'
														data-bs-target={`#collapse-${index}`}
														aria-expanded='false'
														aria-controls={`collapse-${index}`}
													>
														{item?.question}
													</button>
												</h2>
												<div
													id={`collapse-${index}`}
													className='accordion-collapse collapse'
													aria-labelledby={`heading-${index}`}
													data-bs-parent='#accordionExample'
													data-bs-collapsed='true' // Set this attribute to 'true'
												>
													<div className='accordion-body pt-0'>
														<p className='text-gray2 fs-16 mb-0 light'>{item?.answer}</p>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
						<div className='container py-5'>
							<h1 className='text-gray1 text-center fs-30 medium pb-3 fs-30'>
								Still Need Help?
							</h1>
							<div className='faq pt-3'>
								<div className='d-flex justify-content-center'>
									<Link to={'/contact-us'} className='button py-2'>Message Us</Link>
								</div>
							</div>
						</div>
					</div>
					<CustomFooter />
				</div>
			)}
		</>
	);
};

export default CommonHelpCenter;
