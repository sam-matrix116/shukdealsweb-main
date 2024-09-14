import React from 'react';
import { useTranslation } from "react-i18next";
import CustomHeader from '../../Components/CustomHeader';
import CustomFooter from '../../Components/CustomFooter';
import { Link, useNavigate } from 'react-router-dom';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import { useState } from 'react';
import { useEffect } from 'react';
import ToastMessage from '../../Utils/ToastMessage';
import Select from 'react-select';
import { getUserToken } from '../../helpers';
import { Cookies } from 'react-cookie';

function Signup() {
    const { t } = useTranslation();
	const [ngoList, setNgoList] = useState([]);
	const [checked1, setChecked1] = useState(true);
	const [checked2, setChecked2] = useState(false);
	const [checked3, setChecked3] = useState(false);
	const [checked4, setChecked4] = useState(false);
	const [membershipType, setMembershipType] = useState('member');
	const [selectedNgo, setSelectedNgo] = useState('');
	const [selectedNgo2, setSelectedNgo2] = useState([]);
	const navigate = useNavigate();
    let cookies = new Cookies();

	// const token = getUserToken();

	// console.log('tokkkkksignup__', token)

	useEffect(()=>{
        cookies.set("token", '');
	},[])

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
				setNgoList(resp.data);
				// console.log('select__', window.location?.href.split('?')[1]?.split('=')?.[1])
				if (
					window.location?.href.split('?')[1] &&
					window.location?.href.split('?')[1]?.split('=')?.[1]
				) {
					setSelectedNgo2(
						resp.data.filter(
							(item) =>
								item.referal_token ===
								window.location?.href.split('?')[1]?.split('=')?.[1]
						)
					);
				}
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
	return (
		<div>
			<CustomHeader external />
			<div className='main signup-column pt-5 main-login'>
				<div className='container pt-5 signup-column-left '>
					<div className='row'>
						<div className='col-md-6'>
							<div className='text-center pe-lg-4'>
								<img src='assets/img/Bag image.png' alt='shukDeals' />
							</div>
						</div>

						<div className='col-md-6 signup-column-right'>
							<div className='px-lg-5 pb-md-5'>
								<h1 className='text-gray1 fs-34 medium pb-3'>{t("Let’s Start")}</h1>
								<p className=' pb-3 m-0'>{t("Choose type of membership type")}</p>

								<form
									onSubmit={(e) => {
										if (!selectedNgo && membershipType != 'ngo') {
											ToastMessage.Error(t('Please select NGO'));
											e.preventDefault();
											return;
										}
										// if(membershipType=="business"){
										//     navigate("/choose-language-currency", {state : {ngo : selectedNgo}})
										// }
										else {
											localStorage.setItem('selectedNonProfit', selectedNgo?.id);
											localStorage.setItem('membershipType2', membershipType);
											navigate('/choose-language-currency', {
												state: { ngo: selectedNgo.id, memberShip: membershipType },
											});
											
											// console.log(membershipType);
											e.preventDefault();
										}
									}}
									action=''
									className='site-form pt-2'
								>
									<div className='row mb-4 membership-row'>
										<div className='col-lg-3 col-6 mb-2 d-flex '>
											<input
												type='radio'
												name='membership_type'
												id='member_1'
												className='d-none '
												defaultChecked={checked1}
											/>
											<label
												onClick={() => {
													setChecked1(true);
													setChecked2(false);
													setChecked3(false);
													setChecked4(false);
													setMembershipType('member');
												}}
												htmlFor='member_1'
												className='bg-white rounded-15 px-lg-3 py-lg-4 p-md-3 p-2 text-center  w-100 selectContainer'
											>
												<img src='assets/img/icon/usersquare.svg' height='30' alt='' />
												<p className='m-0 pt-3 fs-sm-12'>{t("Become a Club Member")}</p>
											</label>
										</div>

										<div className='col-lg-3 col-6 mb-2 d-flex'>
											<input
												type='radio'
												name='membership_type'
												id='member_2'
												className='d-none'
												defaultChecked={checked2}
											/>
											<label
												onClick={() => {
													setChecked1(false);
													setChecked2(true);
													setChecked3(false);
													setChecked4(false);
													setMembershipType('business');
												}}
												htmlFor='member_2'
												className='bg-white rounded-15 px-lg-3 py-lg-4 p-md-3 p-2 text-center  w-100 selectContainer'
											>
												<img src='assets/img/icon/bagtick2.svg' height='30' alt='' />
												<p className='m-0 pt-3 fs-sm-12'>{t("List your Business")}</p>
											</label>
										</div>

										<div className='col-lg-3 col-6 mb-2 d-flex'>
											<input
												type='radio'
												name='membership_type'
												id='member_3'
												className='d-none'
												defaultChecked={checked3}
											/>
											<label
												onClick={() => {
													setChecked1(false);
													setChecked2(false);
													setChecked3(true);
													setChecked4(false);
													setMembershipType('ngo');
												}}
												htmlFor='member_3'
												// className='bg-white rounded-15 px-lg-3 py-lg-4 p-md-3 p-2 text-center  w-100 selectContainer'
												className='bg-white rounded-15 px-lg-3 py-lg-4 p-md-3 p-2 text-center  w-100 selectContainer'
											>
												<img
													src='assets/img/icon/non-profit-organization 1.svg'
													height='30'
													alt=''
												/>
												<p className='m-0 pt-3 fs-sm-12 fs-13'>{t("Become an NGO Partner")}</p>
											</label>
										</div>

										<div className='col-lg-3 col-6 mb-2 d-flex '>
											<input
												type='radio'
												name='membership_type'
												id='member_4'
												className='d-none'
												defaultChecked={checked4}
											/>
											{/* <label
												onClick={() => {
													setChecked1(false);
													setChecked2(false);
													setChecked3(false);
													setChecked4(true);
													setMembershipType('news_agency');
												}}
												htmlFor='member_4'
												className='bg-white rounded-15 px-lg-2 py-lg-3 p-md-3 p-2 text-center w-100 fs-14 selectContainer'
											>
												<img src='assets/img/icon/microphone2.svg' height='30' alt='' />
												<p className='m-0 pt-3 fs-sm-12'>Start as a News Agency</p>
											</label> */}
										</div>
									</div>

									{membershipType != 'ngo' && (
										<div className='form-field mb-4 pb-2 '>
											{window.location?.href.split('?')[1] ? null : (
												<label for='' className='d-block pb-2'>
													{t("Choose Who To Support")}
												</label>
											)}

											<Select
												isDisabled={window.location?.href.split('?')[1] ? true : false}
												// styles={{
												//     menuList : ()
												// }}
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
														{/* <div style={{backgroundColor : 'gray', height :'0.5px', width : '100%', marginTop : '5px'}}/> */}
													</div>
												)}
											/>
											{/* </div> */}
										</div>
									)}

									<button className='button w-100 rounded-10'>{t("Continue")}</button>
								</form>

								<div className='text-center pt-4'>
									<p>{t("Already have an account? ")}{' '}
										<Link to={'/'} className='medium'>{t("Login")}
										</Link>
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<CustomFooter />
		</div>
	);
}

export default Signup;
