import React from 'react';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import { Link } from 'react-router-dom';
import ToastMessage from '../../Utils/ToastMessage';
import Swal from 'sweetalert2';
import ConfirmMessage from '../../Utils/ConfirmMessage';
import { getLoggedInUser } from '../../helpers';
import { useTranslation } from 'react-i18next';
import UpdateNgo from './UpdateNgo';

const ProfileNgobox = ({
	profileData,
	getProfileDetails,
	familyMember,
	deleteConfirmMessgae,
	isUpdateNgo,
	setCallApi
}) => {
	const user = getLoggedInUser();
	const {t} = useTranslation();
	const removeFamilyMember = async () => {
		try {
			let resp = await FetchApi(Endpoints.removeFamilyMember);
			if (resp && resp.status) {
				getProfileDetails();
				ToastMessage.Success(resp.message);
			}
		} catch (e) {
			console.log('error', e);
		}
	};

	return (
		<>
			<div className='profile-ngo-box'>
				<Link
				to={
					Endpoints.frontendUrl +
					`/ngo-profile-other-view?id=${profileData?.associated_ngo?.id}`
				}
				className='shadow-sm px-2 py-2 d-flex align-items-center gap-2 rounded-15 pe-lg-5'>
					{profileData?.associated_ngo?.image ? (
						<img
							src={Endpoints.baseUrl + profileData?.associated_ngo?.image}
							alt=''
							className='ms-xl-1'
						/>
					) : (
						<img src='assets/img/icon' alt='' className='ms-xl-1' />
					)}
					<h5 className='fs-16 bold pe-xl-1 fs-sm-9'>
						{profileData?.associated_ngo?.name}
					</h5>
				</Link>

				{/* {isUpdateNgo && <UpdateNgo ngo={profileData?.associated_ngo} setCallApi={setCallApi}/>} */}

				{familyMember && !user?.parent && user?.plan?.name != 'Basic' ? (
					<div className='border rounded-10 d-flex align-items-center gap-2 bg-white mt-2 p-2'>
						{profileData?.family_member?.image ? (
							<img
								src={Endpoints.baseUrl + profileData?.family_member?.image}
								className='rounded-circle'
								alt=''
							/>
						) : (
							// <i className="rounded-circle"></i>
							<img
								alt=''
								style={{ width: '50px' }}
								src='assets/img/dummy.png'
								className='rounded-circle'
							/>
						)}
						<div>
							<h5
								onClick={() => {
									// setIsAddFamilyMember(true);
									// setIsCreateClassified(false);
								}}
								className='fs-16 bold pe-xl-1 fs-sm-9'
							>
								{profileData?.family_member?.firstname || t('Family member name')}
							</h5>
							<Link
								to={!profileData?.family_member ? '/add-family-member' : null}
								onClick={async () => {
									if (profileData?.family_member) {
										const confirm = await ConfirmMessage(deleteConfirmMessgae);
										if (confirm?.isConfirmed) {
											removeFamilyMember();
										}
									}
									// else{
									//     navigate('/add-family-member')
									// }
								}}
								className='text-blue fs-14 fs-sm-9'
							>
								{profileData?.family_member
									? t('Remove Family Member')
									: t('Add Family Member')}
							</Link>
						</div>
					</div>
				) : null}

				{isUpdateNgo && <UpdateNgo ngo={profileData?.associated_ngo} setCallApi={setCallApi}/>}
			</div>
		</>
	);
};

export default ProfileNgobox;
