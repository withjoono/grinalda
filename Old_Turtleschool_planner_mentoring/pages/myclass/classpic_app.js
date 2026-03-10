import Link from 'next/link'

const Main = () => {
	return (
    <div className="wrap">
	<style jsx>{`
        * {
            margin: 0px;
            padding: 0px;
            font-family: "Noto Sans CJK KR";
        }

        li {
            list-style: none;
        }

        a {
            text-decoration: none;
        }

        .wrap {
            width: 100%;
            height: 800px;
        }

        .header {
            background-color: black;
            width: 100%;
            height: 50px;
        }
        .button2{
            
            width:352px;
            margin:40px auto;
        }
        .planner{
            position: relative;
            background-color: #F56262;
            height:80px;
            border-radius: 10px;
        }
        .realTime{
            background-color: #9D9D9D;
            border-radius: 10px;
            height:80px;
            margin-top:20px;
        }
        .clinic{
            background-color: #9D9D9D;
            border-radius: 10px;
            height:80px;
            margin-top:20px;
        }
        .button2 h1{
            font-size: 18px;
            color:white;
            position: relative;
            left:20px;
            top:14px;
        }
        .button2 p{
            font-size: 14px;
            color:white;
            position: relative;
            left:20px;
            top:14px;
            opacity: 1;
        }
	`}</style>
            <div className="content">
                <div className="button2">
                    <Link href='/myclass/frontdesk'><div className="planner">
                        <h1>플래너 ss(유료)</h1>
                        <p>플래너 관리를 통한 학습 관리</p>
                    </div></Link>
                    <Link href='/myclass_free/planner'><div className="planner" style={{margin:'20px auto'}}>
                        <h1>플래너 관리반(무료)</h1>
                        <p>플래너 관리를 통한 학습 관리</p>
                    </div></Link>
					<div className="realTime">
                        <h1>생기부 관리반</h1>
                        <p>(10월 1일 open)</p>
                    </div>
					<div className="clinic">
                        <h1>클리닉 수업반</h1>
                        <p>(12월 open 예정)</p>
                    </div>
                </div>
            </div>
    </div>
	)
}

export default Main