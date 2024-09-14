import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function FilterSidePanel({
	data,
	filters,
	type,
	handleSubmit,
	filterByData,
	handleChange,
}) {
	const { t } = useTranslation();

	return (
		<div className='w-100 py-md-3  py-2 px-3'>
			<form
				onSubmit={(e) => handleSubmit(e, filterByData)}
				className=' d-flex flex-column justify-content-between gap-2 w-100 h-100 p-2 tab-pane  filter-list'
			>
				<div>
					{['price_range', 'singleNumber'].includes(type) &&
						data?.map((item, index) => (
							<div className='d-flex flex-column align-items-center form-field text-start gap-1 pb-md-3 pb-2'>
								<label
									for={`filter${item?.param}`}
									className='fs-14  fs-sm-10 text-gray2'
								>
									{t(item?.title)}
								</label>
								<input
									style={{ maxWidth: '150px', marginRight: '10px' }}
									type='number'
									value={
										filterByData?.find((element) => element?.param == item?.param)
											?.value || ''
									}
									// defaultValue={0}
									placeholder='0'
									className=' rounded-3 h-100'
									id={`filter${item?.param}`}
									onChange={(e) => {
										e.preventDefault();
										handleChange('filterByInput', { ...item, value: e?.target?.value });
									}}
								/>
							</div>
						))}

					{['checkBox'].includes(type) &&
						data?.map((item, index) => (
							<div className='d-flex align-items-center gap-lg-3 gap-2 pb-md-3 pb-2'>
								<input
									type='checkbox'
									id={`check${index}`}
									onChange={(e) =>
										handleChange('filterBy', { ...item, value: item?.value })
									}
									checked={
										filterByData?.find((element) => element?.param === item?.param)
											?.value === item?.value
									}
								/>
								<label for={`check${index}`} className='fs-14 fs-sm-10 text-gray2'>
									{item?.title}
								</label>
							</div>
						))}

					{['apiCheckBox'].includes(type) &&
						data?.map((item, index) => (
							<div className='d-flex align-items-center gap-lg-3 gap-2 pb-md-3 pb-2'>
								<input
									type='checkbox'
									id={`image${index}`}
									onChange={(e) =>
										handleChange('filterBy', { ...item, value: item?.id })
									}
									checked={
										filterByData?.find((element) => element?.name === item?.name)
											?.value === item?.id
									}
								/>
								<label for={`image${index}`} className='fs-14 fs-sm-10 text-gray2'>
									{item?.name}
								</label>
							</div>
						))}
				</div>
				<div className='d-flex  justify-content-end '>
					<button type='submit' className='button w-50 p-2 rounded-10 '>
						{t('Apply')}
					</button>
				</div>
			</form>
		</div>
	);
}

export default FilterSidePanel;
