import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AddWishlistShare from '../../CommonCardComponents/addWishlistShare';
import { Endpoints } from '../../../API/Endpoints';
import { Link, useNavigate } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import ToastMessage from '../../../Utils/ToastMessage';
import { FetchApi } from '../../../API/FetchApi';
import { paginationApiHelper, Pagination } from '../../CommonPagination';
import LoadingSpinner from '../../Loader';
import useSearchContext from '../../../context/searchContext';

function CommonTopBusinessRow({
	givenData,
	givenUrl,
	removeTitle,
	headTitle,
	viewAllBtn = true,
	viewAllLink,
	viewAllLinkState,
	paginationSize,
	params,
	activatePagination,
	categoryType,
	dataRetriveValue,
	setDataRetriveCount,
}) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [data, setData] = useState();
	const [paginationData, setPaginationData] = useState({
		activePage: 1,
		currentUrl: givenUrl,
		paginationCountSize: paginationSize,
	});
	const onClickNavigation = (e, item) => {
		navigate({
			pathname: '/business-profile-user-view',
			search: `?id=${item.id}`,
		});
		window.location.reload();
	};
	const handleViewAll = (e) => {
		e.preventDefault();
		navigate(
			{
				pathname: viewAllLink ? viewAllLink : '/category-listing-top-business',
			},
			{ state: viewAllLinkState }
		);
	};
	const addUserWishlist = async (id) => {
		try {
			let resp = await FetchApi(Endpoints.addUserWishlist + id);
			if (resp && !resp.status && resp.message) {
				ToastMessage.Error(resp.message);
			}
			if (resp && resp.message) {
				ToastMessage.Success(resp.message);
			}
		} catch (e) {
			if (e && e.response) {
				ToastMessage.Error(e.response.message);
			}
		}
	};
	useEffect(() => {
		if (!givenData && givenUrl) {
			// this is the API calling funtion
			paginationApiHelper(
				paginationData.currentUrl,
				true,
				paginationData,
				setPaginationData,
				setData,
				params,
				null,
				dataRetriveValue
			);
		} else if (givenData) {
			setData(givenData);
		}
	}, [givenData]);

	useEffect(() => {
		if (setDataRetriveCount) {
			setDataRetriveCount(data?.length);
		}
	}, [data]);
	return (
		<>
			{!data ? (
				<LoadingSpinner />
			) : (
				data?.length > 0 && (
					<div className='pb-4'>
						{!removeTitle && (
							<div className='d-flex align-items-center justify-content-between pb-md-3 pb-2'>
								{data?.length > 0 && (
									<>
										{!headTitle ? (
											<h2 className='fs-30 fs-sm-18'>
												{t('Top Store / Business Profile')}
											</h2>
										) : (
											<h1 className='fs-30 fs-sm-18 pb-md-3 pb-2'>{t(headTitle)}</h1>
										)}
									</>
								)}
								{data?.length >= 4 && viewAllBtn && (
									<Link
										onClick={handleViewAll}
										className='text-decoration-underline text-blue fs-sm-13'
									>
										{t('View All')}
									</Link>
								)}
							</div>
						)}
						<div className='row'>
							{data?.map((item, index) => {
								return (
									<div className='selectContainer  col-lg-3 col-md-6 col-6 mb-3'>
										<div className='ngo-column shadow border-0 position-relative rounded-20 overflow-hidden border'>
											<AddWishlistShare
												api={addUserWishlist}
												id={item?.id}
												added_to_wishlist={item?.added_to_wishlist}
												url={`/business-profile-user-view?id=${item.id}`}
											/>
											<div onClick={(e) => onClickNavigation(e, item)}>
												<img
													src={
														Endpoints.baseUrl + (item?.cover_pic || Endpoints.defaultCoverPic)
													}
													alt=''
													height='100'
													className='w-100 home-ngo-img object-cover'
												/>
												<div className='text-center px-2 pb-3'>
													<div className='home-ngo-logo bg-white rounded-circle'>
														<img
															src={
																Endpoints.baseUrl + (item?.image || Endpoints.defaultProfilePic)
															}
															width='75'
															height='75'
															className='rounded-circle'
															alt=''
														/>
													</div>
													{item?.is_hamza && (
														<span className='box-20 rounded-circle bg-white'>
															<img
																src='assets/img/hamsa-tik 1.svg'
																width='16'
																height='16'
																alt=''
															/>
														</span>
													)}
													<h4 className='fs-22 medium text-blue py-2 fs-sm-14'>
														{item?.name}
													</h4>

													<div className='d-flex align-items-center gap-2 justify-content-center'>
														<Rating
															className='d-flex'
															size={23}
															readonly={true}
															// initialValue={1.5}
															allowFraction={true}
															initialValue={item?.average_review}
														/>
														<p className='fs-14 text-turquois m-0 fs-sm-9'>
															{/* {item?.total_reviews? ("4.9" +" | "+ (item?.total_reviews) +" Reviews"):
                                                    (item?.average_review)} */}
															{item?.average_review?.toFixed(1) +
																' | ' +
																item?.total_reviews +
																' ' +
																t('Reviews')}
														</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
						{activatePagination && (
							<Pagination
								paginationData={paginationData}
								setPaginationData={setPaginationData}
								setData={setData}
							/>
						)}
					</div>
				)
			)}
		</>
	);
}

export default CommonTopBusinessRow;
