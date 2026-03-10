import Link from 'next/link'
import withDesktop from '../../comp/withdesktop'
import Page from './classpic_app'


const ClassPic = () => {
	return (
	<div className="container">
        <style jsx>{`
        
        body{
            width:100%;
            
        }
	     .container{
            margin-top:100px;
            width: 1920px;   
            margin:auto;
        }
       .header{
           height:100.5px;
       }
       .footer{
           height:219px;
       }
        
        #plannerB{
            width:400px;
            height: 533px;  
            background-color:#FFD483;
            border-radius: 20px;
        }
        #real-timeB{
            width:400px;
            height: 533px;  
            background-color:#FAA887;
            border-radius: 20px;
        }
        #clinicB{
            width:400px;
            height: 533px;  
            background-color:#FA8B5F;
            border-radius: 20px;
        }
        .section{
            
            width:1320px;
            margin:100px auto;
            height: 993.5px;
            position: relative;
            color:#ffffff;
        }
        .imgText{
            position:absolute;
           top:36px;
           margin-left:54px;
          
        }
        .planner{
            width:440px;
           float:left;
         
        }
        
        .real-time{
            width:440px;
            float:left;
        }
        .clinic{
            
             width:440px;
            float:left;
          
        }
        
        h1{
            width:207px;
            height: 54px;
        }
        h1:nth-of-type(2){
            width:207px;
            height: 54px;
            line-height:250px;
            color:red;
        }
        p{
            width:115px;
            height:29px;
        }

        .planner:hover{
            color:red;
            cursor:pointer;
        }
        .
    
		`}</style>
        
        <div className="section">
            <Link href='/myclass/frontdesk'>
				<div className="planner">
					<button id ="plannerB"></button>
					<div className="imgText">
						<h1>플래너 관리반(유료)</h1>
						<p>플래너 관리반</p>
					</div>
				</div>
            </Link>
            <Link href='/myclass_free/planner'>
				<div className="planner">
					<button id ="plannerB"></button>
					<div className="imgText">
						<h1>플래너 관리반(무료)</h1>
						<p>플래너 관리반</p>
					</div>
				</div>
            </Link>
			<div className="real-time">
				<button id ="real-timeB"></button>
				<div className="imgText">
					<h1>생기부 관리반</h1>
					<p>생기부 관리반</p>
					<h1>10월 open</h1>
				</div>
			</div>
			<div className='clinic'>
				<button id ="clinicB"></button>
				<div className="imgText">
					<h1>클리닉 수업반</h1>
					<p>클리닉 수업반</p>
					<h1>12월 open</h1>
				</div>
			</div>
		</div>
		</div>
	)
}

export default withDesktop(ClassPic,Page)
