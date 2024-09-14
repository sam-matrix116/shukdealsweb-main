import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FilterSidePanel from './FilterSidePanel';
import { FetchApi } from '../../../API/FetchApi';
import { Endpoints } from '../../../API/Endpoints';
import ToastMessage from '../../../Utils/ToastMessage';

function FilterSelectionTab({
	data,
	filters,
	setFilters,
	filterByData,
	setFilterByData,
}) {
	const { t } = useTranslation();
	const [selectedTab, setSelectedTab] = useState();
	const [apiData, setApiData] = useState();
	const getDeliveryServices = async () => {
		try {
			let resp = await FetchApi(Endpoints.getDeliveryPartners);
			if (resp) {
				setApiData(resp?.data);
			}
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};
	const handleChange = (event, data) => {
		if (event === 'filterByInput') {
			console.log({ data });

			setFilterByData((value) => {
				let rem = value?.filter((item) => item.param !== data?.param);
				rem.push(data);
				if (data?.param !== 'min') {
					rem.push({
						param: 'price_range_min',
						title: 'min',
						value: '0',
					});
				}
				return rem;
			});
		}
		if (event === 'filterBy') {
			setFilterByData((value) => {
				let rem = value?.filter((item) => item.param !== data?.param);
				rem.push(data);
				return rem;
			});
		}
	};
	const handleSelection = (e, item) => {
		setSelectedTab(item);

		e.preventDefault();
	};
	const handleSubmit = (e, data) => {
		setFilters((values) => ({
			...values,
			filterBy: data,
		}));
		e.preventDefault();
	};
	const price_range_data = [
		{ title: 'min', param: selectedTab?.param1 },
		{ title: 'max', param: selectedTab?.param2 },
	];
	const checkBoxData = {
		star_rating: [
			{ title: `1 ${t("star")}`, value: '1', param: selectedTab?.param },
			{ title: `2 ${t("star")}`, value: '2', param: selectedTab?.param },
			{ title: `3 ${t("star")}`, value: '3', param: selectedTab?.param },
			{ title: `4 ${t("star & up")}`, value: '4', param: selectedTab?.param },
		],
		product_condition: [
			{ title: 'New', value: 'new', param: selectedTab?.param },
			{ title: 'Used', value: 'old', param: selectedTab?.param },
		],
		provider_type: [
			{ title: 'Independent', value: 'independent', param: selectedTab?.param },
			{ title: 'Company', value: 'company', param: selectedTab?.param },
		],
		reservation_walkin: [
			{ title: 'Reservation', value: 'reservation', param: selectedTab?.param },
			{ title: 'Walkin', value: 'walkin', param: selectedTab?.param },
		],
		property_class: [
			{ title: '1 star', value: '1', param: selectedTab?.param },
			{ title: '2 star', value: '2', param: selectedTab?.param },
			{ title: '3 star', value: '3', param: selectedTab?.param },
			{ title: '4 star', value: '4', param: selectedTab?.param },
			{ title: '5 star', value: '5', param: selectedTab?.param },
		],
		no_of_bathroom: [
			{ title: '1 Bathroom', value: '1', param: selectedTab?.param },
			{ title: '2 Bathroom', value: '2', param: selectedTab?.param },
			{ title: '3 Bathroom', value: '3', param: selectedTab?.param },
			{ title: '4 Bathroom', value: '4', param: selectedTab?.param },
			{ title: '5 Bathroom', value: '5', param: selectedTab?.param },
		],
		no_of_bedroom: [
			{ title: '1 Bedrooms', value: '1', param: selectedTab?.param },
			{ title: '2 Bedrooms', value: '2', param: selectedTab?.param },
			{ title: '3 Bedrooms', value: '3', param: selectedTab?.param },
			{ title: '4 Bedrooms', value: '4', param: selectedTab?.param },
			{ title: '5 Bedrooms', value: '5', param: selectedTab?.param },
		],
	};
	const singleNumber = {
		no_of_bathroom: [{ title: 'Number of Bathrooms', param: selectedTab?.param }],
		no_of_bedroom: [{ title: 'Number of Bedrooms', param: selectedTab?.param }],
		number_of_travellers: [
			{ title: 'Number of Travellers', param: selectedTab?.param },
		],
		sq_ft: [{ title: 'Number of square feet', param: selectedTab?.param }],
	};
	const apiBoxData = apiData
		? apiData?.map((item) => ({ ...item, param: selectedTab?.param }))
		: null;

	useEffect(() => {
		if (['delivery_service'].includes(selectedTab?.param)) {
			getDeliveryServices();
		}
	}, [selectedTab]);

	useEffect(() => {
		if (data) {
			setSelectedTab(data[0]);
		}
	}, [data]);
	return (
		<div className=''>
			<p
				id='filters'
				data-bs-toggle='dropdown'
				className='border p-2 rounded-10 my-sm-0 my-2 mb-0 fs-16 fs-sm-14 d-flex w-100 text-nowrap text-gray2 '
			>
				<img
					src='assets/img/icon/documentfilter.svg'
					className='me-2'
					alt='shukDeals'
				/>
				<span>{t('Filters ')}</span>
				<img src='assets/img/icon/select-arrow.svg' className='drop-icon ms-3' />
			</p>

			<div
				className='dropdown-menu p-0 filter-dropdown dropdown-menu-md-end  overflow-hidden'
				aria-labelledby='filters'
			>
				<div className='d-flex '>
					{/* <!-- Nav tabs --> */}
					<ul
						className='nav nav-tabs flex-column border-0'
						id='filterTab'
						role='tablist'
						onClick={(e) => e.stopPropagation()}
					>
						{data?.map((item) => (
							<li className='nav-item' role='presentation'>
								<button
									className={`nav-link fs-14 fs-sm-10 ${
										selectedTab?.title === item?.title && 'active'
									}`}
									id={item?.title}
									type='button'
									onClick={(e) => handleSelection(e, item)}
								>
									{item?.title}
								</button>
							</li>
						))}
					</ul>
					{['Price Range (Minimum / Maximum)'].includes(selectedTab?.title) ? (
						<FilterSidePanel
							type={'price_range'}
							filters={filters}
							filterByData={filterByData}
							handleChange={handleChange}
							data={price_range_data}
							handleSubmit={handleSubmit}
						/>
					) : [
							'number_of_travellers',
							'no_of_bedroom',
							'no_of_bathroom',
							'sq_ft',
					  ].includes(selectedTab?.param) ? (
						<FilterSidePanel
							type={'singleNumber'}
							filters={filters}
							filterByData={filterByData}
							handleChange={handleChange}
							data={singleNumber[selectedTab?.param]}
							handleSubmit={handleSubmit}
						/>
					) : [
							'star_rating',
							'product_condition',
							'provider_type',
							'reservation_walkin',
							'property_class',
					  ].includes(selectedTab?.param) ? (
						<FilterSidePanel
							type={'checkBox'}
							filters={filters}
							filterByData={filterByData}
							handleChange={handleChange}
							data={checkBoxData[selectedTab?.param]}
							handleSubmit={handleSubmit}
						/>
					) : ['delivery_service'].includes(selectedTab?.param) ? (
						<FilterSidePanel
							type={'apiCheckBox'}
							filters={filters}
							data={apiBoxData}
							filterByData={filterByData}
							handleChange={handleChange}
							handleSubmit={handleSubmit}
						/>
					) : null}
				</div>
			</div>
		</div>
	);
}

export default FilterSelectionTab;
