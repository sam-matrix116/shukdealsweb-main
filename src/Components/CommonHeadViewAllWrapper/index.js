import React, { Children } from 'react';
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from 'react-router-dom';
import useSearchContext from '../../context/searchContext';
import { Pagination } from '../CommonPagination';

function CommonHeadViewAllWrapper({ dataLength, title, changeData, children }) {
    const { t } = useTranslation();
	const {
		setSearchFilters,

		setSearchSelectedTab,
	} = useSearchContext();

	const handleViewAll = (e) => {
		setSearchFilters((values) => ({
			...values,
			module_type: changeData?.name,
			pagination_on: 1,
			items_per_page: 16,
		}));
		setSearchSelectedTab(changeData);

		e.preventDefault();
	};
	return (
		<>
			<div className='d-flex align-items-center justify-content-between pb-md-3 pb-2'>
				<h2 className='fs-30 fs-sm-18'>{title}</h2>
				{dataLength >= 4 && (
					<Link
						onClick={handleViewAll}
						className='text-decoration-underline text-blue fs-sm-13'
					>{t("View All")}
					</Link>
				)}
			</div>
			{children}
			{/* {activatePagination && (
				<Pagination
					paginationData={paginationData}
					setPaginationData={setPaginationData}
					setData={setData}
				/>
			)} */}
		</>
	);
}

export default CommonHeadViewAllWrapper;
