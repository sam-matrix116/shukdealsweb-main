import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Endpoints } from '../../../API/Endpoints';
import { FetchApi } from '../../../API/FetchApi';
import { useEffect } from 'react';
import ToastMessage from '../../../Utils/ToastMessage';
import AddWishlistShare from '../../CommonCardComponents/addWishlistShare';
import { paginationApiHelper, Pagination } from '../../CommonPagination';
import { getChoosenCurrency, getUserToken } from '../../../helpers';
import useSearchContext from '../../../context/searchContext';

function CommonClassifiedRow({
	givenData,
	id,
	classifiedId,
	headTitle,
	headSize,
	paginationSize,
	classifiedType,
	viewAllBtn,
	viewAllLink,
	viewAllLinkState,
	removeTitle,
	addBtn,
	activatePagination,
	params,
	givenUrl,
	dataRetriveValue,
	setDataRetriveCount,
	createClassified,
}) {
	const { t } = useTranslation();

	const navigate = useNavigate();
	const user_currency = getChoosenCurrency();
	const [data, setData] = useState([]);
	const [paginationData, setPaginationData] = useState({
		activePage: 1,
		currentUrl: givenUrl
			? givenUrl
			: classifiedType === 'users'
			? Endpoints.getUserClassified + id
			: classifiedType === 'others' && Endpoints.getOthersClassified,
		paginationCountSize: paginationSize,
	});

	const onClickNavigation = (item) => {
		navigate({
			pathname: '/classified-details',
			search: `?id=${item.id}`,
		});
	};
	const handleViewAll = (e) => {
		e.preventDefault();
		navigate(
			{
				pathname: viewAllLink ? viewAllLink : '/category-listing-classifieds',
			},
			{ state: viewAllLinkState }
		);
	};
	const addClassifiedWishlist = async (id) => {
		try {
			let resp = await FetchApi(Endpoints.addClassifiedWishlist + id);
			if (resp && resp.message) {
				ToastMessage.Success(resp.message);
				// toast.success("done")
			}
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	useEffect(() => {
		if (!givenData) {
			// this is the API calling funtion
			paginationApiHelper(
				paginationData.currentUrl,
				true,
				paginationData,
				setPaginationData,
				setData,
				params,
				null,
				dataRetriveValue,
				classifiedId
			);
		} else if (givenData) {
			setData(givenData);
		}
	}, [givenData, params]);

	useEffect(() => {
		if (setDataRetriveCount) {
			setDataRetriveCount(data?.length);
		}
	}, [data]);

	return (
		<>
			{
				<div className='pb-4'>
					{!removeTitle && (
						<div className='d-flex align-items-center justify-content-between pb-md-4 pb-2'>
							<div className='col-lg-5 d-flex align-items-center gap-2 h-50 pb-lg-0 pb-2'>
								{data?.length ? (
									<>
										{headSize ? (
											<h3 className='fs-30 fs-sm-24 text-gray1 '>{t(headTitle)}</h3>
										) : (
											<h2 className='fs-30 fs-sm-18'>{t(headTitle)}</h2>
										)}
									</>
								) : null}
								{addBtn ? (
									<Link to={'/create-classified'} className='button p-2 '>
										<i className='fa-light fa-plus-circle me-2 fs-20 align-middle'></i>
										{t('Add Classified')}s
									</Link>
								) : null}
							</div>

							{data?.length >= 1 && viewAllBtn && (
								<div className=' d-flex align-items-center gap-3'>
									{createClassified ? (
										<Link to={'/create-classified'} className='button p-2 '>
											{t('Create Classified')}
										</Link>
									) : null}
									<Link
										onClick={handleViewAll}
										className='text-decoration-underline text-blue fs-sm-13'
									>
										{t('View All')}
									</Link>
								</div>
							)}
						</div>
					)}
					{data?.length ? (
						<div className='row'>
							{data?.map((item, index) => (
								<div className=' col-lg-3 col-6 d-flex  pb-3'>
									<div className='deals-column shadow position-relative rounded-20 overflow-hidden w-100'>
										<AddWishlistShare
											api={addClassifiedWishlist}
											id={item?.id}
											added_to_wishlist={item?.added_to_wishlist}
											url={`/classified-details?id=${item.id}`}
										/>
										<div
											onClick={() => onClickNavigation(item)}
											className='selectContainer'
										>
											<img
												src={Endpoints.baseUrl + item?.images[0]?.image}
												alt=''
												height='140'
												className='w-100 object-cover'
											/>
											<div className='px-2 py-3'>
												<h4 className='fs-14 text-gray2 pb-2 d-flex'>
													<img
														src='assets/img/icon/o-location.svg'
														width='15'
														className='me-2'
														alt='shukDeals'
													/>
													{item?.location_details?.city +
														' ' +
														item?.location_details?.country +
														' ' +
														item?.location_details?.country}
												</h4>
												<h3 className='fs-18 fs-sm-14 text-gray1 medium pb-md-3 pb-2'>
													{item?.title}
												</h3>

												<div className='d-lg-flex justify-content-between align-items-center'>
													<h4 className='fs-20 text-blue medium'>
														{user_currency?.sign + item?.price?.toFixed(2)}{' '}
														{/* <span className='fs-14 text-gray2 light d-block'>
														{item?.price_type ? item?.price_type : '--'}
													</span> */}
													</h4>
													<h5 className='fs-14 medium text-blue'>
														<img src='assets/img/icon/phone.svg' width='15' alt='shukDeals' />{' '}
														{t('Contact Now')}
													</h5>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					) : null}
					{activatePagination && (
						<Pagination
							paginationData={paginationData}
							setPaginationData={setPaginationData}
							setData={setData}
						/>
					)}
				</div>
			}
		</>
	);
}

export default CommonClassifiedRow;
