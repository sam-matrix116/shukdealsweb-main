import { SET_CART_DATA, UPDATE_CART_DATA } from '../../constants/actionTypes';
export const setCartData = (products) => ({
    type: SET_CART_DATA,
    payload: products
});
export const updateCartData = (products) => ({
    type: UPDATE_CART_DATA,
    payload: products
});