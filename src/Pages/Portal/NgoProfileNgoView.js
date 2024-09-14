import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CustomHeader from '../../Components/CustomHeader';
import CustomFooter from '../../Components/CustomFooter';
import CommonProfile from '../../Components/CommonProfile';
import { useState } from 'react';
import { getLoggedInUser } from '../../helpers/authUtils';
import { Link, useSearchParams } from 'react-router-dom';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import {
	CommonClassifiedRow,
	CommonDealsRow,
	CommonOfferRow,
	CommonTopBusinessRow,
} from '../../Components/sliders';
import RatingReviewBox from '../../Components/CommonReviewBox/RatingReviewBox';
import ToastMessage from '../../Utils/ToastMessage';
import LoadingSpinner from '../../Components/Loader';
import { YoutubeUrlVedioIdHelper } from '../../helpers';
import CommonReviewBox from '../../Components/CommonReviewBox';
import CommonAddBtn from '../../Components/CommonAddBtn';

function NgoProfileNgoView() {
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();
	const params = Object.fromEntries([...searchParams]);
	const [isLoading, setIsLoading] = useState(false);
	const [videoData, setVideoData] = useState([]);
	// const [videoId, setVideoId] = useState();
	// const [videoTitle, setVideoTitle] = useState();
	const [selectedVideo, setSelectedVideo] = useState();
	const [dataCount, setDataCount] = useState();
	const user = getLoggedInUser();

	const getNgoVideos = async () => {
		try {
			setIsLoading(true);
			let resp = await FetchApi(Endpoints.getNgoVideos);
			if (resp && resp.data) {
				setVideoData(resp.data);
				setSelectedVideo(
					params?.videoId
						? resp?.data?.find((item) => item?.id == params?.videoId)
						: resp?.data?.[0]
				);
				// setVideoId(resp?.data?.[0]?.link?.split('youtu.be/')?.[1]);
				// setVideoId(YoutubeUrlVedioIdHelper(resp?.data?.[0]?.link));
				// setVideoTitle(resp?.data?.[0]?.title);
			}
			setIsLoading(false);
		} catch (e) {
			setIsLoading(false);
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	useEffect(() => {
		getNgoVideos();
		window.scroll(0, 0);
	}, []);
	console.log({ selectedVideo });

	return (
		<div>
			<CustomHeader />
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<div className='main'>
						<CommonProfile />

						<div className='container'>
							<div className='py-4 border-bottom border-top'>
								<h1 className='fs-30 text-gray1 pb-2 fs-sm-22'>
									{t('About')} {user?.firstname || user?.name}
								</h1>
								<p className='light mb-0 text-justify text-gray2'>{user?.about}</p>
							</div>

							{videoData?.length ? (
								<div className='py-3 border-bottom'>
									<div className='d-flex align-items-center gap-2 pb-3'>
										<h2 className='fs-30 text-gray1 fs-sm-22'>{t('Videos')}</h2>
										<Link to={'/add-video'} className='button py-2 d-flex gap-2 align-items-center'>
											<i className='fa-light fa-circle-plus fs-20'></i>
											{t('Add Videos Link')}
										</Link>
									</div>

									<div className='row pe-lg-5 me-lg-4'>
										<div className='col-md-7 pb-md-0 pb-3'>
											<div className='video-section'>
												<div className='video-item position-relative'>
													<iframe
														height={'350px'}
														className='w-100'
														src={`https://www.youtube-nocookie.com/embed/${YoutubeUrlVedioIdHelper(
															selectedVideo?.link
														)}?autoplay=0&mute=1`}
														title='YouTube video player'
														frameborder='0'
														allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope'
														allowfullscreen
													></iframe>
												</div>
											</div>
											<div className='d-lg-flex justify-content-between align-items-center pt-3'>
												<h3 className='fs-18 fs-sm-14 text-gray1 pb-lg-0 pb-2'>
													{selectedVideo?.title}
												</h3>
											</div>
										</div>
										<div className='col-md-5 video-list'>
											<div>
												{videoData?.map((item, index) => {
													return (
														<div
															onClick={(e) => {
																e.preventDefault();
																setSelectedVideo(item);
																// // setVideoId(item?.link?.split('=').pop().split('_')[0]);
																// setVideoId(YoutubeUrlVedioIdHelper(item?.link));
																// setVideoTitle(item?.title);
															}}
															className='d-flex gap-2 align-items-center pb-2'
														>
															<div className='position-relative'>
																<img
																	alt=''
																	src={`https://img.youtube.com/vi/${YoutubeUrlVedioIdHelper(
																		item?.link
																	)}/mqdefault.jpg`}
																/>
															</div>
															<div>
																<h6 className='fs-14 text-gray1 pb-2'>{item?.title}</h6>
															</div>
														</div>
													);
												})}
											</div>
										</div>
									</div>
								</div>
							) : (
								<div className='d-flex align-items-center gap-2 py-5 border-bottom'>
									<h2 className='fs-30 text-gray1 fs-sm-22'>{t("No")} {t("Videos")} </h2>
									<Link to={'/add-video'} className='button py-2'>
										<i className='fa-light fa-circle-plus fs-20'></i>
										{t('Add Videos Link')}
									</Link>
								</div>
							)}

							<div className='py-4'>
								{dataCount ? (
									<div className='d-flex justify-content-between border-bottom align-items-center mb-3'>
										<ul className='ngo-list d-flex  fs-26 fs-sm-12 text-gray2 gap-5'>
											<li>
												<a href='#' className='active'>
													{t("NGO Listing")}
												</a>
											</li>
											{/* <li>
											<a href='#'>NGO Jobs</a>
										</li> */}
										</ul>
										<div className='d-lg-flex align-items-center gap-2'>
										<Link to={'/create-ngo-deal'} className='button py-2'>
											<i className='fa-light fa-plus-circle me-2 fs-20 align-middle'></i>
											{t('Add Listing')}
										</Link>
										
										<div className='mt-lg-2'>
										<CommonAddBtn 
										removeTitle={true} 
										// profileData={profileData} 
										categoryType={'weekly_deal'} 
										/>
										</div>
										</div>
									</div>
								) : null}
								<CommonDealsRow
									givenUrl={Endpoints.getUserDeal + user?.id}
									detailViewLink={'/deal-details'}
									paginationSize={8}
									activatePagination={true}
									removeTitle={true}
									setDataRetriveCount={setDataCount}
									viewAllLink={'/deal-listing'}
								/>
							</div>

							<div className='pb-4'>
								<CommonOfferRow 
								headTitle={'Weekly Listing'}
								givenUrl={Endpoints.myWeeklyDealsList}
								paginationSize={8} 
								addDealBtn={true} 
								// profileData={profileData}
								/>
							</div>

							{user?.id ? (
								<div className='pb-4'>
									<CommonClassifiedRow
										headSize={false}
										headTitle={'NGO’s Members classifieds'}
										paginationSize={4}
										classifiedType={'others'}
										params={{ ngo: user?.id }}
									/>
								</div>
							) : null}

							<div className='pb-4'>
								<CommonOfferRow
									paginationSize={4}
									params={`?ngo=${user?.id}`}
									headTitle={'NGO’s Business Weekly Offers'}
								/>
							</div>

							<div className='pb-3'>
								<CommonTopBusinessRow
									givenUrl={Endpoints.topStoreBusinessProfile}
									paginationSize={4}
									categoryType='ngo'
									params={{ ngo: user?.id }}
									headTitle={'NGO’s Business Store'}
								/>
							</div>

							<div className='pb-3'>
								<CommonDealsRow
									givenUrl={Endpoints.searchBusinessDeals + `?ngo=${user?.id}`}
									detailViewLink={'/deal-details'}
									headTitle={'NGO’s Business Listing'}
									paginationSize={4}
								/>
							</div>

							<CommonReviewBox
								categoryType={'user'}
								passId={user?.id}
								removeWriteReviewBox={true}
							/>
						</div>
					</div>

					{/* </div> */}
					<CustomFooter internal />
				</>
			)}
		</div>
	);
}

export default NgoProfileNgoView;
