import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import AddWishlistShare from '../../CommonCardComponents/addWishlistShare';
import { Endpoints } from '../../../API/Endpoints';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { FetchApi } from '../../../API/FetchApi';
import ToastMessage from '../../../Utils/ToastMessage';
import { useEffect } from 'react';
import { Pagination, paginationApiHelper } from '../../CommonPagination';
import getSymbolFromCurrency from 'currency-symbol-map';

function CommonJobsRow({
	userId,
	dataValue,
	headTitle,
	viewAllLink,
	detailViewLink,
	removeTitle,
	paginationSize,
	activatePagination,
	params,
}) {
    const { t } = useTranslation();

	const [data, setData] = useState();
	const navigate = useNavigate();
	const [paginationData, setPaginationData] = useState({
		activePage: 1,
		currentUrl: dataValue === 'jobs' && Endpoints.getOthersJob,
		paginationCountSize: paginationSize,
		extraParams: params,
	});

	const onClickNavigation = (item) => {
		navigate({
			pathname: detailViewLink,
			search: `?id=${item.id}`,
		});
	};

	const addJobsWishlist = async (id) => {
		try {
			let resp = await FetchApi(Endpoints.addJobWislist + id);
			if (resp && resp.message) {
				ToastMessage.Success(resp.message);
			}
		} catch (e) {}
	};

	useEffect(() => {
		paginationApiHelper(
			paginationData.currentUrl,
			true,
			paginationData,
			setPaginationData,
			setData
		);
	}, [params]);

	return (
		<div className='pb-3'>
			{/* search functionality on jobs */}
			{!removeTitle && (
				<div className='find-job py-3'>
					<div className='container'>
						<div className='row justify-content-center text-white'>
							<div className='col-lg-9 col-md-12 d-flex'>
								<div className='w-100'>
									<form action='' className='site-form d-md-flex align-items-center'>
										<h3 className='regular pe-md-4 pb-md-0 pb-2 text-md-start text-center text-nowrap'>
											{t("Find Jobs")}
										</h3>
										<div className='d-md-flex w-100 bg-white rounded-10 overflow-hidden'>
											<input
												type='text'
												className='border-0 job-search mb-md-0 mb-2'
												placeholder='Job title, keywords, company and business'
											/>
											<div className='d-flex  bg-white rounded-10 position-relative job-location justify-content-between'>
												<div className='d-flex align-items-center px-3'>
													<img src='assets/img/icon/location.svg' alt='shukDeals' />
													<input
														type='text'
														className='border-0 px-2 '
														placeholder={t('Location')}
													/>
												</div>
												<button className='button rounded-10 px-4 m-1 py-1'>
													<i className='fa-regular fa-magnifying-glass'></i>
												</button>
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* cards */}
			<div className='container'>
				<div className='row job-listing pt-4'>
					{data?.map((item, index) => {
						return (
							<div className='col-lg-3 col-md-4 col-6 pb-4'>
								<div className='job-column p-2 rounded-10 position-relative'>
									<AddWishlistShare
										categoryType={'jobs'}
										api={addJobsWishlist}
										id={item?.id}
										added_to_wishlist={item?.added_to_wishlist}
										url={`${detailViewLink}?id=${item.id}`}
									/>
									<div className='d-flex align-items-center border-bottom pb-1 gap-2'>
										<div>
											<div className='bg-white rounded-circle'>
												<img
													src='assets/img/icon/pizza-hut.svg'
													width='60'
													height='65'
													className='rounded-circle'
													alt=''
												/>
											</div>
											<span className='box-20 rounded-circle bg-white'>
												<img
													src='assets/img/icon/hamsa-tik 1.svg'
													width='20'
													height='20'
													className='rounded-circle bg-white'
													alt=''
												/>
											</span>
										</div>
										<h3 className='fs-18 medium text-blue'>{t("Pizza Hut")}</h3>
									</div>
									<div className='pt-2'>
										<h5 className='fs-16 fs-sm-13 medium pb-2 pb-md-3'>{item?.title}</h5>
										<h4 className='fs-16 text-blue pb-2 pb-md-3 medium'>
											{getSymbolFromCurrency(item?.salary_currency)}
											{item?.salary}{' '}
											<span className='fs-14 text-gray2 regular'>{item?.salary_type}</span>
										</h4>
										<h6 className='regular pb-2 pb-md-3 fs-13'>
											{t("Job type")}: <span className='medium'>{item?.job_type}</span>
										</h6>
										<p className='fs-13 mb-md-4 mb-3'>Posted 4 days ago</p>
										<button className='button w-100 fs-16 rounded-10 py-2'>{t("Apply Now")}
										</button>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
			{activatePagination && (
				<Pagination
					paginationData={paginationData}
					setPaginationData={setPaginationData}
					setData={setData}
				/>
			)}
		</div>
	);
}

export default CommonJobsRow;
