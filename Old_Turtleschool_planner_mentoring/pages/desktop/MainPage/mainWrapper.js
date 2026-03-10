import SliderMenu from './SliderMenu/SliderMenu';
import QuickMenu from './QickMenu/QuickMenu';
import AppBorder from './AppBorder/AppBorderWrapper';
import MentorWrapper from './Mentor/MentorWrapper';
import InforWrapper from './InforBorder/InforWrapper';
import VideoWrapper from './InforBorder/VideoForm/VideoWrapper';
import CsWrapper from './CsForm/CsWrapper';
import WinterProgram from './WinterProgram/WinterProgram';

import styled from 'styled-components';

const home = (props) => {
    //이용중이 서비스 이미지
    // const idToImage = {
    //     1: '/assets/home_icon/icon-28-planner-unactive.png', //수시 이미지 링크
    //     2: '/assets/home_icon/icon-28-planner-unactive.png', //플래너
    //     8: '/assets/home_icon/icon-28-rcpa-unactive.png', //정시
    //     3: '/assets/home_icon/icon-28-', //생기부
    // }
    //플레너 불러오는 부분

    //이용중인 서비스 불러오기
    // useEffect(() => {
    //     axios
    //         .get('/api/pay/payment', {
    //             headers: {
    //                 auth: localStorage.getItem('uid'),
    //             },
    //         })
    //         .then((res) => setPayment(res.data.data));
    // }, []);

    const Wrap = styled.div`
        background-color: #ffffff;
        width: 100%;
    `;
    return (
        <Wrap>
            {/*슬라이더 로그인페이지-----------------------------------------------------*/}
            <SliderMenu />

            {/*퀵메뉴-----------------------------------------------------*/}
            <QuickMenu />

            {/*어플홍보-----------------------------------------------------*/}
            <AppBorder />

            {/*설명-----------------------------------------------------*/}
            <InforWrapper />

            <WinterProgram />
            {/*멘토 리스트-----------------------------------------------------*/}
            <MentorWrapper />
            {/*유튜브---------------------------------------------------*/}
            {/* <VideoWrapper/> */}

            {/*cs*/}
            <CsWrapper />
        </Wrap>
    );
};

export default home;

/*{acc.length ? <div className="tl">연계 계정</div> : null}
		{acc.length ? <div className="co">
			<div className={s == localStorage.getItem('realuid') ? 'card br' : 'card'}
				onClick={() => {
					localStorage.setItem('uid',localStorage.getItem('realuid'))
					setS(localStorage.getItem('realuid'))
				}}>
			<p>본인 계정</p>
			</div>
			{acc.map(e =>
				<div className={s == e.account ? 'card br' : 'card'}
					onClick={() => {
						localStorage.setItem('uid',e.account);
						sessionStorage.setItem('name',e.user_name);
						setS(e.account)}}>
					<p>{e.user_name}</p>
					<p>{a[e.gradeCode]}</p>
					<p>{e.school}</p>
					<p>{e.hagwon}</p>
				</div>)
			}
			</div> : null
		}*/
