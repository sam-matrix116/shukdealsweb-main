import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';
import moment from 'moment';

function DatePickerPopup({ selectionRange, setSelectionRange }) {
    const { t } = useTranslation();
	const [showDatePicker, setShowDatePicker] = useState(false);
	const datepickerRef = useRef(null);

	const toggleDatePicker = () => {
		setShowDatePicker(!showDatePicker);
	};

	const handleDateChange = (ranges) => {
		setSelectionRange(ranges.selection);

		// Check if both startDate and endDate are selected, then close the date picker
		if (
			ranges.selection.startDate &&
			ranges.selection.endDate &&
			ranges.selection.startDate !== ranges.selection.endDate
		) {
			setShowDatePicker(false);
		}
	};

	const handleDocumentClick = (event) => {
		// Check if the click occurred outside the date picker
		if (datepickerRef.current && !datepickerRef.current.contains(event.target)) {
			setShowDatePicker(false);
		}
	};

	useEffect(() => {
		// Add a click event listener to the document when the date picker is shown
		if (showDatePicker) {
			document.addEventListener('mousedown', handleDocumentClick);
		} else {
			document.removeEventListener('mousedown', handleDocumentClick);
		}

		// Clean up the event listener when the component unmounts
		return () => {
			document.removeEventListener('mousedown', handleDocumentClick);
		};
	}, [showDatePicker]);

	return (
		<div className='border p-2 rounded-10 d-flex filter-design-1 mb-md-0 mb-2 align-items-center'>
			<img
				src='assets/img/icon/calendar.svg'
				className='me-2'
				alt='shukDeals'
			/>

			<div className='custom-date' ref={datepickerRef}>
				<input
					type='text'
					value={
						selectionRange?.startDate && selectionRange?.endDate
							? `${moment(selectionRange?.startDate).format('DD/MM/YY')} - ${moment(
									selectionRange?.endDate
							  ).format('DD/MM/YY')}`
							: t('Choose date') + ":"
					}
					placeholder={t('Choose date')}
					onClick={toggleDatePicker}
					className='border-0'
				/>
				{showDatePicker && (
					<div
						className='date-picker-popup shadow'
						style={{
							position: 'absolute',
							zIndex: '100',
						}}
					>
						<DateRange
							editableDateInputs={true}
							onChange={handleDateChange}
							moveRangeOnFirstSelection={false}
							ranges={[selectionRange]}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default DatePickerPopup;
