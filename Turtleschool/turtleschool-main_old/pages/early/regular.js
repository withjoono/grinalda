import withDesktop from '../../comp/withdesktop';
import page from '../desktop/earlyregular';

const Regular = () => {
  return (
    <>
      <style jsx>{`
        * {
          margin: 0px;
          padding: 0px;
        }

        li {
          list-style: none;
        }

        a {
          text-decoration: none;
        }

        .wrap {
          margin-top: 30px;
          height: 800px;
        }
        .content {
          width: 352px;
          height: 690px;
          margin: auto;
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
          height: 65px;
          font-size: 22px;
          line-height: 53px;
          text-align: left;
        }
        .content p {
          font-size: 15px;
        }
        .content img {
          margin-top: 75px;
          width: 352px;
          height: 165px;
        }
        .sell {
          width: 400px;
          height: 10px;
          background-color: #edeeed;
        }
        select {
          border-style: none;
        }
        .button {
          margin-top: 75px;
          width: 352px;
          height: 40px;
          background-color: #de6b3d;
          border-radius: 5px;
          font-size: 14px;
          color: white;
          text-align: center;
          line-height: 40px;
          font-weight: Bold;
        }
      `}</style>
      <div className="wrap">
        <div className="content">
          <h1>정시 가능 대학</h1>
          <p>정시 가능 대학 검색은 모의고사/성적 관리에서</p>
          <p>성적 입력 후 확인하실 수 있습니다.</p>
          <img src="https://img.ingipsy.com/assets/test-illustration.png" alt="" />
          <div className="button">모의고사관리 성적 입력 바로가기</div>
        </div>
      </div>
    </>
  );
};

export default withDesktop(page, Regular);
