import React from 'react';
import { useTranslation } from "react-i18next";

function SortByTab({ data, filters, handleChange }) {
    const { t } = useTranslation();
	return (
		<div>
			<div
				className='fs-16 fs-sm-14 mb-0 regular text-gray2 d-flex w-100 text-nowrap border p-2 rounded-10 text-truncate'
				id='sorting'
				data-bs-toggle='dropdown'
			>
				{' '}
				<img
					src='assets/img/icon/arrangeverticalsquare.svg'
					className='me-2'
					alt='shukDeals'
				/>{' '}
				{t("Sort by:")}
				<span className='text-gray1 px-2 text-truncate'>
					{filters?.sortBy?.title}
				</span>
				<img alt='' src='assets/img/icon/select-arrow.svg' className='drop-icon' />
			</div>
			<div
				className='dropdown-menu py-md-3 pe-md-4 py-2 px-3 sorting-dropdown overflow-hidden'
				aria-labelledby='sorting'
				onclick='event.stopPropagation()'
			>
				<div className='sort-list'>
					{data?.map((item, index) => (
						<div className='d-flex align-items-center gap-lg-3 gap-2 pb-md-3 pb-2'>
							<input
								type='checkbox'
								id={`sorting${index}`}
								onChange={(e) => handleChange('sortBy', { ...item, value: 1 })}
								checked={
									filters?.sortBy?.param && item?.param === filters?.sortBy?.param
								}
							/>
							<label for={`sorting${index}`} className='fs-14 fs-sm-10 text-gray2'>
								{item?.title}
							</label>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default SortByTab;
