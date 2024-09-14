import React from 'react';
import { useTranslation } from "react-i18next";
import { Endpoints } from '../../API/Endpoints';
import { useLocation, useSearchParams } from 'react-router-dom';
import CommonDetailPage from '../../Components/CommonDetailPage';

function DealDetails() {
    const { t } = useTranslation();
	const [searchParams] = useSearchParams();
	const params = Object.fromEntries([...searchParams]);
	const location2 = useLocation();
	return (
		<>
			{location2?.pathname === '/deal-details' && (
				<CommonDetailPage
					apiUrl={Endpoints.getDealDetails + params?.id}
					params={params}
					detailType={'business_deals'}
				/>
			)}

			{location2?.pathname === '/classified-details' && (
				<CommonDetailPage
					apiUrl={Endpoints.getClassifiedDetails + params?.id}
					params={params}
					detailType={'classified_deals'}
				/>
			)}
		</>
	);
}

export default DealDetails;
