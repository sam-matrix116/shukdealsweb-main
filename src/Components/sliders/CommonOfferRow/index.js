import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Endpoints } from '../../../API/Endpoints';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import AddWishlistShare from '../../CommonCardComponents/addWishlistShare';
import { FetchApi } from '../../../API/FetchApi';
import ToastMessage from '../../../Utils/ToastMessage';
import { paginationApiHelper, Pagination } from '../../CommonPagination';
import { HorizontalCrousel } from '../../CommonCrousel';
import {
	getChoosenCurrency,
	getLoggedInUser,
	getUserToken,
} from '../../../helpers';
import LoadingSpinner from '../../Loader';
import useSearchContext from '../../../context/searchContext';
import CommonAddBtn from '../../CommonAddBtn';

function CommonOfferRow({
	givenData,
	paginationSize,
	removeTitle,
	viewAllBtn,
	viewAllLink,
	viewAllLinkState,
	isSlider,
	activatePagination,
	params,
	headTitle,
	givenUrl,
	dataRetriveValue,
	setDataRetriveCount,
	addDealBtn,
	profileData
}) {
	const { t } = useTranslation();
	const token = getUserToken();
	const user_currency = getChoosenCurrency();
	const navigate = useNavigate();
	const [data, setData] = useState();
	const [paginationData, setPaginationData] = useState({
		activePage: 1,
		currentUrl: givenUrl
			? givenUrl
			: params
			? Endpoints.othersWeeklyDeals + params
			: Endpoints.othersWeeklyDeals,
		paginationCountSize: paginationSize,
	});

	const onClickNavigation = (item) => {
		navigate({
			pathname: '/deal-details',
			search: `?id=${item.id}`,
		});
	};
	const handleViewAll = (e) => {
		e.preventDefault();
		navigate(
			{
				pathname: viewAllLink,
			},
			{ state: viewAllLinkState }
		);
	};

	const addDealsWishlist = async (id, type) => {
		try {
			let resp = await FetchApi(Endpoints.addDealWishlist + id);
			if (resp && resp.message) {
				ToastMessage.Success(resp.message);
			}
		} catch (e) {}
	};
	// console.log({ data });

	// this iterates over data and return cards
	const Cards = () => {
		return (
			<>
				{data?.length &&
					data?.map((item, index) => {
						return (
							<div className=' col-lg-3 col-6   pb-3' style={{ maxWidth: '221.8px' }}>
								<div
									key={index}
									className={
										'offer-column  border deals-column shadow w-100 position-relative rounded-20 overflow-hidden'
									}
								>
									<AddWishlistShare
										api={addDealsWishlist}
										id={item?.id}
										added_to_wishlist={item?.added_to_wishlist}
										url={`/deal-details?id=${item.id}`}
									/>
									<div onClick={() => onClickNavigation(item)}>
										<img
											src={Endpoints.baseUrl + item?.images?.[0]?.image}
											alt=''
											className='w-100 home-offer-img'
										/>
										<div className='offer-content position-absolute start-0 top-0 h-100 d-flex flex-column align-items-center justify-content-center text-center py-3 px-2'>
											<h4 className='bold text-white fs-sm-24'>
												{item?.free_member_discount_type == 'percentage'
													? item?.free_member_discount_value + '%'
													: user_currency?.sign + item?.free_member_discount_value}{' '}
												OFF
											</h4>
											<p className='m-0 text-white fs-18 light py-2 fs-sm-14'>
												In {item?.business_category} Deals
											</p>
											<p className='m-0 text-green2 fs-12 d-flex align-items-center gap-1 fs-sm-9'>
												<img src='assets/img/icon/timer1.svg' width='14' />{' '}
												{moment(item.expiry_date).isBefore(new Date())
													? t('Expired')
													: moment(item.expiry_date).diff(new Date(), 'days') === 0
													? t('Last Day')
													: moment(item.expiry_date).diff(new Date(), 'days') + " " + t('Days Left')}
											</p>
										</div>
									</div>
								</div>
							</div>
						);
					})}
			</>
		);
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
				null,
				null,
				dataRetriveValue
			);
		} else if (givenData) {
			setData(givenData);
		}
	}, [params, givenData]);

	useEffect(() => {
		if (setDataRetriveCount) {
			setDataRetriveCount(data?.length);
		}
	}, [data]);

	// console.log('addd__', addDealBtn)
	return (
		<>
			{data?.length > 0 && (
				<div className='pb-4'>
					<div className='d-flex align-items-center justify-content-between '>
						{data?.length > 0 && !removeTitle && (
							<>
								{!headTitle ? (
									<h1 className='fs-30 fs-sm-18 pb-md-3 pb-2'>
										{params ? t('NGO’s Business Weekly Offers') : t('Weekly Offers')}
									</h1>
								) : (
									<h1 className='fs-30 fs-sm-18 pb-md-3 pb-2'>{t(headTitle)}</h1>
								)}
							</>
						)}
						<div className='d-flex align-items-center'>
						{addDealBtn && token ? (
						<CommonAddBtn removeTitle={true} profileData={profileData} categoryType={'weekly_deal'} />
						) : null}
						{data?.length <= 4 && viewAllBtn && (
							<Link
								onClick={handleViewAll}
								className='text-decoration-underline text-blue fs-sm-13'
							>
								{t('View All')}
							</Link>
						)}
						</div>
					</div>

					{/* cards with or without crousel*/}
					{isSlider ? (
						<HorizontalCrousel cardsLength={data?.length}>
							<Cards />
						</HorizontalCrousel>
					) : (
						<div className={'row'}>
							<Cards />
						</div>
					)}

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

export default CommonOfferRow;
