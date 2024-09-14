
import {
    CART_DATA, SET_CART_DATA, UPDATE_CART_DATA
} from '../../constants/actionTypes';

const INIT_STATE = {
    cartProducts: [],
};
const Users = (state = INIT_STATE, action) => {
    switch (action.type) {
        case CART_DATA:
            return { ...state };
        case SET_CART_DATA:
            return { ...state, cartProducts: action.payload };
        case UPDATE_CART_DATA:
            let products = state.cartProducts;
            products.push(action.payload);
            return { ...state, cartProducts: [...products] };
        default: return { ...state };
    }
}
export default Users;