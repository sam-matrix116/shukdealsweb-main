import { REVIEW_PROFILE_REFRESH } from '../../constants/actionTypes';

const INIT_STATE = {
	isRefresh: false,
};
const RefreshData = (state = INIT_STATE, action) => {

	switch (action.type) {
		case REVIEW_PROFILE_REFRESH:
			return { ...state, isRefresh: action.payload };
		default:
			return { ...state };
	}
};
export default RefreshData;
