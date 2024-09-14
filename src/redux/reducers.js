import { combineReducers } from 'redux';
import Auth from './auth/reducers';
import Users from './users/reducers';
import RefreshData from './data/reducers';
export default combineReducers({
	Auth,
	Users,
	RefreshData,
});
