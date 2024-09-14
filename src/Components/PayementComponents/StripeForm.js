import React from 'react';
import { useTranslation } from "react-i18next";
import ToastMessage from '../../Utils/ToastMessage';
import {
	useElements,
	useStripe,
	AddressElement,
} from '@stripe/react-stripe-js';
import { Endpoints } from '../../API/Endpoints';
import { PaymentElement } from '@stripe/react-stripe-js';

function StripeForm({ options, isLoading }) {
    const { t } = useTranslation();
	const stripe = useStripe();
	const elements = useElements();
	// const [options, setOptions] = useState();
	// const [isLoading, setIsLoading] = useState();
	// const options = {
	// 	// passing the client secret obtained from the server
	// 	clientSecret: location?.state?.clientSecret,
	// 	// clientSecret: "pi_1NNzeCLQAYB7O7UfxIC90Xa3_secret_3Rw2J7wRPZsOVXmvobi2qYnXw",
	// };
	const paymentElementOptions = {
		layout: 'tabs',
		// mode: 'shipping'
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		const result = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: Endpoints.paymentBaseUrl + 'payment_success',
			},
		});

		if (result.error) {
			ToastMessage.Error(result?.error?.message);
		} else {
		}
	};

	// console.log('options', options);
	return (
		<>
			<form onSubmit={handleSubmit}>
				<h3 className='mb-4'>{t("Shipping address")}</h3>
				<AddressElement
					options={{ mode: 'shipping' }}

					// Access the address like so:
					// onChange={(event) => {
					//   setAddressState(event.value);
					// }}
				/>
				<h3 className='mb-4 mt-4'>{t("Payment")}</h3>
				<PaymentElement options={paymentElementOptions} />
				<button className='mb-4 mt-4 button w-100 rounded-10' disabled={!stripe}>{t("Submit")}
				</button>
			</form>
		</>
	);
}

export default StripeForm;
