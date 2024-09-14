import React, { useState, useEffect } from 'react';
import AddWishlistShare from '../../CommonCardComponents/addWishlistShare';
import { Endpoints } from '../../../API/Endpoints';
import { Link, useNavigate } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import { FetchApi } from '../../../API/FetchApi';
import ToastMessage from '../../../Utils/ToastMessage';
import { paginationApiHelper, Pagination } from '../../CommonPagination';
import { HorizontalCrousel } from '../../CommonCrousel';
import useSearchContext from '../../../context/searchContext';
import { useTranslation } from 'react-i18next';

function CommonNgoPartnersRow({
	givenData,
	paginationSize,
	removeTitle,
	headTitle,
	isSlider,
	activatePagination,
	params,
	givenUrl,
	redirectUrl,
	dataRetriveValue,
	setDataRetriveCount,
}) {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [data, setData] = useState();
	const [paginationData, setPaginationData] = useState({
		activePage: 1,
		currentUrl: givenUrl,
		paginationCountSize: paginationSize,
	});

	const onClickNavigation = (item) => {
		navigate({
			pathname: redirectUrl ? redirectUrl : '/ngo-profile-other-view',
			search: `?id=${item.id}`,
		});
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
		} catch (e) {}
	};

	// this iterates over data and return cards
	const Cards = () => {
		return (
			<>
				{data?.map((item, index) => {
					return (
						<div className=' col-lg-3 col-6 pb-3' style={{ maxWidth: '300.25px' }}>
							<div
								className={` ngo-column shadow position-relative rounded-20 overflow-hidden `}
							>
								<AddWishlistShare
									api={addUserWishlist}
									id={item?.id}
									added_to_wishlist={item?.added_to_wishlist}
									url={`/ngo-profile-other-view?id=${item.id}`}
								/>

								<div
									onClick={() => onClickNavigation(item)}
									className='selectContainer'
								>
									<img
										src={
											Endpoints.baseUrl + (item?.cover_pic || Endpoints.defaultCoverPic)
										}
										alt=''
										height='120'
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

										{item?.user_type === 'ngo' ? (
											<span className='box-20 rounded-circle bg-white'>
												<img
													src='assets/img/hamsa-tik 1.svg'
													width='16'
													height='16'
													alt=''
												/>
											</span>
										) : item?.user_type === 'member' && item?.is_hamza ? (
											<span className='box-20 rounded-circle bg-white'>
												<img
													src='assets/img/hamsa-tik 1.svg'
													width='16'
													height='16'
													alt=''
												/>
											</span>
										) : null}
										<h4 className='fs-22 medium text-blue py-2 fs-sm-14'>
											{item?.name || item?.firstname + ' ' + item?.lastname}
										</h4>
										{/* {(item?.total_reviews || item?.average_reviews) &&  */}
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
												{item?.average_review.toFixed(1) +
													' | ' +
													item?.total_reviews +
													' ' +
													t('Reviews')}
											</p>
										</div>
										{/* } */}
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</>
		);
	};

	// const givenDataKeys = Object.keys(givenData ?? {})
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
		if (!givenData && setDataRetriveCount) {
			setDataRetriveCount(data?.length);
		}
	}, [data]);

	return (
		<>
			{data?.length > 0 && (
				<div className='pb-4'>
					{!removeTitle && (
						<div className='d-flex align-items-center justify-content-between pb-md-3 pb-2'>
							{data?.length > 0 && (
								<>
									{!headTitle ? (
										<h1 className='fs-30 fs-sm-18'>{t('Our NGO Partners')}</h1>
									) : (
										<h1 className='fs-30 fs-sm-18 '>{headTitle}</h1>
									)}
								</>
							)}
							{data?.length >= 4 && (
								<Link
									to={'/category-listing-ngo'}
									className='text-decoration-underline text-blue fs-sm-13'
								>
									{t('View All')}
								</Link>
							)}
						</div>
					)}

					{/* cards with or without crousel*/}
					{isSlider && !givenData ? (
						<HorizontalCrousel cardsLength={data?.length}>
							<Cards />
						</HorizontalCrousel>
					) : (
						<div className='row'>
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

export default CommonNgoPartnersRow;
