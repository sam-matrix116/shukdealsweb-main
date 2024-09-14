import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { PasswordChange } from './SecurityComponents/';

function SecuritySettings() {
    const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState();
	const [selectedOption, setSelectedOption] = useState('change_password');

	const handleOptionClick = (option) => {
		setSelectedOption(option);
	};
	const options = [{ id: 'change_password', label: 'Change Password' }];

	return (
		<div className='container row my-3' style={{ height: '50vh' }}>
			<div className='col-md-3 '>
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
							{t(option.label)}
						</li>
					))}
				</ul>
			</div>
			<div className='col-md-9 shadow rounded-10'>
				{selectedOption === 'change_password' ? (
					<PasswordChange selectedOption={selectedOption} />
				) : null}
			</div>
		</div>
	);
}

export default SecuritySettings;
