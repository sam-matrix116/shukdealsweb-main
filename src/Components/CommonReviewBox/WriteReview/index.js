import React, { useState } from 'react';
import { checkTokenRedirect } from '../../../helpers';
import StarRatingHandler from './StarRatingHandler';
import ToastMessage from '../../../Utils/ToastMessage';
import { FetchApi } from '../../../API/FetchApi';
import { Endpoints } from '../../../API/Endpoints';
import { ValidateList, ValidationTypes } from '../../../Utils/ValidationHelper';
import { useTranslation } from 'react-i18next';
import { onReviewProfileRefresh } from '../../../redux/data/actions';
import { connect } from 'react-redux';

function WriteReview({
	categoryType,
	passId,
	callingApi,
	onReviewProfileRefresh,
}) {
	const { t } = useTranslation();
	const [values, setValues] = useState();
	const callingApiUrl =
		categoryType === 'user'
			? Endpoints.getUserReviewListData
			: categoryType === 'deal'
			? Endpoints.getDealReviewListData
			: null;
	const totalStars = 5;
	const validationArr = () => {
		return [
			[values?.rating, ValidationTypes.Empty, t('Please select a rating')],
			[values?.comment, ValidationTypes.Empty, t('Please enter a comment')],
			[
				values?.comment?.length,
				ValidationTypes.NumberNotMoreThan,
				t('Please Write your review in less than 100 characters'),
				100,
			],
		];
	};

	const addReviewApi = async (url) => {
		if (!checkTokenRedirect()) {
			return;
		}
		let validate = await ValidateList(validationArr());
		if (!validate) {
			return;
		}

		let obj = new FormData();
		for (var key in values) {
			obj.append(key, values[key]);
		}
		obj.append(categoryType, passId);
		try {
			let resp = await FetchApi(url, obj);
			if (resp && resp.status) {
				ToastMessage.Success(resp.message);
				callingApi(callingApiUrl);
				onReviewProfileRefresh((prev) => !prev);
			}
		} catch (e) {
			if (e && e.response) {
				ToastMessage.Error(e.response.message);
			}
		}
	};

	const handleRatingChange = (newRating) => {
		setValues((values) => ({
			...values,
			rating: newRating,
		}));
	};

	const handleChange = (event) => {
		if (event.persist) event.persist();

		setValues((values) => ({
			...values,
			[event?.target?.name]: event?.target?.value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (categoryType === 'user') addReviewApi(Endpoints.addUserReview);
		else if (categoryType === 'deal') addReviewApi(Endpoints.addDealReview);
	};

	return (
		<div>
			<form onSubmit={handleSubmit} className='site-form review-form py-3'>
				<h3 className='fs-30 fs-sm-24 text-gray1 pb-3'>{t('Review & Ratings')}</h3>
				<label for='' className='pb-3'>
					{t('Leave Rating')}
				</label>
				<StarRatingHandler
					rating={values?.rating}
					totalStars={totalStars}
					onRatingChange={handleRatingChange}
					setValues={setValues}
				/>
				<div>
					<label for='' className='pb-2 d-block'>
						{t('Write your review')}
					</label>
					<textarea
						onChange={handleChange}
						name='comment'
						cols='10'
						rows='4'
						placeholder={t('Write a review in less than 100 characters')}
					></textarea>
				</div>
				<button
					type='submit'
					className='button submit-button rounded-10 py-2 mt-2 d-block'
				>
					{t('Submit')}
				</button>
			</form>
		</div>
	);
}

const mapDispatchToProps = (dispatch) => ({
	onReviewProfileRefresh: (item) => dispatch(onReviewProfileRefresh(item)),
});

export default connect(null, mapDispatchToProps)(WriteReview);
