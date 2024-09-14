import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import moment from 'moment';
import DatePickerPopup from '../CommonUiComponents/DatePickerPopup';

function FavouriteListingHeader({ listingType, filters, setFilters }) {
	const { t } = useTranslation();
	const [searchInput, setSearchInput] = useState('');
	const [isSearchActive, setIsSearchActive] = useState(false);
	const [selectionRange, setSelectionRange] = useState({
		startDate: new Date(),
		endDate: null,
		key: 'selection',
	});
	// console.log('ree__', listingType);
	const handleChange = (event, data) => {
		setIsSearchActive(false);
		if (event.persist) event.persist();

		if (typeof data !== 'undefined') {
			if (event === 'search_key') {
				setSearchInput(data);
				if (data === '') {
					setFilters((values) => ({
						...values,
						search_key: '',
					}));
				}
			} else {
				setFilters((values) => ({
					...values,
					[event]: data,
				}));
			}
		} else {
			setFilters((values) => ({
				...values,
				[event?.target?.name]: event?.target?.value,
			}));
		}
	};
	const handleSubmit = (e) => {
		if (isSearchActive) {
			setSearchInput('');
			setFilters((values) => ({
				...values,
				search_key: '',
			}));
			setIsSearchActive(false);
		} else {
			setIsSearchActive(true);
			setFilters((values) => ({
				...values,
				search_key: searchInput,
			}));
		}
		e.preventDefault();
	};

	useEffect(() => {
		if (
			selectionRange?.startDate &&
			selectionRange?.endDate &&
			selectionRange?.startDate !== selectionRange?.endDate
		)
			setFilters((values) => ({
				...values,
				start_date: moment(selectionRange?.startDate).format('YYYY-MM-DD'),
				end_date: moment(selectionRange?.endDate).format('YYYY-MM-DD'),
			}));
	}, [selectionRange]);
	return (
		<div>
			<div className='d-lg-flex align-items-center justify-content-between pb-5'>
				<div
					className={'col-lg-5 col-10 d-flex align-items-center gap-2 pb-lg-0 pb-2'}
				>
					<h1 className='fs-30 regular fs-sm-18 pb-md-0'>
						{' '}
						{listingType === 'listing'
							? t('Your Favorites')
							: listingType === 'my-redeemed'
							? t('Your Redeemed Deals')
							: t('Your Favorites')}
					</h1>
				</div>

				<div className='col-lg-7 d-md-flex align-items-center gap-2 justify-content-lg-end'>
					{['my-redeemed'].includes(listingType) && (
						<DatePickerPopup
							selectionRange={selectionRange}
							setSelectionRange={setSelectionRange}
						/>
					)}
					<form
						onSubmit={handleSubmit}
						className='site-search border rounded-10 d-flex align-items-center'
					>
						<input
							type='text'
							value={searchInput}
							onChange={(e) => handleChange('search_key', e.target.value)}
							placeholder={
								listingType === 'my-locations'
									? t('Search Location ')
									: listingType === "my-redeemed"? t("Search Deals")
									: t('Search in your favorites')
							}
							className='border-0 px-3 '
						/>
						<button type='submit' className='button py-2 px-4'>
							{isSearchActive ? (
								<i class='fa fa-times' aria-hidden='true' />
							) : (
								<i className='fa-regular fa-magnifying-glass ' />
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default FavouriteListingHeader;
