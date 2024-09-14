import React, { createContext, useState, useContext } from 'react';
import { useTranslation } from "react-i18next";

const ModalContext = createContext();

export function ModalProvider({ children }) {
    const { t } = useTranslation();
	// Share modal States
	const [isShareModalVisible, setIsShareModalVisible] = useState(false);
	const [shareUrl, setShareUrl] = useState('');
	// text box states
	const [isTextBoxModalVisible, setIsTextBoxModalVisible] = useState(false);
	const [textBoxData, setTextBoxData] = useState({});
	// Selection box states
	const [isSelectionBoxModalVisible, setIsSelectionBoxModalVisible] =
		useState(false);
	const [selectionBoxData, setSelectionBoxData] = useState({});
	// Authenticate box states
	const [isAuthenticateModalVisible, setIsAuthenticateModalVisible] =
		useState(false);
	const [AuthenticateModalData, setAuthenticateModalData] = useState({});
	// Credential change box states
	const [isCredentialChangeModalVisible, setIsCredentialChangeModalVisible] =
		useState(false);
	const [CredentialChangeModalData, setCredentialChangeModalData] = useState({});
	// Location change box states
	const [isLocationChangeModalVisible, setIsLocationChangeModalVisible] =
		useState(false);
	const [LocationChangeModalData, setLocationChangeModalData] = useState({});
	// Create Preview modal states
	const [isCreatePreviewModalVisible, setIsCreatePreviewModalVisible] =
		useState(false);
	const [previewModalData, setPreviewModalData] = useState({});
	// Loading Modal states
	const [isLoadingModalVisible, setIsLoadingModalVisible] = useState(false);
	const [loadingModalData, setLoadingModalData] = useState({});

	return (
		<ModalContext.Provider
			value={{
				// Share Modal
				isShareModalVisible,
				setIsShareModalVisible,
				shareUrl,
				setShareUrl,
				// text box Modal
				isTextBoxModalVisible,
				setIsTextBoxModalVisible,
				textBoxData,
				setTextBoxData,
				// Selection box modal
				isSelectionBoxModalVisible,
				setIsSelectionBoxModalVisible,
				selectionBoxData,
				setSelectionBoxData,
				// Authenticate Modal
				isAuthenticateModalVisible,
				setIsAuthenticateModalVisible,
				AuthenticateModalData,
				setAuthenticateModalData,
				// Credential change Modal
				isCredentialChangeModalVisible,
				setIsCredentialChangeModalVisible,
				CredentialChangeModalData,
				setCredentialChangeModalData,
				// Location change modal
				isLocationChangeModalVisible,
				setIsLocationChangeModalVisible,
				LocationChangeModalData,
				setLocationChangeModalData,
				// Create preview Modal
				isCreatePreviewModalVisible,
				setIsCreatePreviewModalVisible,
				previewModalData,
				setPreviewModalData,
				// Loading Modal states
				isLoadingModalVisible,
				setIsLoadingModalVisible,
				loadingModalData,
				setLoadingModalData,
			}}
		>
			{children}
		</ModalContext.Provider>
	);
}

export default function useModalContext() {
	return useContext(ModalContext);
}
