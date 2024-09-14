import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import UpdateNgoModal from '../modals/UpdateNgoModal';

function UpdateNgo({ngo, setCallApi}) {
    const { t } = useTranslation();
	const [modalVisible, setModalVisible] = useState(false);
   
	return (
		<>
        <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '10px'
        }} className=' pt-md-0 pt-2'>
            <button
            onClick={()=>{
                setModalVisible(true);
            }}
                className='button primary-btn mt-lg-0 mt-2 fs-12'
                style={{
                    // maxWidth: '190px',
                }}
            >
                {/* <img src='assets/img/icon/export.svg' /> */}
                {t("Update NGO")}
            </button>
        </div>

        <UpdateNgoModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        ngo={ngo}
        setApiCall={setCallApi}
        />
		</>
	);
}

export default UpdateNgo;
