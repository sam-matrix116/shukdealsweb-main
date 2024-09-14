import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import DeleteAccount from './AccountComponents/DeleteAccount';
import { breakpoints } from '../../helpers/displayViewHelper';

function AccountSettings() {
    const { t } = useTranslation();
	const [selectedOption, setSelectedOption] = useState('delete_account');

	const handleOptionClick = (option) => {
		setSelectedOption(option);
	};
	const options = [{ id: 'delete_account', label: t('Delete Account') }];

	return (
		<div className='container row my-3 ' style={{ height: '50vh' }}>
			<div className={`col-md-3  `}>
				<ul className='list-group'>
					{options.map((option) => (
						<li
							key={option.id}
							className={`list-group-item selectContainer `}
							style={{
								backgroundColor: selectedOption === option.id ? '#3B618B ' : '',
								color: selectedOption === option.id ? '#FFFFFF ' : '',
							}}
							onClick={() => handleOptionClick(option.id)}
						>
							{option.label}
						</li>
					))}
				</ul>
			</div>
			<div className='col-md-9 shadow rounded-10'>
				{selectedOption === 'delete_account' ? <DeleteAccount /> : null}
			</div>
		</div>
	);
}

export default AccountSettings;
