/* eslint-disable eqeqeq */
import { useTranslation } from 'react-i18next';
import React, { useEffect } from 'react';
import CustomHeader from '../../Components/CustomHeader';
import CustomFooter from '../../Components/CustomFooter';
import { Endpoints } from '../../API/Endpoints';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CommonFavouriteListing from '../../Components/ListingItems/CommonFavouriteListing';
import FavouriteListingHeader from '../../Components/ListingItems/FavouriteListingHeader';

function WishList() {
	const { t } = useTranslation();
	const location = useLocation();
	const [filters, setFilters] = useState({});
	const [tab, setTab] = useState(
		window.location.pathname === '/redeemed-deals-listing'
			? 'my-redeemed'
			: 'listing'
	);
	useEffect(() => {
		if (location?.state?.favoriteTab) {
			setTab(location?.state?.favoriteTab);
		}
	}, []);

	return (
		<div>
			<CustomHeader />
			<div className='main py-lg-5 py-3'>
				<div className='container'>
					<FavouriteListingHeader
						listingType={tab}
						filters={filters}
						setFilters={setFilters}
					/>

					{window.location.pathname !== '/redeemed-deals-listing' && (
						<ul className='wishlist-menu d-flex justify-content-between border-bottom mb-3 fs-22 fs-sm-12 text-gray2 flex-wrap gap-md-0 gap-3'>
							<li>
								<Link
									onClick={() => {
										setTab('listing');
									}}
									className={tab == 'listing' ? 'active' : ''}
								>
									{t('Deals')}
								</Link>
							</li>
							<li>
								<Link
									onClick={() => {
										setTab('weekly');
									}}
									className={tab == 'weekly' ? 'active' : ''}
								>
									{t('Weekly Deals')}
								</Link>
							</li>
							<li>
								<Link
									onClick={() => {
										setTab('classified');
									}}
									className={tab == 'classified' ? 'active' : ''}
								>
									{t('Classifieds')}
								</Link>
							</li>
							<li>
								<Link
									onClick={() => {
										setTab('user');
									}}
									className={tab == 'user' ? 'active' : ''}
								>
									{t('User')}
								</Link>
							</li>
							<li>
								<Link
									onClick={() => {
										setTab('business');
									}}
									className={tab == 'business' ? 'active' : ''}
								>
									{t('Business Store')}
								</Link>
							</li>
							<li>
								<Link
									onClick={() => {
										setTab('ngo');
									}}
									className={tab == 'ngo' ? 'active' : ''}
								>
									{t("NGO's")}
								</Link>
							</li>
							<li>
								<Link
									onClick={() => {
										setTab('video');
									}}
									className={tab == 'video' ? 'active' : ''}
								>
									{t('Videos')}
								</Link>
							</li>
							{/* <li>
								<Link
									onClick={() => {
										setTab('jobs');
									}}
									className={tab == 'jobs' ? 'active' : ''}
								>
									Job Posting
								</Link>
							</li> */}
						</ul>
					)}

					{tab == 'my-redeemed' && (
						<CommonFavouriteListing
							url={Endpoints.myRedeemedDeals}
							paginationSize={6}
							dataType={'my-redeemed'}
							activatePagination={true}
							filters={filters}
						/>
					)}
					{tab == 'classified' && (
						<CommonFavouriteListing
							url={Endpoints.getClassifiedWishlist}
							paginationSize={6}
							dataType={'favourite-classified'}
							activatePagination={true}
							filters={filters}
						/>
					)}

					{tab == 'listing' && (
						<CommonFavouriteListing
							url={Endpoints.getListingWishlist}
							paginationSize={6}
							dataType={'favourite-listing'}
							activatePagination={true}
							filters={filters}
						/>
					)}

					{tab == 'weekly' && (
						<CommonFavouriteListing
							url={Endpoints.getWeeklyDealWishlist}
							paginationSize={6}
							dataType={'favourite-weekly'}
							activatePagination={true}
							filters={filters}
						/>
					)}

					{tab == 'user' && (
						<CommonFavouriteListing
							url={Endpoints.getUsersWishlist}
							paginationSize={6}
							dataType={'favourite-user'}
							activatePagination={true}
							filters={filters}
						/>
					)}

					{tab == 'business' && (
						<CommonFavouriteListing
							url={Endpoints.getBusinessStoreWishlist}
							paginationSize={6}
							dataType={'favourite-business'}
							activatePagination={true}
							filters={filters}
						/>
					)}

					{tab == 'ngo' && (
						<CommonFavouriteListing
							url={Endpoints.getNgoWishlist}
							paginationSize={6}
							dataType={'favourite-ngo'}
							activatePagination={true}
							filters={filters}
						/>
					)}

					{tab == 'video' && (
						<CommonFavouriteListing
							url={Endpoints.getNgoVideoWishlist}
							paginationSize={6}
							dataType={'favourite-ngo-video'}
							activatePagination={true}
							filters={filters}
						/>
					)}

					{tab == 'jobs' && (
						<CommonFavouriteListing
							url={Endpoints.getJobWishlist}
							paginationSize={6}
							dataType={'favourite-jobs'}
							activatePagination={true}
							filters={filters}
						/>
					)}
				</div>
			</div>

			<CustomFooter internal />
		</div>
	);
}

export default WishList;
