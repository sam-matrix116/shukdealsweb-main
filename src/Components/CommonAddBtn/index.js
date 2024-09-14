import React from 'react';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';

function CommonAddBtn({ profileData, categoryType, removeTitle, weekly_home_btn }) {
    const { t } = useTranslation();
	return (
		<>
			{(categoryType === 'deal' || categoryType === 'btn' || categoryType==="weekly_deal") && (
				<div className='d-flex align-items-center gap-2 pb-4 py-3'>
					{!removeTitle && <h3 className='fs-30 fs-sm-24 text-gray1 '>{t("All Deals")}</h3>}
					<Link
						to={
							categoryType==="weekly_deal"? "/create-weekly-deal" :
							profileData?.business_category_details?.name === 'Restaurant'
								? '/create-listing-restaurant'
								: profileData?.business_category_details?.name === 'Real Estate'
								? '/create-listing-realestate'
								: profileData?.business_category_details?.name === 'Product'
								? '/create-product-deal'
								: profileData?.business_category_details?.name === 'Travel'
								? '/create-travel-deal'
								: profileData?.business_category_details?.keyword === 'entertainment_sport'
								? '/create-sport-deal'
								: profileData?.business_category_details?.name === 'Service'
								? '/create-service-deal'
								: profileData?.user_type === 'Non Profitable Organization'
								? '/create-ngo-deal'
								: '/create-weekly-deal'
						}
						className='button py-2'
					>
						{categoryType !== 'btn' && !weekly_home_btn && (
							<i className='fa-light fa-plus-circle me-2 fs-20 align-middle'></i>
						)}
						{categoryType === 'btn' ? t('Create Deal') : categoryType === "weekly_deal"? t('Add Weekly Deals') : t('Add Deals')}
					</Link>
				</div>
			)}
		</>
	);
}

export default CommonAddBtn;
