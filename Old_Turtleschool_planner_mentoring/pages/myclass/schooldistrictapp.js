const SchoolDistrict = () => {
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
            height: 2463px;
        }
        .content{
           width:400px;
           margin:auto;
            height:2025px;
        }
        .header {
            background-color: black;
            width: 100%;
            height: 50px;
        }

        .main {
            background-color: blue;
            height: 60px;
        }
        
        
        .content h1 {
            margin-top:20px;
            height: 53px;
            font-size: 17px;
            line-height: 53px;
            text-align: left;
        }
        .sell {
            width: 400px;
            height: 10px;
            background-color: #EDEEED;
        }
        select{
            border-style:none;
        }
        .allRank{
          width: 352px;
          height:481px;
          margin:auto;
        }
        .allRank select:not(:nth-of-type(1)) {
            margin-left: 15px;
        }
        .allRank select{
            width:165px;
            height:38px;
            text-align-last: center;
            border-radius: 5px;
            background-color: #FFFFFF;
            box-shadow: 0px 3px 6px rgba(00, 00, 00, 16%);
        }
        .allRank .button{
            margin-top:15px;
            width:352px;
            height:40px;
            border-radius: 5px;
            border:0.5px #D1D1D1 solid;
            line-height: 40px;
        }
        .allRank .button button{
            width:117.33px;
            margin-right:-5px;
        }
        .day_graph {
            
            width: 352px;
            height: 249px;
            border: 1px #9D9D9D solid;
            margin-top: 25px;
            border-collapse: collapse;
        }

        .allRank .line {
            width: 100%;
            height: 12.5%;
            border-bottom: 1px #9D9D9D solid;
            font-size: 10px;
            color:#9D9D9D;
        }

        .allRank .students ul {
            display: flex;
            width: 80%;
            font-size: 16px;
            margin: auto;

        }

        .allRank .students li {
            display: flex;
            font-size: 16px;
            padding: 10px 15px 31px 0px;


        }
        .pic{
          width: 352px;
          height:435px;
          margin:auto;
        }
        .pic select:not(:nth-of-type(1)) {
            margin-left: 15px;
        }
        .pic select{
            width:165px;
            height:38px;
            text-align-last: center;
            border-radius: 5px;
            background-color: #FFFFFF;
            box-shadow: 0px 3px 6px rgba(00, 00, 00, 16%);
        }
        .pic .line {
            width: 100%;
            height: 12.5%;
            border-bottom: 1px #9D9D9D solid;
            font-size: 10px;
            color:#9D9D9D;
        }

        .pic .students ul {
            display: flex;
            width: 80%;
            font-size: 16px;
            margin: auto;

        }

        .pic .students li {
            display: flex;
            font-size: 16px;
            padding: 10px 15px 31px 0px;


        }
        .pic .button{
            
            width:352px;
            height:40px;
            border-radius: 5px;
            border:0.5px #D1D1D1 solid;
            line-height: 40px;
        }
        .pic .button button{
            width:88.0px;
            margin-right:-5px;
        }
        .pic .students ul {
            display: flex;
            width: 100%;
            font-size: 16px;
            margin: auto;

        }

        .pic .students li {
            display: flex;
            font-size: 16px;
            padding: 10px 30px 31px 0px;
            margin-left:30px;

        }
        .variance_all{
          width: 352px;
          height:505px;
          margin:auto;
        }
       
        .radio{
            width:352px;
            height:63px;
            text-align: center;
            line-height: 63px;
            justify-content: space-around;
            display: flex;
            position: relative;
            
        }
        .radio .color{
            position: absolute;
            display: flex;
            left:17px;
            top:24px;
            font-size: 16px;
            
        }
        .radio .color .red{
            width:15px;
            height:15px;
            border-radius: 25px 25px 25px 25px;
            background-color: #F56262;
       
        }
        .radio .color .yellow{
            width:15px;
            height:15px;
            border-radius: 25px 25px 25px 25px;
            background-color: #FDDE05;
            margin-left:100px;
        }
        .radio .color .blue{
            width:15px;
            height:15px;
            border-radius: 25px 25px 25px 25px;
            background-color: #6689A1;
            margin-left:90px;
        }
        .variance_all select:not(:nth-of-type(1)) {
            margin-left: 8px;
        }
        .variance_all select{
            width:109px;
            height:38px;
            text-align-last: center;
            border-radius: 5px;
            background-color: #FFFFFF;
            box-shadow: 0px 3px 6px rgba(00, 00, 00, 16%);
        }
        .variance_graph {
            
            width: 352px;
            height: 282px;
            border: 1px #9D9D9D solid;
           
            border-collapse: collapse;
        }

        .variance_all .line {
            width: 100%;
            height: 11.111%;
            border-bottom: 1px #9D9D9D solid;
            font-size: 10px;
            color:#9D9D9D;
        }

        .variance_all .students ul {
            display: flex;
            width: 100%;
            font-size: 16px;
            margin: auto;

        }

        .variance_all .students li {
            display: flex;
            font-size: 16px;
            padding: 10px 30px 31px 0px;
            margin-left:30px;

        }
        .variance_all .button{
            margin-top:20px;
            width:352px;
            height:40px;
            border-radius: 5px;
            border:0.5px #D1D1D1 solid;
            line-height: 40px;
        }
        .variance_all .button button{
            width:88.0px;
            margin-right:-5px;
        }
	`}</style>
        <div className="content">
            <div className="allRank">
                <h1>교육청 모의 순위(전과목)</h1>
                <div className="selectBox">     
                    <select name="" id="">
                        <option value="">2021년&nbsp;&nbsp;&nbsp;&#9660;</option>
                    </select>
                    <select name="" id="">
                        <option value="">5월&nbsp;&nbsp;&nbsp;&#9660;</option>
                    </select>
                </div>
                <div className="button">
                    <button>원점수</button>
                    <button>등급</button>
                    <button>표준점수</button>
                </div>
                <div className="day_graph">
                    <div className="line">300</div>
                    <div className="line">260</div>
                    <div className="line">220</div>
                    <div className="line">180</div>
                    <div className="line">140</div>
                    <div className="line">100</div>
                    <div className="line">60</div>
                    <div className="line">20</div>  
                </div>
                <div className="students">
                    <ul>
                        <li>A학생</li>
                        <li>B학생</li>
                        <li>C학생</li>
                        <li>D학생</li>
                        <li>E학생</li>
                    </ul>
                </div>
            </div>
              <div className="sell"></div>
            <div className="pic">
                <h1>과목별 모의 순위(과목별)</h1>
                <div className="button">
                    <button>국어</button>
                    <button>영어</button>
                    <button>수학</button>
                    <button>탐구</button>
                </div>
                <div className="day_graph">
                    <div className="line">100</div>
                    <div className="line">90</div>
                    <div className="line">80</div>
                    <div className="line">70</div>
                    <div className="line">60</div>
                    <div className="line">50</div>
                    <div className="line">40</div>
                    <div className="line">30</div>  
                </div>
                <div className="students">
                    <ul>
                        <li>3월</li>
                        <li>6월</li>
                        <li>9월</li>
                        <li>11월</li>
                    </ul>
                </div>
            </div>
            <div className="sell"></div>
            <div className="variance_all">
                <h1>모의 성적 변동 추이(전과목)</h1>
                <div className="selectBox">     
                    <select name="" id="">
                        <option value="">이름&nbsp;&nbsp;&nbsp;&#9660;</option>
                    </select>
                    <select name="" id="">
                        <option value="">학년&nbsp;&nbsp;&nbsp;&#9660;</option>
                    </select>
                    <select name="" id="">
                        <option value="">시험명&nbsp;&nbsp;&nbsp;&#9660;</option>
                    </select>
                </div>
                <div className="radio">
                    <div className="color">
                        <div className="red"></div>
                        <div className="yellow"></div>
                        <div className="blue"></div>
                     </div>
                    <div className="text">원점수</div>
                    <div className="text">등급</div>
                    <div className="text">표준점수</div>
                </div>
                <div className="variance_graph">
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div> 
                    <div className="line"></div> 
                     
                </div>
                <div className="students">
                    <ul>
                        <li>3월</li>
                        <li>6월</li>
                        <li>9월</li>
                        <li>11월</li>
                       
                    </ul>
                </div>
            </div>
            <div className="sell"></div>
            <div className="variance_all">
                <h1>모의 성적 변동 추이(전과목)</h1>
                <div className="selectBox">     
                    <select name="" id="">
                        <option value="">이름&nbsp;&nbsp;&nbsp;&#9660;</option>
                    </select>
                    <select name="" id="">
                        <option value="">학년&nbsp;&nbsp;&nbsp;&#9660;</option>
                    </select>
                    <select name="" id="">
                        <option value="">시험명&nbsp;&nbsp;&nbsp;&#9660;</option>
                    </select>
                </div>
                <div className="button">
                    <button>국어</button>
                    <button>영어</button>
                    <button>수학</button>
                    <button>탐구</button>
                </div>
                <div className="radio">
                    <div className="color">
                        <div className="red"></div>
                        <div className="yellow"></div>
                        <div className="blue"></div>
                     </div>
                    <div className="text">원점수</div>
                    <div className="text">등급</div>
                    <div className="text">표준점수</div>
                </div>
                <div className="variance_graph">
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div> 
                    <div className="line"></div> 
                     
                </div>
                <div className="students">
                    <ul>
                        <li>3월</li>
                        <li>6월</li>
                        <li>9월</li>
                        <li>11월</li>
                       
                    </ul>
                </div>
            </div>
            
        </div>
    </div>
)
}

export default SchoolDistrict