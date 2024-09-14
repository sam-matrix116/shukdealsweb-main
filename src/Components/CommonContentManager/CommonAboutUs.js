import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { getLoggedInUser } from '../../helpers';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import ToastMessage from '../../Utils/ToastMessage';
import CustomHeader from '../CustomHeader';
import LoadingSpinner from '../Loader';
import { RenderHTMLstring } from '../../helpers/htmlHelper';
import CustomFooter from '../CustomFooter';

const CommonAboutUs = () => {
	const [data, setData] = useState();
	const [isLoading, setIsLoading] = useState();

	const getAboutUsDetails = async () => {
		try {
			setIsLoading(true);
			let resp = await FetchApi(Endpoints.getAboutUs);
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
		getAboutUsDetails();
	}, []);
	// console.log({ data });
	return (
		<div className='referral-box'>
			<CustomHeader />
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<div className='main py-5'>
					<div className='container'>
						<div className='about-section'>
							<h1 className='text-gray1 fs-30 medium pb-3 fs-30'>{data?.heading}</h1>
							<span className='text-gray2 light text-justify'>
								<RenderHTMLstring htmlString={data?.description} />
							</span>
						</div>
						<div className='px-lg-5 mx-lg-4'>
							<h3 className='fs-30 pb-2 pt-3 text-gray1 medium text-center'>
								{data?.sub_heading}
							</h3>
							<p className='text-gray2 light text-center'>{data?.sub_description}</p>
							<div className='row py-3'>
								{data?.journeys?.map((item) => (
									<div className='col-md-4 text-center mb-md-0 mb-3 d-flex'>
										<div className='about-box rounded-10'>
											<h3 className='fs-30 medium pb-3 d-flex align-items-center justify-content-center '>
												<img
													src={Endpoints.baseUrl + item?.icon}
													style={{ height: '50px', width: '50px' }}
													className='me-2  '
													alt='shukDeals'
												/>{' '}
												{item?.counter}
											</h3>
											<h5 className='regular text-white pb-3'>{item?.title}</h5>
											<p className='text-white mb-0 light'>{item?.description}</p>
										</div>
									</div>
								))}
							</div>
							<h3 className='fs-30 pb-2 pt-3 text-gray1 medium text-center'>
								{data?.team_heading}
							</h3>
							<p className='text-gray2 light text-center'>{data?.team_description}</p>
							<div className='row justify-content-center justify-content-lg-start py-3'>
								{data?.teams?.map((item) => (
									<div className='col-lg-4 col-sm-5 mb-4 px-3'>
										<div
											className='team position-relative '
											style={{ height: '347px', width: '306px ' }}
										>
											<img
												src={Endpoints.baseUrl + item?.image}
												className='w-100 h-100 rounded-10 object-cover'
												alt='shukDeals'
											/>
											<div className='team-inner position-absolute p-3 text-white text-center bottom-0 end-0 mb-4 start-0 mx-auto'>
												<h6 className='medium pb-1'>{item?.name}</h6>
												<p className='mb-0 fs-14 light pb-3'>{item?.designation}</p>
												<div className='d-flex gap-3 text-center justify-content-center'>
													<Link to={item?.facebook_link} className='text-white'>
														<i className='fa-brands fa-facebook'></i>
													</Link>
													<Link to={item?.twitter_link} className='text-white'>
														<i className='fa-brands fa-twitter fs-18'></i>
													</Link>
													<Link to={item?.instagram_link} className='text-white'>
														<i className='fa-brands fa-instagram fs-18'></i>
													</Link>
													<Link to={item?.linkedin_link} className='text-white'>
														<i className='fa-brands fa-linkedin fs-18'></i>
													</Link>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
			<CustomFooter />
		</div>
	);
};

export default CommonAboutUs;
