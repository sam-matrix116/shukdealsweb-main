// import ToastHelper from "Utils/ToastMessage";
import emojiRegex from 'emoji-regex';
import ToastMessage from '../ToastMessage';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

let emoji_reg_exp = emojiRegex();
// let types = "email" || "empty";
export const ValidationTypes = {
	Email: 'email',
	Empty: 'empty',
	Password: 'password',
	Url: 'url',
	UrlHttps: 'urlHttps',
	Mobile: 'mobile',
	Postal: 'postal',
	Number: 'number',
	Height: 'height',
	Weight: 'weight',
	BloodPressure: 'bloodpressure',
	HeartRate: 'heartrate',
	Age: 'age',
	SingleName: 'singlename',
	MultipleWord: 'multipleword',
	NumberNotNegative: 'numbernegative',
	NumberNotMoreThan: 'numbermorethan',
};
function validURL(str) {
	let pattern = new RegExp(
		'^(https?:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$',
		'i'
	); // fragment locator
	return !!pattern.test(str);
}

export const Validation = (type = ValidationTypes, value, value2) => {
	if (type == ValidationTypes.Email) {
		let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if (reg.test(value)) {
			return true;
		} else {
			return false;
		}
	}
	if (type == ValidationTypes.Empty) {
		if (
			value &&
			value.toString().trim().length &&
			!new RegExp(emoji_reg_exp).test(value.toString().trim())
		) {
			return true;
		}
		if (!value) {
			return false;
		}
		return false;
	}
	if (type == ValidationTypes.Password) {
		if (value.toString().trim().length < 8) {
			return false;
		} else {
			return true;
		}
	}
	if (type == ValidationTypes.Url) {
		return validURL(value);
	}

	if (type == ValidationTypes.Mobile) {
		return new RegExp('^[+]?[0-9]{10,20}$').test(value);
		// return new RegExp('^[+]?[6-9]{1}[0-9]{9}$').test(value);
		// return new RegExp('^\+{0,2}([\-\. ])?(\(?\d{0,3}\))?([\-\. ])?\(?\d{0,3}\)?([\-\. ])?\d{3}([\-\. ])?\d{4}').test(value);
	}
	if (type == ValidationTypes.Postal) {
		// console.log('typ',typeof(value))
		return new RegExp('^[1-9]{1}[0-9]{5}$').test(value);
	}
	if (type == ValidationTypes.BloodPressure) {
		// (^[1-9][0-9]{1,2}$)|
		return new RegExp(/(^[1-9][0-9]{1,2}\/[1-9][0-9]{1,2}$)/).test(value);
	}
	if (type == ValidationTypes.HeartRate) {
		// (^[1-9][0-9]{1,2}$)|
		return new RegExp(
			/(^[1-9][0-9]{1,2}$)|(^[1-9][0-9]{1,2}-[1-9][0-9]{1,2}$)/
		).test(value);
	}
	if (type == ValidationTypes.Weight) {
		return new RegExp(/^[1-9][0-9]{0,2}$/).test(value);
	}
	if (type == ValidationTypes.Height) {
		return new RegExp(/^[1-9][0-9]{1,2}$/).test(value);
	}
	if (type == ValidationTypes.Age) {
		return new RegExp(/^[0-9]{1,3}$/).test(value);
	}
	if (type == ValidationTypes.SingleName) {
		return new RegExp(/[A-Za-z]{2,10}$/).test(value.trim());
	}
	if (type == ValidationTypes.MultipleWord) {
		return true;
	}
	if (type == ValidationTypes.NumberNotNegative) {
		return !value ? true : value < 0 ? false : true;
	}
	if (type == ValidationTypes.NumberNotMoreThan) {
		return !value ? true : value > value2 ? false : true;
	}
};

export const ValidateList = async (list) => {
	let count = 0;
	for await (let item of list) {
		// console.log('vvv',item[1])
		if (item[1]) {
			if (!Validation(item[1], item[0], item[3])) {
				ToastMessage.Error(t(item[2]));
				// console.log('222',item)
				count++;
				break;
			}
		} else {
			// console.log('item[0]',item[0])
			if (!item[0]) {
				ToastMessage.Error(t(item[2]));
				count++;
				break;
			}
		}
	}
	if (count > 0) {
		return false;
	} else {
		return true;
	}
};
