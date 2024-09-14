import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import DatePickerPopup from '../CommonUiComponents/DatePickerPopup';
import moment from 'moment';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import ToastMessage from '../../Utils/ToastMessage';
import { getLoggedInUser, getUserToken } from '../../helpers';
import LocationPaymentModal from '../modals/LocationPaymentModal';
import { Routes, Navigate, useNavigate, Route, Outlet } from 'react-router-dom';
import useModalContext from '../../context/modalContext';

function UserListingHeader({ listingType, setFilters, setpath, currency }) {
	const { setIsLoadingModalVisible } = useModalContext();
	const { t } = useTranslation();
	const user = getLoggedInUser();
	const token = getUserToken();
	const navigate = useNavigate();
	const [profileData, setProfileData] = useState({});
	const [unitCostData, setUnitCostData] = useState({});
	const [modalVisible, setModalVisible] = useState('');
	const [searchInput, setSearchInput] = useState('');
	const [searchParams] = useSearchParams();

	const [filtersData, setFiltersData] = useState({
		'my-deals': [
			{ title: 'Recent Listing', value: 'recent' },
			{ title: 'Old Listing', value: 'oldest' },
		],
		'recent jobs': [
			{ title: 'Recent Jobs', value: 'recent Jobs' },
			{ title: 'Past Jobs', value: 'past jobs' },
		],
		'my-classifieds': [
			{ title: 'Recent Listing', value: 'recent' },
			{ title: 'Old Listing', value: 'oldest' },
		],
		'my-weekly': [
			{ title: 'Recent Listing', value: 'recent' },
			{ title: 'Old Listing', value: 'oldest' },
		],
	});
	const [isSearchActive, setIsSearchActive] = useState(false);
	const [selectionRange, setSelectionRange] = useState({
		startDate: new Date(),
		endDate: null,
		key: 'selection',
	});
	// const [title, setTitle] = useState(
	// 	listingType === 'my-deals'
	// 		? 'Deals Listing'
	// 		: listingType === 'my-jobs'
	// 		? 'Recent Listing'
	// 		: listingType === 'my-classifieds'
	// 		? 'Classifieds Listing'
	// 		: listingType === 'my-locations'
	// 		? 'Other Business Locations'
	// 		: listingType === 'my-weekly'
	// 		? 'Weekly Listing'
	// 		: listingType === 'my-realestate'
	// 		? 'Property Listing'
	// 		: listingType === 'my-videos'
	// 		? 'Videos Listing'
	// 		: listingType === 'my-videos'
	// 		? 'Videos Listing'
	// 		: listingType === 'my-videos'
	// 		? 'Videos Listing'
	// 		: ''
	// );

	const getFiltersApi = async (event, data) => {
		try {
			let resp = await FetchApi(Endpoints.masterSearchParams, null, null, {
				param_type: 'name',
			});
			if (resp) {
				let sortData = resp.params?.filter((item) => item?.param_tag === 'sort');
				let filterData = resp.params?.filter(
					(item) => item?.param_tag === 'filter'
				);
				setFiltersData((values) => ({
					...values,
					sortingData: sortData,
					filteringData: filterData,
				}));
			}
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};
	const getUnitCost = async () => {
		try {
			let resp = await FetchApi(Endpoints.getUnitCost);
			if (resp && resp.status) {
				setUnitCostData(resp);
			}
		} catch (e) {}
	};
	const getProfileDetails = async () => {
		try {
			let resp = await FetchApi(Endpoints.getProfileDetails);
			if (resp && resp.status) {
				setProfileData(resp.data);
				sessionStorage.setItem('user', JSON.stringify(resp.data));
				// setCookie('user', resp.data);
			}
			if (resp && resp?.data?.user_type == 'Business') {
				getUnitCost();
			}
		} catch (e) {}
	};

	const handleChange = (event, data) => {
		setIsSearchActive(false);
		if (event.persist) event.persist();
		if (typeof data !== 'undefined') {
			if (event === 'search_key') {
				setSearchInput(data);
				if (data === '') {
					setFilters((values) => ({
						...values,
						search_key: '',
					}));
				}
			} else {
				setFilters((values) => ({
					...values,
					[event]: data,
				}));
			}
		} else {
			setFilters((values) => ({
				...values,
				[event?.target?.name]: event?.target?.value,
			}));
		}
	};

	const handleSubmit = (e) => {
		if (isSearchActive) {
			setSearchInput('');
			setFilters((values) => ({
				...values,
				search_key: '',
			}));
			setIsSearchActive(false);
		} else {
			setIsSearchActive(true);
			setFilters((values) => ({
				...values,
				search_key: searchInput,
			}));
		}
		e.preventDefault();
	};

	const generateCheckoutSessionId = async () => {
		console.log('clicked')
		try {
			setIsLoadingModalVisible(true);
			let resp = await FetchApi(
				Endpoints.createCheckOutSession,
				{},
				null,
				null,
				false,
				'GET'
			);
			if (resp && resp.status) {
				setIsLoadingModalVisible(false);
				console.log('jso', resp?.data?.url)
				window.location.href = resp?.data?.url
				// setCheckoutSessionId(resp?.data?.id);
			}
			setIsLoadingModalVisible(false);
		} catch (e) {
			setIsLoadingModalVisible(false);
			if (e && e.response) {
				ToastMessage.Error(e.response.message);
			}
		}
	};

	useEffect(() => {
		if (
			selectionRange?.startDate &&
			selectionRange?.endDate &&
			selectionRange?.startDate !== selectionRange?.endDate
		)
			setFilters((values) => ({
				...values,
				start_date: moment(selectionRange?.startDate).format('YYYY-MM-DD'),
				end_date: moment(selectionRange?.endDate).format('YYYY-MM-DD'),
			}));
	}, [selectionRange]);
	useEffect(() => {
		if (token) getProfileDetails();
	}, []);

	return (
		<div>
			<div className='d-lg-flex align-items-center justify-content-between pb-1'>
				<div
					className={
						listingType === 'my-locations'
							? 'col-lg-6 col-10 d-flex align-items-center gap-2 pb-lg-0 pb-2'
							: 'col-lg-5 col-10 d-flex align-items-center gap-2 pb-lg-0 pb-2'
					}
				>
					<h1 className='fs-30 regular fs-sm-18 pb-md-0'>
						{' '}
						{listingType === 'my-deals'
							? t('Deals Listing')
							: listingType === 'my-realestate'
							? t('Property Listing')
							: listingType === 'my-jobs'
							? t('Recent Listing')
							: listingType === 'my-classifieds'
							? t('Classifieds Listing')
							: listingType === 'my-locations'
							? t('Other Business Locations')
							: listingType === 'my-weekly'
							? t('Weekly Listing')
							: listingType === 'my-videos'
							? t('Videos Listing')
							: listingType === 'my-deals'
							? t('Deals Listing')
							: listingType === 'my-payment-history'
							? t('Payment History')
							: listingType === 'my-payment-options'
							? t('Payment Options')
							: listingType === 'my-payment-report'
							? t('Payment Report')
							: listingType === 'my-ngo-business-associated'
							? t('Business Associated')
							: listingType === 'my-ngo-member-associated'
							? t('Member Associated')
							: listingType === 'my-redeemed-deal-users'
							? t('Member who redeemed deals')
							: ''}
					</h1>
					{['my-deals', 'my-realestate', 'my-videos'].includes(listingType) ? (
						<Link
							to={
								user?.business_category_details?.name == 'Restaurant'
									? '/create-listing-restaurant'
									: user?.business_category_details?.name == 'Real Estate'
									? '/create-listing-realestate'
									: user?.business_category_details?.name == 'Product'
									? '/create-product-deal'
									: user?.business_category_details?.name == 'Travel'
									? '/create-travel-deal'
									// : user?.business_category_details?.name == 'Sports & Entertainment'
									: user?.business_category_details?.keyword === 'entertainment_sport'
									? '/create-sport-deal'
									: user?.business_category_details?.name == 'Service'
									? '/create-service-deal'
									: (listingType === 'my-videos' && user?.user_type == 'Non Profitable Organization')
									? '/add-video'
									: (listingType != 'my-videos' && user?.user_type == 'Non Profitable Organization')
									? '/create-ngo-deal'
									: null
							}
							className='button py-2'
						>
							<i className='fa-light fa-plus-circle me-2 fs-20 align-middle'></i>
							{listingType === 'my-videos'? t('Add Videos Link') 
							:
							 user?.user_type == 'NGO'? t('Add Listing') : t('Add Deals')}
						</Link>
					) : listingType === 'my-jobs' ? (
						<Link to={'/create-listing-jobs'} className='button py-2'>
							<i className='fa-light fa-plus-circle me-2 fs-20 align-middle'></i>
							{t('Add Jobs')}
						</Link>
					) : listingType === 'my-classifieds' ? (
						<Link to={'/create-classified'} className='button py-2'>
							<i className='fa-light fa-plus-circle me-2 fs-20 align-middle'></i>
							{t('Add Classified')}s
						</Link>
					) : listingType === 'my-locations' ? (
						<Link
							to={profileData?.extra_location != 0 ? '/add-locations' : ''}
							onClick={() => {
								if (profileData?.extra_location == 0) {
									setModalVisible('show');

									// $('#add').modal('show');
								}
							}}
							className='button py-2 px-3 text-nowrap'
						>
							<i className='fa-light fa-circle-plus pe-2'></i>
							{t('Add new Location')}
						</Link>
					) : listingType === 'my-weekly' ? (
						<Link to={'/create-weekly-deal'} className='button py-2 px-3'>
							<i className='fa-light fa-circle-plus pe-2'></i>
							{t('Add Weekly Deal')}
						</Link>
					) : listingType === 'my-payment-options' ? (
						<Link 
						// to={currency==4? '/create-payment-method' : ''} 
						onClick={(e)=>{
							// if(currency != 4){
								generateCheckoutSessionId();
								e.preventDefault()
							// }

						}}
						className='button py-2 px-3'>
							<i className='fa-light fa-circle-plus pe-2'></i>
							{t('Add Payment Option')}
						</Link>
					) :
					// listingType === 'my-payment-history' ? (
					// 	<Link to={'/payment-report'} className='button py-2 px-3'>
					// 		View Payment Report
					// 	</Link>
					// )

					null}
				</div>

				<div className='col-lg-7 d-md-flex align-items-center gap-2 justify-content-lg-end'>
					{[
						'my-deals',
						'recent jobs',
						'my-classifieds',
						'my-weekly',
						// 'my-payment-history',
					].includes(listingType) ? (
						<div className='border p-2 rounded-10 d-flex filter-design-1 mb-md-0 mb-2 align-items-center'>
							<h5 className='fs-16 filter-title fs-sm-14 mb-0 regular text-gray2 d-flex'>
								<img
									src='assets/img/icon/documentfilter.svg'
									className='me-2'
									alt='shukDeals'
								/>{' '}
								{t('Filter')}:
							</h5>
							<select
								onChange={(e) => handleChange('filter_by', e.target.value)}
								name='filters'
								className='border-0 text-gray1 medium fs-sm-14'
							>
								{filtersData[listingType]?.map((item) => (
									<option value={item?.value}>{t(item?.title)}</option>
								))}
							</select>
						</div>
					) : null}
					{
						<div className=' p-2 rounded-10 d-flex filter-design-1 mb-md-0 mb-2 align-items-center'>
							{['my-payment-report'].includes(listingType) ? (
								<DatePickerPopup
									selectionRange={selectionRange}
									setSelectionRange={setSelectionRange}
								/>
							) : null}
						</div>
					}
					{!['my-payment-history', 'my-payment-report'].includes(listingType) ? (
						<form
							onSubmit={handleSubmit}
							className='site-search border rounded-10 d-flex align-items-center'
						>
							<input
								type='text'
								value={searchInput}
								onChange={(e) => handleChange('search_key', e.target.value)}
								placeholder={
									listingType === 'my-locations'
										? t('Search Location ')
										: t('Search Your Listing')
								}
								className='border-0 px-3 '
							/>
							<button type='submit' className='button py-2 px-4'>
								{isSearchActive ? (
									<i class='fa fa-times' aria-hidden='true' />
								) : (
									<i className='fa-regular fa-magnifying-glass ' />
								)}
							</button>
						</form>
					) : null}
				</div>
			</div>
			{/* modal */}
			<LocationPaymentModal
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
				unitCostData={unitCostData}
			/>
		</div>
	);
}

export default UserListingHeader;
