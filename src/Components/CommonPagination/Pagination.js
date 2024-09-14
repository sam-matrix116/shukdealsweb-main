import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { paginationApiHelper } from './paginationApiHelper';
import './style.css';

function Pagination({ paginationData, setPaginationData, setData }) {
	const { t } = useTranslation();
	let {
		currentUrl,
		previousUrl,
		nextUrl,
		totalCount,
		pageCount,
		activePage = 1,
		extraParams,
	} = paginationData;
	return (
		<>
			{totalCount > 0 && (previousUrl || nextUrl) && (
				<div className='paginations text-md-start text-center py-lg-4 py-3'>
					<span className='me-1 fs-15 text-gray12'>
						{t("page")} {activePage} {t("of")} {pageCount?.length}
					</span>
					{previousUrl && (
						<Link
							onClick={(e) => {
								e.preventDefault();
								activePage = activePage - 1;
								setPaginationData((prev) => ({
									...prev,
									currentUrl: previousUrl,
								}));
								paginationApiHelper(
									previousUrl,
									false,
									paginationData,
									setPaginationData,
									setData,
									extraParams,
									activePage
								);
								// setUrl2(previousUrl);
								// setPaginationData({ ...paginationData, activePage: activePage - 1 });
							}}
							className='prev-btn'
						>
							<i className='fa fa-arrow-left pe-2'></i>
							{t('Previous')}
						</Link>
					)}
					{pageCount?.length &&
						pageCount?.map((item, index) => {
							return (
								<Link
									onClick={(e) => {
										e.preventDefault();
										paginationApiHelper(
											currentUrl,
											true,
											paginationData,
											setPaginationData,
											setData,
											extraParams,
											parseInt(item)
										);
										// setPaginationData({ ...paginationData, activePage: item });
									}}
									key={index}
									className={
										parseInt(activePage) === parseInt(item)
											? // || (parseInt(activePage) === parseInt(item) && parseInt(item) == 1)
											  'page-activePage btn-pagination-active'
											: ''
									}
								>
									{item}
								</Link>
							);
						})}
					{nextUrl && (
						<Link
							onClick={(e) => {
								e.preventDefault();
								activePage = activePage + 1;
								setPaginationData((prev) => ({
									...prev,
									currentUrl: nextUrl,
								}));
								paginationApiHelper(
									nextUrl,
									false,
									paginationData,
									setPaginationData,
									setData,
									extraParams,
									activePage
								);
								// setUrl2(nextUrl);
								// setPaginationData({ ...paginationData, activePage: activePage + 1 });
							}}
							className='next-btn btn-activePage'
						>
							{t('Next')} <i className='fa fa-arrow-right ps-2'></i>
						</Link>
					)}
				</div>
			)}
		</>
	);
}

export default Pagination;
