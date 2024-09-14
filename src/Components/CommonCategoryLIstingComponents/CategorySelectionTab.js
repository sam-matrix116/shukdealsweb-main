import React from 'react';
import { useTranslation } from "react-i18next";

function CategorySelectionTab({ data, filters, handleChange }) {
    const { t } = useTranslation();

	return (
		<div>
			<div
				className='fs-16 fs-sm-14 mb-0 regular text-gray2 d-flex w-100 text-nowrap border p-2 rounded-10 text-truncate'
				id='category'
				data-bs-toggle='dropdown'
			>
				{' '}
				<img
					src='assets/img/icon/category.svg'
					className='me-2'
					alt='shukDeals'
				/>{' '}
				{t("Category")}:
				<span className='text-gray1 px-2 text-truncate'>
					{filters?.category?.name}
				</span>
				<img alt='' src='assets/img/icon/select-arrow.svg' className='drop-icon' />
			</div>
			<div
				className='dropdown-menu py-md-3 pe-md-4 py-2 px-3 category-dropdown overflow-hidden'
				aria-labelledby='category'
				onclick='event.stopPropagation()'
			>
				<div className='sort-list'>
					{data?.filter((ite)=>ite?.name!="Amusement Park,")?.map((item) => (
						<div className='d-flex align-items-center gap-lg-3 gap-2 pb-md-3 pb-2'>
							<input
								type='checkbox'
								id={`category${item?.id}`}
								onChange={(e) => handleChange('category', item)}
								checked={filters?.category?.id && item?.id === filters?.category?.id}
							/>
							<label for={`category${item?.id}`} className='fs-14 fs-sm-10 text-gray2'>
								{item?.name}
							</label>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default CategorySelectionTab;
