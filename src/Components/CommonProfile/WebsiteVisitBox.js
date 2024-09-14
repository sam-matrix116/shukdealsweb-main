import React from 'react';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';

function WebsiteVisitBox({ website_url }) {
    const { t } = useTranslation();
   
	return (
		<>
			{website_url && (
				<div className=' pt-md-0 pt-2'>
					<Link
						to={website_url}
						target='_blank'
						className='button secondary-btn mt-lg-0 mt-2 text-truncate'
                        style={{
                            maxWidth: '150px',
                        }}
					>
						<img src='assets/img/icon/export.svg' />
						{website_url}
					</Link>
				</div>
			)}
		</>
	);
}

export default WebsiteVisitBox;
