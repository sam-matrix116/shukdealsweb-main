/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslation } from "react-i18next";
import React, { useEffect } from 'react';
import CustomHeader from '../CustomHeader';
import CustomFooter from '../CustomFooter';
import CommonProfile from '../CommonProfile';
import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../Loader';
import { FetchApi } from '../../API/FetchApi';
import CreateJobsListing from './CreateJobsListing';
import CreateClassifiedsLisitng from './CreateClassifiedsLisitng';
import { Endpoints } from '../../API/Endpoints';
import CreateWeeklyDealListing from './CreateWeeklyDealListing';
import CreateDealsListing from './CreateDealsListing';
import CreateRealestateListing from './CreateRealestateListing';
import { getLoggedInUser } from '../../helpers';

function CommonCreateUpdateListing() {
    const { t } = useTranslation();
	const user = getLoggedInUser();
	const location2 = useLocation();
	const [isLoading, setIsLoading] = useState(false);
	const [radioData, setRadioData] = useState();
	const [subCategoryData, setSubCategoryData] = useState();
	const [subCategoryData2, setSubCategoryData2] = useState();
	const [locaitonList, setLocaitonList] = useState();
	const [propertyTypes, setPropertyTypes] = useState();
	const [classifiedCategory, setclassifiedCategory] = useState();
	const [values, setValues] = useState({});
	const [extistingData, setExtistingData] = useState({});
	const [searchParams] = useSearchParams();
	const params = Object.fromEntries([...searchParams]);

	// console.log('existing_', extistingData);
	// API Calling
	const getExtistingData = async (url) => {
		setIsLoading(true);
		try {
			let resp = await FetchApi(url);
			if (resp && resp.data) {
				setExtistingData(resp.data);
			}
			setIsLoading(false);
		} catch (e) {
			console.log('error', e);
			setIsLoading(false);
		}
	};

	const getSubCategoryData = async (categoryId, type) => {
		try {
			let resp = await FetchApi(Endpoints.getBusinessSubCategoryList + categoryId);
			if (resp && resp.data) {
				if (type === 'radio') setRadioData(resp.data);
				else if (type === 'subSelect') setSubCategoryData(resp.data);
				else if (type === 'subSelect2') setSubCategoryData2(resp.data);
			}
		} catch (e) {
			console.log('error', e);
		}
	};

	const getLocationList = async () => {
		setIsLoading(true);
		try {
			let resp = await FetchApi(Endpoints.getLocationList, null, null, {
				pagination_on: 1,
			});
			if (resp && resp.results) {
				setLocaitonList(resp.results);
			}
			setIsLoading(false);
		} catch (e) {
			console.log('error', e);
			setIsLoading(false);
		}
	};

	const getPropertyTypes = async () => {
		setIsLoading(true);
		try {
			let resp = await FetchApi(Endpoints.getPropertyTypes);
			if (resp && resp.data) {
				setPropertyTypes(resp.data);
			}
			setIsLoading(false);
		} catch (e) {
			console.log('error', e);
			setIsLoading(false);
		}
	};

	const getClassifiedCategory = async () => {
		setIsLoading(true);
		try {
			let resp = await FetchApi(Endpoints.getClassifiedCategory);
			if (resp && resp.data) {
				setclassifiedCategory(resp.data);
			}
			setIsLoading(false);
		} catch (e) {
			console.log('error', e);
			setIsLoading(false);
		}
	};

	// handle functions
	const handlePreview = async () => {};

	const handleRadio = (event, data) => {
		if (event.persist) event.persist();
		setValues((values) => ({
			...values,
			[event?.target?.name]: data,
		}));
	};

	const handleChange = (event, data) => {
		if (event.persist) event.persist();
		if (typeof data !== 'undefined') {
			setValues((values) => ({
				...values,
				[event]: data,
			}));
		} else {
			setValues((values) => ({
				...values,
				[event?.target?.name]: event?.target?.value,
			}));
		}
	};

	useEffect(() => {
		if (location2?.pathname === '/update-classified') {
			getExtistingData(Endpoints.getClassifiedDetails + params?.id);
		}
		if (location2?.pathname === '/update-listing-jobs') {
			getExtistingData(Endpoints.getJobDetail + params?.id);
		}
		if (
			location2?.pathname === '/update-listing-weekly' ||
			location2?.pathname === '/update-deal' ||
			location2?.pathname === '/update-listing-realestate'
		) {
			getExtistingData(Endpoints.getDealDetails + params?.id);
		}
		if (
			location2?.pathname === '/create-listing-realestate' ||
			location2?.pathname === '/update-listing-realestate' ||
			location2?.pathname === '/create-sport-deal' ||
			location2?.pathname === '/create-listing-restaurant' ||
			location2?.pathname === '/create-product-deal' ||
			location2?.pathname === '/create-travel-deal' ||
			location2?.pathname === '/create-service-deal' ||
			location2?.pathname === '/update-deal'
		) {
			if (user?.business_category == 5 || user?.business_category == 6) {
				getSubCategoryData(user?.business_category, 'radio');
			} else {
				getSubCategoryData(user?.business_category, 'subSelect');
			}
		}
		if (
			(location2?.pathname === '/create-sport-deal' ||
				location2?.pathname === '/create-product-deal' ||
				location2?.pathname === '/create-travel-deal' ||
				location2?.pathname === '/create-service-deal' ||
				location2?.pathname === '/update-deal') &&
			user?.business_category != 3
		) {
			getLocationList();
		}
		if (
			location2?.pathname === '/create-listing-realestate' ||
			location2?.pathname === '/update-listing-realestate'
		) {
			getPropertyTypes();
		}
		if (
			location2?.pathname === '/update-classified' ||
			location2?.pathname === '/create-classified'
		) {
			getClassifiedCategory();
		}
	}, []);

	return (
		<div>
			<CustomHeader />
			<CommonProfile />
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<div>
					{(location2?.pathname === '/create-listing-jobs' ||
						location2?.pathname === '/update-listing-jobs') && (
						<CreateJobsListing
							id={params?.id}
							handleChange={handleChange}
							extistingData={extistingData}
							values={values}
							setValues={setValues}
							isLoading={isLoading}
							setIsLoading={setIsLoading}
						/>
					)}
					{(location2?.pathname === '/update-classified' ||
						location2?.pathname === '/create-classified') && (
						<CreateClassifiedsLisitng
							id={params?.id}
							handleChange={handleChange}
							extistingData={extistingData}
							values={values}
							setValues={setValues}
							classifiedCategory={classifiedCategory}
							isLoading={isLoading}
							setIsLoading={setIsLoading}
						/>
					)}
					{(location2?.pathname === '/update-listing-weekly' ||
						location2?.pathname === '/create-weekly-deal') && (
						<CreateWeeklyDealListing
							id={params?.id}
							handleChange={handleChange}
							handleRadio={handleRadio}
							extistingData={extistingData}
							values={values}
							setValues={setValues}
							isLoading={isLoading}
							setIsLoading={setIsLoading}
						/>
					)}
					{(location2?.pathname === '/create-listing-realestate' ||
						location2?.pathname === '/update-listing-realestate') && (
						<CreateRealestateListing
							id={params?.id}
							handleChange={handleChange}
							handleRadio={handleRadio}
							extistingData={extistingData}
							values={values}
							setValues={setValues}
							isLoading={isLoading}
							setIsLoading={setIsLoading}
							propertyTypes={propertyTypes}
							// cateogry slection
							radioData={radioData}
							subCategoryData={subCategoryData}
							subCategoryData2={subCategoryData2}
							getSubCategoryData={getSubCategoryData}
						/>
					)}
					{(location2?.pathname === '/create-sport-deal' ||
						location2?.pathname === '/create-listing-restaurant' ||
						location2?.pathname === '/create-product-deal' ||
						location2?.pathname === '/create-travel-deal' ||
						location2?.pathname === '/create-service-deal' ||
						location2?.pathname === '/update-deal' ||
						location2?.pathname === '/create-ngo-deal') && (
						<CreateDealsListing
							id={params?.id}
							handleChange={handleChange}
							handleRadio={handleRadio}
							extistingData={extistingData}
							values={values}
							setValues={setValues}
							setIsLoading={setIsLoading}
							locaitonList={locaitonList}
							// cateogry slection
							radioData={radioData}
							subCategoryData={subCategoryData}
							subCategoryData2={subCategoryData2}
							getSubCategoryData={getSubCategoryData}
						/>
					)}
				</div>
			)}
			<CustomFooter internal />
		</div>
	);
}

export default CommonCreateUpdateListing;
