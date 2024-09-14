import React, { useState, useEffect } from 'react';
import { FetchApi } from '../../API/FetchApi';
import ToastMessage from '../../Utils/ToastMessage';
import { useTranslation } from 'react-i18next';
import { getUserToken } from '../../helpers/authUtils';

const DownloadPdf = ({ pdfUrl }) => {
	const { t } = useTranslation();
	const [pdfData, setPdfData] = useState();

	// TODO: Remove this function as it's not used.
	// const getProfileDetails = async () => {
	// 	try {
	// 		console.log(pdfUrl);
	// 		let resp = await FetchApi(pdfUrl, null, null, null, true, null, 'blob');
	// 		if (resp) {
	// 			console.log(resp.blob());
	// 			const pdfBlob = new Blob([resp.blob()], { type: 'application/pdf' });
	// 			setPdfData(pdfBlob);
	// 			console.log(pdfBlob);
	// 		} else {
	// 			ToastMessage.Error(resp?.message);
	// 		}
	// 	} catch (e) {
	// 		if (e && e.response && e.response.data && e.response.data.message) {
	// 			ToastMessage.Error(e.response.data.message);
	// 		}
	// 	}
	// };

	const handleDownload = async () => {

		let resp = await FetchApi(pdfUrl, null, null, null, true, null, 'blob');
		if (resp) {
			console.log(resp);
			const url = window.URL.createObjectURL(resp);

			const link = document.createElement('a');
			link.href = url;
			link.download = 'invoice.pdf';

			document.body.appendChild(link);

			link.click();

			link.parentNode.removeChild(link);
		} else {
			ToastMessage.Error(resp?.message);
		}
	};

	return (
		<h6
			className='medium fs-sm-14 fs-16 selectContainer'
			style={{
				color: '#3B618B',
			}}
			onClick={handleDownload}
		>
			{t("Download Invoice")}
		</h6>
	);
};

export default DownloadPdf;
