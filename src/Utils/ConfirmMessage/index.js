import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';

async function ConfirmMessage(text, title = 'Are you sure?', type = 'warning') {
	// const {t} = useTranslation();
	const confirm = await Swal.fire({
		title: t(title),
		text: t(text),
		icon: type,
		showConfirmButton: true,
		showCancelButton: true,
		confirmButtonColor: '#3B618B',
		confirmButtonText: t('Yes!'),
		cancelButtonText: t("Cancel")
	});
	return confirm;
}

export default ConfirmMessage;
