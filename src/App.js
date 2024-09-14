import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import AppRoutes from './routes';
import { setLoadingData, loginUserSuccess, setCartData } from './redux/actions';
import Modals from './modals';
import { ModalProvider } from './context/modalContext';
import { SearchProvider } from './context/searchContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import i18next from 'i18next';
import { withTranslation } from 'react-i18next';
/**
 * Main app component
 */
class App extends Component {
	/**
	 * Returns the layout component based on different properties
	 * @param {*} props
	 */
	constructor(props) {
		super(props);
		this.props.loginUserSuccess(props.userData);
		this.state = {
			lang: props.i18n.language,
		};
		// const { t, i18n } = useTranslation();
		// document.body.dir = i18next.dir();
	}

	componentDidMount() {
		// const { i18n } = this.props;
		const { i18n } = this.props;
		const currentLanguage = i18n.language;
		const isRTL = currentLanguage === 'ar' || currentLanguage === 'he'; // Adjust for your specific RTL language code

		document.body.dir = isRTL ? 'rtl' : 'ltr';
		// document.body.dir = i18n.dir();

		// console.log('ii118__', currentLanguage)
	}

	componentDidUpdate(prevProps) {
		if (prevProps.i18n.language != this.state.lang) {
			this.setState({ lang: prevProps.i18n.language });
			window.location.reload();
		}
	}

	render() {
		return (
			// rendering the router with layout
			<>
				<ToastContainer
					position='top-right'
					autoClose={4000}
					hideProgressBar={false}
					newestOnTop
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme='colored'
				/>
				<ModalProvider>
					<SearchProvider>
						<BrowserRouter>
							<Modals />
							<AppRoutes />
						</BrowserRouter>
					</SearchProvider>
				</ModalProvider>
			</>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.Auth.isAuthenticated,
		isLoading: state.Auth.isLoading,
	};
};

export default connect(mapStateToProps, {
	setLoadingData,
	loginUserSuccess,
	setCartData,
})(withTranslation()(App));
