import React from 'react'
import { useTranslation } from "react-i18next";
import NgoReferal from './NgoReferal.js'

function CommonReferals({referalType}) {
    const { t } = useTranslation();
  return (
    <>
        {
            referalType === 'referal-ngo' &&
                <NgoReferal/>
        }
    </>
  )
}

export default CommonReferals