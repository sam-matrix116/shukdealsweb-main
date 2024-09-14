import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomHeader from '../../Components/CustomHeader';
import CustomFooter from '../../Components/CustomFooter';
import OthersProfile from '../../Components/OthersProfile';
import {
	Link,
	useNavigate,
	useSearchParams,
	useLocation,
} from 'react-router-dom';
import {
	CommonClassifiedRow,
	CommonDealsRow,
	CommonOfferRow,
	CommonTopBusinessRow,
} from '../../Components/sliders';
import { useEffect } from 'react';
import { FetchApi } from '../../API/FetchApi';
import { Endpoints } from '../../API/Endpoints';
import CommonReviewBox from '../../Components/CommonReviewBox';
import LoadingSpinner from '../../Components/Loader';
import ToastMessage from '../../Utils/ToastMessage';
import {
	YoutubeUrlVedioIdHelper,
	getLocationData,
	getLoggedInUser,
} from '../../helpers';

function NgoProfileOtherView() {
	const [searchParams] = useSearchParams();
	const params = Object.fromEntries([...searchParams]);
	const navigate = useNavigate();
	const { t } = useTranslation();
	const user = getLoggedInUser();
	const [isLoading, setIsLoading] = useState(false);
	const [ngoData, setNgoData] = useState({});
	const [videoLinkId, setVideoLinkId] = useState();
	const [videoTitle, setVideoTitle] = useState();
	const [selectedVideo, setSelectedVideo] = useState();
	const [dataCount, setDataCount] = useState();

	const getOtherProfile = async () => {
		try {
			setIsLoading(true);
			let resp = await FetchApi(Endpoints.getOtherUserProfile + params?.id);
			if (resp && resp.status) {
				setNgoData(resp.data);
				setSelectedVideo(
					params?.videoId
						? resp?.data?.ngo_videos?.find((item) => item?.id == params?.videoId)
						: resp?.data?.ngo_videos?.[0]
				);
				// setVideoLinkId(resp.ngo_videos?.[0]?.link?.split('=')?.[1]);
				// setVideoLinkId(YoutubeUrlVedioIdHelper(resp?.data?.ngo_videos?.[0]?.link));
				// setVideoTitle(resp.ngo_videos?.[0]?.title);
			}
			setIsLoading(false);
		} catch (e) {
			setIsLoading(false);
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	const ngoVideoLike = async () => {
		try {
			let resp = await FetchApi(Endpoints.likeNgoVideos + selectedVideo?.id);
			if (resp && resp.status) {
				ToastMessage.Success(resp.message);
			}
		} catch (e) {
			if (e && e.response && e.response.data && e.response.data.message) {
				ToastMessage.Error(e.response.data.message);
			}
		}
	};

	const handleVideoLike = (e) => {
		e.preventDefault();
		ngoVideoLike();
		// let res = ngoData?.ngo_videos?.map(
		// 	(item) =>
		// 		item.id == selectedVideo.id && {
		// 			...item,
		// 			is_liked: !selectedVideo.is_liked,
		// 		}
		// );
		// setNgoData((prev) => ({ ...prev, ngo_videos: res }));
		getOtherProfile();
	};

	useEffect(() => {
		if (params?.id &&params?.id == user?.id) {
			navigate({
				pathname: '/ngo-profile-ngo-view',
			});
		} else getOtherProfile();
	}, []);

	return (
		<div>
			<CustomHeader />
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<div className='main'>
						<OthersProfile about={true} id={params?.id} user={'ngo'} />

						<div className='container'>
							{ngoData?.ngo_videos?.length ? (
								<div className='py-3 border-bottom'>
									<div className='d-flex align-items-center gap-2 pb-3'>
										<h2 className='fs-30 text-gray1 fs-sm-22'>{t('Videos')}</h2>
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
												<Link
													onClick={handleVideoLike}
													className='button py-2 d-flex justify-content-center gap-2'
												>
													{selectedVideo?.is_liked ? (
														<>
															<img alt='' src='assets/img/icon/wish_added.svg' width='18' />
															<span>{t('Liked Video')}</span>
														</>
													) : (
														<>
															<img alt='' src='assets/img/icon/heart2.svg' width='18' />
															<span>{t('Like Video')}</span>
														</>
													)}
												</Link>
											</div>
										</div>
										<div className='col-md-5 video-list'>
											<div>
												{ngoData?.ngo_videos?.map((item, index) => {
													return (
														<div
															onClick={(e) => {
																e.preventDefault();
																setSelectedVideo(item);
																// setVideoLinkId(item?.link?.split('=').pop().split('_')[0]);
																// setVideoLinkId(YoutubeUrlVedioIdHelper(item?.link));
																// setVideoTitle(item?.title);
															}}
															className='d-flex gap-2 align-items-center pb-2 selectContainers'
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
							) : null}

							{ngoData?.id ? (
								<div className='py-4'>
									{dataCount ? (
										<div className='d-flex justify-content-between border-bottom align-items-center mb-3'>
											<ul className='ngo-list d-flex  fs-26 fs-sm-12 text-gray2 gap-5'>
												<li>
													<a href='#' className='active'>
														{t('NGO Listing')}
													</a>
												</li>
												{/* <li>
											<a href='#'>NGO Jobs</a>
										</li> */}
											</ul>
										</div>
									) : null}
									<CommonDealsRow
										givenUrl={Endpoints.getUserDeal + ngoData?.id}
										detailViewLink={'/deal-details'}
										paginationSize={8}
										activatePagination={true}
										removeTitle={true}
										setDataRetriveCount={setDataCount}
									/>
								</div>
							) : null}

							{ngoData?.id ? (
								<div className='py-4'>
									<CommonClassifiedRow
										headSize={false}
										headTitle={'NGO’s Members classifieds'}
										viewAllBtn={true}
										viewAllLink={'/Extra-category-listing-classified'}
										viewAllLinkState={{
											params: { ngo: ngoData?.id },
											headTitle: 'NGO’s Members classifieds',
										}}
										paginationSize={4}
										classifiedType={'others'}
										params={{ ngo: ngoData?.id }}
									/>
								</div>
							) : null}

							{ngoData?.id ? (
								<div className='pb-4'>
									<CommonOfferRow
										paginationSize={4}
										viewAllBtn={true}
										viewAllLink={'/Extra-category-listing-weekly'}
										viewAllLinkState={{
											params: `?ngo=${ngoData?.id}`,
											headTitle: 'NGO’s Business Weekly Offers',
										}}
										params={`?ngo=${ngoData?.id}`}
										headTitle={'NGO’s Business Weekly Offers'}
									/>
								</div>
							) : null}

							{ngoData?.id ? (
								<div className='pb-3'>
									<CommonTopBusinessRow
										givenUrl={Endpoints.topStoreBusinessProfile}
										viewAllLink={'/category-listing-top-business'}
										viewAllLinkState={{
											params: { ngo: ngoData?.id },
											headTitle: 'NGO’s Business Store',
										}}
										paginationSize={4}
										categoryType='ngo'
										headTitle={'NGO’s Business Store'}
										params={{ ngo: ngoData?.id }}
									/>
								</div>
							) : null}
							{ngoData?.id ? (
								<div className='pb-3'>
									<CommonDealsRow
										givenUrl={Endpoints.searchBusinessDeals + `?ngo=${ngoData?.id}`}
										viewAllLink={'/Extra-category-listing-deal'}
										viewAllLinkState={{
											givenUrl: Endpoints.searchBusinessDeals + `?ngo=${ngoData?.id}`,
											headTitle: 'NGO’s Business Listing',
										}}
										detailViewLink={'/deal-details'}
										headTitle={'NGO’s Business Listing'}
										paginationSize={4}
									/>
								</div>
							) : null}
							<CommonReviewBox categoryType={'user'} passId={params.id} />
						</div>
					</div>

					<CustomFooter internal />
				</>
			)}
		</div>
	);
}

export default NgoProfileOtherView;
