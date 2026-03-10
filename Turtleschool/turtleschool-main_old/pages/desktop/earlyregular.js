import Link from 'next/link';
import withPayment from '../../comp/paymentwrapper';
import Menu from '../../comp/susimenu';
const EarlyRegular = () => {
  const btn = {
    width: '400px',
    height: '80px',
    display: 'flex',
    background: 'linear-gradient(45deg, #FC8454, #D86132)',
    color: 'white',
    webkitTextStroke: '1px',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    margin: '0 auto',
    borderRadius: '16px',
  };

  return (
    <div style={{backgroundColor: '#FAFAFA'}}>
      <Menu title="정시 가능 대학" index={3} />
      <div style={{width: '1280px', margin: '0 auto'}}>
        <div style={{height: '100px', width: '100%'}} />

        <div
          style={{
            backgroundImage: `url('https://img.ingipsy.com/assets/test-illustration.png')`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right',
            minHeight: '300px',
            width: '860px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div>
            <span className="title_left">정시 가능 대학</span>
            <p>
              정시 가능 대학 검색은 모의고사/성적 관리에서
              <br />
              성적 입력 후 확인하실 수 있습니다.
            </p>
          </div>
        </div>

        <Link href="/mockup/mygrade">
          <div style={btn}>모의고사관리 성적 입력 바로가기</div>
        </Link>
      </div>
    </div>
  );
};

export default withPayment(EarlyRegular, null, '수시');
