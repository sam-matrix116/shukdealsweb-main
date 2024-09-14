import React from 'react'
import { useTranslation } from "react-i18next";
import CommonCreateUpdateListing from '../../Components/CommonCreateUpdateListing'

function CreateUpdateListing() {
    const { t } = useTranslation();
  return (
	<CommonCreateUpdateListing/>
  )
}

export default CreateUpdateListing