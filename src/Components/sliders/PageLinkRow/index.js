import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useSearchContext from '../../../context/searchContext';
import { useTranslation } from 'react-i18next';
import HorizontalCarousel from '../../CommonCrousel/HorizontalCrousel';

function PageLinkRow({ sendLocationState }) {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const {
		searchFilters,
		setSearchFilters,
		setSearchSelectedTab,
		searchSelectedTab,
	} = useSearchContext();

	const normalData = [
		{
			changeData: { name: 'ngo' },
			redirectUrl: '/category-listing-ngo',
			name: 'ngo',
			title: t(`NGO's`),
			image: 'assets/img/icon/hamzaIcon.svg',
		},
		{
			changeData: { name: 'classified' },
			redirectUrl: '/category-listing-classifieds',
			name: 'classified',
			title: t('Classifieds'),
			image: 'assets/img/icon/luggage-1.svg',
		},
		{
			changeData: { name: 'product', id: '1' },
			redirectUrl: '/category-listing-products',
			name: 'product',
			title: t('Products'),
			image: 'assets/img/icon/products.svg',
		},
		{
			changeData: { name: 'service', id: '2' },
			redirectUrl: '/category-listing-services',
			name: 'service',
			title: t('Services'),
			image: 'assets/img/icon/service.svg',
		},
		{
			changeData: { name: 'restaurant', id: '3' },
			redirectUrl: '/category-listing-restaurants',
			name: 'restaurant',
			title: t('Restaurants'),
			image: 'assets/img/icon/restaurants.svg',
		},
		{
			changeData: { name: 'travel', id: '4' },
			redirectUrl: '/category-listing-travel',
			name: 'travel',
			title: t('Travel'),
			image: 'assets/img/icon/travel.svg',
		},
		{
			changeData: { name: 'realestate', id: '5' },
			redirectUrl: '/category-listing-realestate',
			name: 'realestate',
			title: t('Real Estate / Vacation Rentals'),
			image: 'assets/img/icon/real-estate.svg',
		},
		{
			changeData: { name: 'sport', id: '6' },
			redirectUrl: '/category-listing-sports',
			name: 'sport',
			title: t('Sports & Entertainment'),
			image: 'assets/img/icon/entertainment.svg',
		},
		// {
		// 	changeData: { name: 'job' },
		// 	redirectUrl: '/category-listing-jobs',
		// 	name: 'job',
		// 	title: 'Job Listings',
		// 	image: 'assets/img/icon/job-listing.svg',
		// },
	];
	const additionalData = [
		{
			changeData: { name: 'ngo' },
			redirectUrl: '/category-listing-ngo',
			name: 'ngo',
			title: t('NGO’s'),
			image: 'assets/img/icon/hamzaIcon.svg',
		},
		{
			changeData: { name: 'businesses' },
			name: 'businesses',
			title: t('Business Account'),
			image: 'assets/img/icon/business.svg',
		},
		{
			changeData: { name: 'member' },
			name: 'member',
			title: t('Member Account'),
			image: 'assets/img/icon/member.svg',
		},
		{
			changeData: { name: 'classified' },
			redirectUrl: '/category-listing-classifieds',
			name: 'classified',
			title: t('Classifieds'),
			image: 'assets/img/icon/luggage-1.svg',
		},
		{
			changeData: { name: 'product', id: '1' },
			redirectUrl: '/category-listing-products',
			name: 'product',
			title: t('Products'),
			image: 'assets/img/icon/products.svg',
		},
		{
			changeData: { name: 'service', id: '2' },
			redirectUrl: '/category-listing-services',
			name: 'service',
			title: t('Services'),
			image: 'assets/img/icon/service.svg',
		},
		{
			changeData: { name: 'restaurant', id: '3' },
			redirectUrl: '/category-listing-restaurants',
			name: 'restaurant',
			title: t('Restaurants'),
			image: 'assets/img/icon/restaurants.svg',
		},
		{
			changeData: { name: 'travel', id: '4' },
			redirectUrl: '/category-listing-travel',
			name: 'travel',
			title: t('Travel'),
			image: 'assets/img/icon/travel.svg',
		},
		{
			changeData: { name: 'realestate', id: '5' },
			redirectUrl: '/category-listing-realestate',
			name: 'realestate',
			title: t('Real Estate / Vacation Rentals'),
			image: 'assets/img/icon/real-estate.svg',
		},
		{
			changeData: { name: 'sport', id: '6' },
			redirectUrl: '/category-listing-sports',
			name: 'sport',
			title: t('Sports & Entertainment'),
			image: 'assets/img/icon/entertainment.svg',
		},
		// {
		// 	changeData: { name: 'job' },
		// 	redirectUrl: '/category-listing-jobs',
		// 	name: 'job',
		// 	title: 'Job Listings',
		// 	image: 'assets/img/icon/job-listing.svg',
		// },
	];
	const data = sendLocationState ? normalData : additionalData;

	const handleClick = (e, item) => {
		e.preventDefault();
		if (sendLocationState) {
			navigate(item?.redirectUrl, {
				state: {
					name: item?.name,
				},
			});
		} else {
			setSearchSelectedTab(item?.changeData);
			setSearchFilters((values) => ({
				...values,
				module_type: item?.name,
				pagination_on: 1,
				items_per_page: 16,
			}));
		}
	};

	// console.log('resr', normalData.splice(2, 0, additionalData));
	return (
		// <div className='service-list px-2'>
		// 	<div className='row pb-5 text-center px-lg-0 px-2'>
		<HorizontalCarousel cardsLength={data?.length} type={'navTab'}>
			{data?.map((item) => (
				<div
					replace
					onClick={(e) => handleClick(e, item)}
					className='px-1 service-column selectContainer'
					style={{
						maxWidth: '135.5px',
						height :'154px',
						gap : '1px'
					}}
				>
					<div
						className={` d-flex justify-content-center align-items-center flex-column rounded-15 ${
							!sendLocationState && searchSelectedTab?.name === item?.name && 'active'
						} `}
					>
						<img src={item?.image} width='50' height='50' alt='' />
						<p className='mb-0 text-gray1 pt-2 text-center'>{item?.title}</p>
					</div>
				</div>
			))}
		</HorizontalCarousel>
		// 	</div>
		// </div>
	);
}

export default PageLinkRow;
