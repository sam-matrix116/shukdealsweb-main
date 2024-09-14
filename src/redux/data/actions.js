import { REVIEW_PROFILE_REFRESH } from '../../constants/actionTypes';

export const onReviewProfileRefresh = (data) => {
	return { type: REVIEW_PROFILE_REFRESH, payload: data };
};
