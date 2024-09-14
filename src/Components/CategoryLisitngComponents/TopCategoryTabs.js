import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import HorizontalCarousel from '../CommonCrousel/HorizontalCrousel';

function TopCategoryTabs({ selectedTab, setSelectedTab }) {
	const data = [
		{
			changeData: { name: 'ngo' },
			redirectUrl: '/category-listing-ngo',
			name: 'ngo',
			title: `NGO's`,
			image: 'assets/img/icon/hamzaIcon.svg',
		},
		{
			changeData: { name: 'classified' },
			redirectUrl: '/category-listing-classifieds',
			name: 'classified',
			title: 'Classifieds',
			image: 'assets/img/icon/luggage-1.svg',
		},
		{
			changeData: { name: 'product', id: '1' },
			redirectUrl: '/category-listing-products',
			name: 'product',
			title: 'Products',
			image: 'assets/img/icon/products.svg',
		},
		{
			changeData: { name: 'service', id: '2' },
			redirectUrl: '/category-listing-services',
			name: 'service',
			title: 'Services',
			image: 'assets/img/icon/service.svg',
		},
		{
			changeData: { name: 'restaurant', id: '3' },
			redirectUrl: '/category-listing-restaurants',
			name: 'restaurant',
			title: 'Restaurants',
			image: 'assets/img/icon/restaurants.svg',
		},
		{
			changeData: { name: 'travel', id: '4' },
			redirectUrl: '/category-listing-travel',
			name: 'travel',
			title: 'Travel',
			image: 'assets/img/icon/travel.svg',
		},
		{
			changeData: { name: 'realestate', id: '5' },
			redirectUrl: '/category-listing-realestate',
			name: 'realestate',
			title: 'Real Estate / Vacation Rentals',
			image: 'assets/img/icon/real-estate.svg',
		},
		{
			changeData: { name: 'sport', id: '6' },
			redirectUrl: '/category-listing-sports',
			name: 'sport',
			title: 'Sports & Entertainment',
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

	const { t } = useTranslation();

	return (
		// <div className='service-list'>
		// 	<div className='row pb-5 text-center px-lg-0 px-2'>
		<HorizontalCarousel cardsLength={data?.length} type={'navTab'}>
			{data?.map((item) => (
				<Link
					to={item?.redirectUrl}
					replace
					onClick={() => {
						setSelectedTab(item?.changeData);
					}}
					className='px-1 service-column'
					style={{
						maxWidth: '135.5px',
						height: '154px',
						gap: '1px',
					}}
				>
					<div
						className={` d-flex justify-content-center align-items-center flex-column rounded-15 ${
							selectedTab?.name === item?.name && 'active'
						}`}
					>
						<img src={item?.image} width='50' height='50' alt='' />
						<p className='mb-0 text-gray1 pt-2'>{t(item?.title)}</p>
					</div>
				</Link>
			))}
		</HorizontalCarousel>

		// 	</div>
		// </div>
	);
}

export default TopCategoryTabs;
