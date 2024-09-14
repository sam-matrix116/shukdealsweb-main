import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddWishlistShare from '../../CommonCardComponents/addWishlistShare';
import { Endpoints } from '../../../API/Endpoints';
import { Link, useNavigate } from 'react-router-dom';
import { FetchApi } from '../../../API/FetchApi';
import ToastMessage from '../../../Utils/ToastMessage';
import { useEffect } from 'react';
import { paginationApiHelper, Pagination } from '../../CommonPagination';
import { getChoosenCurrency, getUserToken } from '../../../helpers';
import useSearchContext from '../../../context/searchContext';

function CommonRealEstateRow({
	givenData,
	dataValue,
	headTitle,
	viewAllLink,
	detailViewLink,
	removeTitle,
	paginationSize,
	activatePagination,
	params,
	searchCategoryData,
	givenUrl,
	dataRetriveValue,
	setDataRetriveCount,
}) {
	const { t } = useTranslation();

	const user_currency = getChoosenCurrency();
	const { setSearchFilters } = useSearchContext();
	const [data, setData] = useState();
	const navigate = useNavigate();
	const [paginationData, setPaginationData] = useState({
		activePage: 1,
		currentUrl: givenUrl,
		paginationCountSize: paginationSize,
	});

	const onClickNavigation = (item) => {
		navigate({
			pathname: detailViewLink,
			search: `?id=${item.id}`,
		});
	};

	const addDealsWishlist = async (id, type) => {
		try {
			let resp = await FetchApi(Endpoints.addDealWishlist + id);
			if (resp && resp.message) {
				ToastMessage.Success(resp.message);
			}
		} catch (e) {}
	};

	const handleViewAll = (e) => {
		if (!searchCategoryData) {
			navigate(viewAllLink);
		} else {
			setSearchFilters((values) => ({
				...values,
				module_type: searchCategoryData,
			}));
		}
		e.preventDefault();
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
	}, [givenData, params]);

	useEffect(() => {
		if (setDataRetriveCount) {
			setDataRetriveCount(data?.length);
		}
	}, [data]);

	return (
		<>
			{data?.length > 0 && (
				<div className='pb-4'>
					{data?.length > 0 && !removeTitle && (
						<div className='d-flex align-items-center justify-content-between pb-md-4 pb-2'>
							<h2 className='fs-30 fs-sm-18'>{headTitle}</h2>
							<div>
								{data.length >= 4 && (
									<Link
										onClick={handleViewAll}
										className='text-decoration-underline text-blue fs-sm-13'
									>
										{t('View All')}
									</Link>
								)}
							</div>
						</div>
					)}
					<div className='row'>
						{data?.map((item, index) => {
							return (
								<div className='selectContainer col-lg-3 col-6 d-flex  pb-3'>
									<div className='deals-column shadow shadow position-relative rounded-20 overflow-hidden w-100'>
										<AddWishlistShare
											api={addDealsWishlist}
											id={item?.id}
											added_to_wishlist={item?.added_to_wishlist}
											url={`${detailViewLink}?id=${item.id}`}
										/>
										<div onClick={() => onClickNavigation(item)}>
											<img
												src={Endpoints.baseUrl + item?.images?.[0].image}
												alt=''
												height='140'
												adow
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
													{item?.location?.city +
														', ' +
														item?.location.state +
														', ' +
														item?.location?.country}
												</h4>
												<h3 className='fs-18 fs-sm-14 text-gray1 medium pb-md-3 pb-2'>
													{item?.title}
												</h3>

												<div className='d-lg-flex justify-content-between align-items-center'>
													<h4 className='fs-20 text-blue medium'>
														{item?.business_sub_category == 12
															? user_currency?.sign +
															  ' ' +
															  item?.property_details?.price.toFixed(2)
															: item?.business_sub_category == 10
															? item?.property_details?.offer_text
															: null}
														<span className='fs-14 text-gray2 light d-block'>
															{item?.property_details?.property_type}
														</span>
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
			)}
		</>
	);
}

export default CommonRealEstateRow;
