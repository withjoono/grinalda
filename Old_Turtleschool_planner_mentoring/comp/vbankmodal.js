import React, { useState, useEffect } from "react";
import Dialog from './dialog'
import Link from 'next/link'

const BankModal = (props) => {
    const {open, handleClose, stat} = props;
	const content = (
		<>
		<p>가격 : {stat.amount}</p>
		<p>회사 : {stat.vbank_holder}</p>
		<p>은행 : {stat.vbank_name}</p>
		<p>계좌번호 : {stat.vbank_num}</p>
		</>
	);
	const buttons = [{content:'확인',color:'#fede01'}];
	
    return(
		<Dialog title="가상계좌 발급 완료" content={content} buttons={buttons} open={open} handleClose={handleClose} />
    );
}

export default BankModal;