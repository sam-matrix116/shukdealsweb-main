import { toast } from 'react-toastify';
import { css } from 'glamor';
import './toastMessage.css';

function Message({ type, text, options = {} }) {
	if (type === 'Success') {
		toast.success(text, {
			...options,
			className: 'toast-success-container toast-success-container-after',
			progressClassName: css({
				background: '#263cbd',
			}),
		});
	}
	if (type === 'Error') {
		toast.error(text, {
			...options,
			className: 'toast-error-container toast-error-container-after',
			progressClassName: css({
				background: '#EE0022',
			}),
		});
	}
	if (type === 'Info') {
		toast.info(text, {
			...options,
			className: 'toast-info-container toast-info-container-after',
			progressClassName: css({
				background: '#07F',
			}),
		});
	}
}

const ToastMessage = {
	Success: (text) => Message({ type: 'Success', text }),
	Error: (text) => Message({ type: 'Error', text }),
	Info: (text) => Message({ type: 'Info', text }),
};

export default ToastMessage;
