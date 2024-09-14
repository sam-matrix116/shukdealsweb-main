import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import { useNavigate } from 'react-router-dom';
import ToastMessage from '../../Utils/ToastMessage';
import { getLoggedInUser, setCookie } from '../../helpers';
import { ValidateList, ValidationTypes } from '../../Utils/ValidationHelper';
import Select from 'react-select';
const $ = window.jQuery;

function UpdateNgoModal({ modalVisible, setModalVisible, ngo, setApiCall}) {
	const user = getLoggedInUser();
	const { t } = useTranslation();
	const [ngoList, setNgoList] = useState([]);
	const [locationCount, setLocationCount] = useState(1);
	const [selectedNgo, setSelectedNgo] = useState('');
	const [selectedNgo2, setSelectedNgo2] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const customStyles = {
		option: (provided, state) => ({
			...provided,
			borderBottom: '1px solid gray',
			//   color: state.isSelected ? 'red' : 'blue',
			padding: 10,
		}),
	};

	const getNgoList = async () => {
		try {
			let resp = await FetchApi(Endpoints.ngoList);
			if (resp && resp.data) {
				setNgoList(resp.data?.filter((item, index)=> item?.id != ngo?.id));
			}
		} catch (e) { }
	};

	const handleChange = (e) => {
		setSelectedNgo(e);
	};

	const customFilter = (option, searchText) => {

		if (
			option.data.name.toLowerCase().includes(searchText.toLowerCase())
		) {
			return true;
		} else {
			return false;
		}
	};

	useEffect(() => {
		getNgoList();
	}, []);

	useEffect(() => {
		if (selectedNgo2.length) {
			setSelectedNgo(selectedNgo2[0]);
		}
	}, [selectedNgo2.length]);
	console.log({ selectedNgo });

	const validationArr = () => {
		return [
			[
				selectedNgo,
				ValidationTypes.Empty,
				t('Please select NGO'),
			],
		];
	};

	const updateNgo = async () => {
		let validate = await ValidateList(validationArr());
		if (!validate) {
			return;
		}
		let obj = {
			ngo: selectedNgo?.id,
		};
		try {
            setIsLoading(true);
			let resp = await FetchApi(Endpoints.updateNgo, obj);
			if (resp && resp.status) {
                ToastMessage.Success(resp?.message);
                setIsLoading(false);
                setApiCall(true);
				setModalVisible(false);
				// localStorage.setItem('paytype', 'location');
				// setCookie('payment_detail', resp?.payment_detail);
				// navigate('/payment');
			}
		} catch (e) {
            setIsLoading(false);
        }
	};
	// useEffect(() => {
	// 	if (modalVisible) {
	// 		$('#add').modal(modalVisible);
	// 	}
	// }, [modalVisible]);

	return (
        <>
        {modalVisible && 
		<div
        className='modal d-block submitted-modal'
        id='business_submitted'
        tabindex='-1'
        aria-labelledby='business_submitted'
        aria-hidden='true'
        >
			<div className='modal-dialog modal-dialog-top'>
				<div className='modal-content rounded-20 border-0'>
					<div className='modal-header border-0 p-0'>
						<button
                        onClick={()=>{
                            setModalVisible(false);
                        }}
							type='button'
							className='outside-close bg-transparent border-0'
						>
							<img src='assets/img/icon/close.svg' alt='' />
						</button>
					</div>
					<div className='modal-body p-4 '>
						<h3 style={{fontWeight: 'bold'}} className='fs-18 fs-sm-16 pt-3 pb-2 text-gray1'>
							{t('Update NGO')}
						</h3>
						
						<form action='' className='site-form mt-4'>
							<div className='form-field'>
                            <div className='form-field mb-4 pb-2 '>
                                
                                <label for='' className='d-block pb-2'>
                                    {t("Choose Who To Support")}
                                </label>

                                <Select
                                    // isDisabled={true}
                                    styles={customStyles}
                                    menuShouldScrollIntoView={false}
                                    placeholder={t('Select NGO to Support')}
                                    value={selectedNgo}
                                    options={ngoList}
                                    onChange={handleChange}
                                    getOptionValue={(option) => option.id}
                                    filterOption={customFilter}
                                    getOptionLabel={(e) => (
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <img
                                                    src={
                                                        e?.image
                                                            ? Endpoints.baseUrl + e?.image
                                                            : 'assets/img/icon/non-profit-organization 1.svg'
                                                    }
                                                    alt='img'
                                                    style={{ width: '25px', height: '25px', borderRadius: '50%' }}
                                                />
                                                <span style={{ marginLeft: 7, fontSize: '12px' }}>
                                                    {e?.name}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
							</div>
						</form>

						<div className='payment-summary'>
							<div className='d-flex justify-content-center gap-3 pt-3 btn-group'>
								<button
									onClick={() => {
										setModalVisible(false);

										// $('#add').modal('hide');
									}}
									className='button gray-btn rounded-10 fs-20 medium w-100'
									data-bs-dismiss='modal'
									aria-label='Close'
								>
									{t('Cancel')}
								</button>
								<button
                                disabled={isLoading}
									onClick={(e) => {
										if (!locationCount) {
											ToastMessage.Error(t('Please Enter Location count'));
											return;
										}
										updateNgo();
										e.preventDefault();
									}}
									data-bs-dismiss='modal'
									aria-label={locationCount ? 'Close' : ''}
									className='button rounded-10 fs-20 medium w-100'
								>
									{t('Continue')}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>}
        </>
	);
}

export default UpdateNgoModal;
