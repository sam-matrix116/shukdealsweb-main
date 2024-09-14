import React from 'react';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';

function TypeSelectionBars({ data, setFilters, subSelect, setSubSelect }) {
    const { t } = useTranslation();
	return (
		<div
			className={
				'd-lg-flex justify-content-between align-items-center border-bottom mb-3'
			}
		>
			<ul className='wishlist-menu d-flex justify-content-between fs-22 mb-lg-0 mb-2 text-gray2 flex-wrap gap-4'>
				{data?.map((item) => (
					<li>
						<Link
							onClick={(e) => {
								setFilters({});
								setSubSelect(item);
							}}
							className={subSelect?.id == item?.id && 'active'}
						>
							{item?.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export default TypeSelectionBars;
