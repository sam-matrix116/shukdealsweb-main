import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import CategorySelectionTab from './CategorySelectionTab';
import SortByTab from './SortByTab';
import FilterSelectionTab from './FilterSelectionTab';
import LocationSelectionTab from './LocationSelectionTab';
import './Style.css';
import { useState } from 'react';
import TypeSelectionBars from './TypeSelectionBars';

function CategoryLisitngFlterHeader({
	spread,
	subSelect,
	setSubSelect,
	filters,
	setFilters,
	filtersData,
	setFiltersData,
}) {
	const { t } = useTranslation();
	const [filterByData, setFilterByData] = useState(filters?.filterBy || []);

	const handleChange = (event, data) => {
		if (event.persist) event.persist();
		if (typeof data !== 'undefined' && event !== 'filterBy') {
			setFilters((values) => ({
				...values,
				[event]: data,
			}));
		} else {
			setFilters((values) => ({
				...values,
				[event?.target?.name]: event?.target?.value,
			}));
		}
	};

	const handleReset = () => {
		setFilters({});
		setFilterByData([]);
	};
	return (
		<>
			{filtersData?.typeSelectionData?.length ? (
				<TypeSelectionBars
					data={filtersData?.typeSelectionData}
					setFilters={setFilters}
					subSelect={subSelect}
					setSubSelect={setSubSelect}
				/>
			) : null}
			<div
				className={`d-md-flex  align-items-center  gap-md-2 gap-1 ${
					spread ? 'justify-content-between' : 'justify-content-end'
				}`}
			>
				<div className='filter-design-1 d-sm-flex gap-md-2 gap-1'>
					{/* Category selection */}
					{filtersData?.categoryData?.length ? (
						<CategorySelectionTab
							data={filtersData?.categoryData}
							filters={filters}
							handleChange={handleChange}
						/>
					) : null}
					{/* Location select */}
					<LocationSelectionTab
						setFilters={setFilters}
						handleChange={handleChange}
					/>
				</div>
				<div className='filter-design-1 d-sm-flex align-items-center gap-md-2 gap-1'>
					{/* sort by */}
					{filtersData?.sortingData?.length ? (
						<SortByTab
							data={filtersData?.sortingData}
							filters={filters}
							handleChange={handleChange}
						/>
					) : null}
					{/* filter */}
					{filtersData?.filteringData?.length ? (
						<FilterSelectionTab
							data={filtersData?.filteringData}
							filters={filters}
							setFilters={setFilters}
							filterByData={filterByData}
							setFilterByData={setFilterByData}
						/>
					) : null}

					{/* Reset all */}
					<Link
						to={''}
						onClick={handleReset}
						className='teritiary-btn fs-sm-13 text-decoration-underline'
					>
						{t('Reset All')}
					</Link>
				</div>
			</div>
		</>
	);
}

export default CategoryLisitngFlterHeader;
