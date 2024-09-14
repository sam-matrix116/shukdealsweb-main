import React from 'react';
import { useTranslation } from 'react-i18next';
import {
	ShareModal,
	CreatePreviewModal,
	TextBoxModal,
	SelectionBoxModal,
	AuthenticateModal,
	CredentialChangeModal,
	LoadingModal,
	LocationChangeModal,
	FakeLoadingSpinner,
} from './Components/modals';
import useModalContext from './context/modalContext';
function Modals() {
	const { t } = useTranslation();
	const {
		// Share Modal
		setIsShareModalVisible,
		isShareModalVisible,
		shareUrl,

		// Text Box Modal
		isTextBoxModalVisible,
		setIsTextBoxModalVisible,
		textBoxData,

		// Radio Box Modal
		isSelectionBoxModalVisible,
		setIsSelectionBoxModalVisible,
		selectionBoxData,

		// Authenticate Modal
		isAuthenticateModalVisible,
		setIsAuthenticateModalVisible,
		AuthenticateModalData,

		// Credential change Modal
		isCredentialChangeModalVisible,
		setIsCredentialChangeModalVisible,
		CredentialChangeModalData,

		// Location change modal
		isLocationChangeModalVisible,
		setIsLocationChangeModalVisible,
		LocationChangeModalData,

		// Create preview Modal
		isCreatePreviewModalVisible,
		setIsCreatePreviewModalVisible,
		previewModalData,

		// Loading Modal states
		isLoadingModalVisible,
		setIsLoadingModalVisible,
		loadingModalData,

		//Fake Loading Modal states
	} = useModalContext();

	return (
		<>
			<ShareModal
				isModalVisible={isShareModalVisible}
				setIsmodalVisible={setIsShareModalVisible}
				shareUrl={shareUrl}
			/>
			<TextBoxModal
				isModalVisible={isTextBoxModalVisible}
				setIsmodalVisible={setIsTextBoxModalVisible}
				data={textBoxData}
			/>
			<SelectionBoxModal
				isModalVisible={isSelectionBoxModalVisible}
				setIsmodalVisible={setIsSelectionBoxModalVisible}
				data={selectionBoxData}
			/>
			<AuthenticateModal
				isModalVisible={isAuthenticateModalVisible}
				setIsmodalVisible={setIsAuthenticateModalVisible}
				data={AuthenticateModalData}
			/>
			<CredentialChangeModal
				isModalVisible={isCredentialChangeModalVisible}
				setIsmodalVisible={setIsCredentialChangeModalVisible}
				data={CredentialChangeModalData}
			/>
			<LocationChangeModal
				isModalVisible={isLocationChangeModalVisible}
				setIsmodalVisible={setIsLocationChangeModalVisible}
				data={LocationChangeModalData}
			/>
			<CreatePreviewModal
				isModalVisible={isCreatePreviewModalVisible}
				setIsmodalVisible={setIsCreatePreviewModalVisible}
				data={previewModalData}
			/>
			<LoadingModal
				isModalVisible={isLoadingModalVisible}
				setIsmodalVisible={setIsLoadingModalVisible}
				data={loadingModalData}
			/>
			<FakeLoadingSpinner />
		</>
	);
}

export default Modals;
