import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import {useState} from 'react';
import Menu from '../../comp/naesinmenu';
if (typeof Highcharts === 'object') {
  HighchartsMore(Highcharts);
}
const University = () => {
  const distributionOptions = {
    series: [
      {
        name: '등급',
        data: [0, 0, 1, 1, 2, 2, 4, 8, 5],
      },
    ],
    chart: {
      type: 'spline',
      events: {
        load() {
          setTimeout(this.reflow.bind(this), 0);
        },
      },
    },
    xAxis: {
      categories: [9, 8, 7, 6, 5, 4, 3, 2, 1].map(e => e + '등급'),
      title: null,
      labels: {
        style: {
          fontSize: '10px',
        },
      },
    },
    yAxis: {
      gridLineWidth: 0,
      text: null,
    },
    title: {
      text: null,
    },
  };

  const result = (
    <>
      <div className="desktop_box" style={{width: '100%', display: 'flex', height: '150px'}}>
        <div style={{width: '33.3333%'}}>
          <div className="title_left">중앙대 국어국문학과</div>
          <div className="white_txt yellow smallbtn" style={{marginTop: '10px'}}>
            교과
          </div>
        </div>
        <div
          className="flexcolumn bold"
          style={{width: '10%', justifyContent: 'space-between', height: '100%'}}
        >
          <div>수능 최저 기준</div>
          <div>자소서 유/무</div>
          <div>면접 유/무</div>
        </div>
        <div
          className="flexcolumn"
          style={{width: '26.6666%', justifyContent: 'space-between', height: '100%'}}
        >
          <div className="orange_txt" style={{textDecoration: 'underline'}}>
            국수탐 합 6등급 이내
          </div>
          <div>유/무</div>
          <div>유/무</div>
        </div>
        <div
          className="flexcolumn"
          style={{width: '33.3333%', justifyContent: 'flex-end', height: '100%'}}
        >
          <div>
            <span className="bold" style={{marginRight: '1em'}}>
              면접 날짜
            </span>{' '}
            2020-20-21
            <div className="smallbtn" style={{display: 'inline-flex', marginLeft: '1em'}}>
              면접날짜 종목확인
            </div>
          </div>
        </div>
      </div>
      <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
        <div style={{width: 'calc(50% - 10px)'}}>
          <div className="title_left">분석 개요</div>
          <div className="desktop_box">
            <table className="desktop_box_table">
              <tr>
                <th>경쟁률</th>
                <th>평균</th>
                <th>70% 컷</th>
              </tr>
              <tr>
                <td>경쟁률</td>
                <td>평균</td>
                <td>70% 컷</td>
              </tr>
            </table>
            <table className="desktop_box_table">
              <tr>
                <th>컷라인</th>
                <th>차이</th>
                <th>목표대학 설정</th>
              </tr>
              <tr>
                <td>컷라인</td>
                <td>차이</td>
                <td>
                  <div className="orangesmallbtn" style={{width: '90px'}}>
                    설정하기
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div className="title_left">21년 합격자 성적 분포도</div>
          <div
            className="desktop_box"
            style={{height: '280px', width: '100%', position: 'relative'}}
          >
            <div
              style={{
                position: 'absolute',
                height: 'calc(100% - 60px)',
                width: 'calc(100% - 60px)',
              }}
            >
              <HighchartsReact
                highcharts={Highcharts}
                options={distributionOptions}
                containerProps={{style: {height: '100%'}}}
              />
            </div>
          </div>
        </div>
        <div style={{width: 'calc(50% - 10px)'}}>
          <div className="title_left">5개년 성적 분석</div>
          <div className="desktop_box" style={{height: 'calc(100% - 45px)'}}>
            <table className="desktop_box_table">
              <tr>
                <th>연도</th>
                <th>평균</th>
                <th>평균</th>
                <th>평균</th>
                <th>70% 컷</th>
              </tr>
              <tr>
                <td>2017</td>
                <td>16:1</td>
                <td>2.73</td>
                <td>2.73</td>
                <td>2.73</td>
              </tr>
              <tr>
                <td>2017</td>
                <td>16:1</td>
                <td>2.73</td>
                <td>2.73</td>
                <td>2.73</td>
              </tr>
              <tr>
                <td>2017</td>
                <td>16:1</td>
                <td>2.73</td>
                <td>2.73</td>
                <td>2.73</td>
              </tr>
              <tr>
                <td>2017</td>
                <td>16:1</td>
                <td>2.73</td>
                <td>2.73</td>
                <td>2.73</td>
              </tr>
              <tr>
                <td>2017</td>
                <td>16:1</td>
                <td>2.73</td>
                <td>2.73</td>
                <td>2.73</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </>
  );

  const Chevron = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="11.589"
        height="42.115"
        viewBox="0 0 11.589 42.115"
      >
        <path
          id="Path_53"
          data-name="Path 53"
          d="M-3569.123,1227.13l8.121,19.09-8.121,19.09"
          transform="translate(3571.09 -1225.163)"
          fill="none"
          stroke="#9d9d9d"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="3"
        />
      </svg>
    );
  };

  const chartOptions = {
    series: [
      {
        name: 'Temperatures',
        data: [
          [-9.9, 10.3],
          [-8.6, 8.5],
          [-10.2, 11.8],
          [-1.7, 12.2],
          [-0.6, 23.1],
          [3.7, 25.4],
          [6.0, 26.2],
          [6.7, 21.4],
          [3.5, 19.5],
          [-1.3, 16.0],
          [-8.7, 9.4],
          [-9.0, 8.6],
        ],
      },
    ],
    chart: {
      marginTop: '25',
      height: '600',
      type: 'columnrange',
    },
    xAxis: {
      categories: ['가톨릭대', '건국데', '경희대', '경희대', '경희대', '경희대', '경희대'],
      title: null,
      labels: {
        style: {
          fontSize: '15px',
        },
      },
    },
    yAxis: {
      gridLineWidth: 0,
      title: {
        text: '등급',
        align: 'high',
        offset: 0,
        rotation: 0,
        y: -10,
        style: {
          fontSize: '15px',
        },
      },
      labels: {
        style: {
          fontSize: '15px',
        },
      },
      reversed: true,
    },
    title: {
      text: null,
    },
  };
  const [clicked, setClicked] = useState(false);
  const h = () => {
    setClicked(true);
  };

  return (
    <>
      <Menu index={3} title="대학 예측 및 검색" />
      <div style={{width: '1280px', margin: '0 auto'}}>
        {!clicked ? (
          <>
            <div className="menu">
              <button className="menu_active">교과 전형</button>
              <button>학생부 종합 전형</button>
              <button>논술 전형</button>
            </div>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
            <div
              style={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{width: 'calc(50% - 40px)'}}>
                <div className="title_left">학교 검색 결과</div>
                <div className="desktop_box" style={{maxHeight: '780px', overflowY: 'scroll'}}>
                  <table className="desktop_box_table">
                    <tr>
                      <th>학교</th>
                      <th>학과 검색</th>
                    </tr>
                    {[
                      '고려대',
                      '광운대',
                      '와우',
                      '고려대',
                      '광운대',
                      '와우',
                      '고려대',
                      '광운대',
                      '와우',
                      '고려대',
                      '광운대',
                      '와우',
                      '고려대',
                      '광운대',
                      '와우',
                      '고려대',
                      '광운대',
                      '와우',
                      '고려대',
                      '광운대',
                      '와우',
                      '고려대',
                      '광운대',
                      '와우',
                      '고려대',
                      '광운대',
                      '와우',
                      '고려대',
                      '광운대',
                      '와우',
                    ].map((e, i) => {
                      return (
                        <tr key={e + 'i'}>
                          <td>{e}</td>
                          <td>
                            <button className="orangesmallbtn">결과 확인</button>
                          </td>
                        </tr>
                      );
                    })}
                  </table>
                </div>
              </div>
              <div
                style={{
                  height: '140px',
                  width: '60px',
                  border: '1px solid #9D9D9D',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Chevron />
                <Chevron />
              </div>
              <div style={{width: 'calc(50% - 40px)', minHeight: '780px'}}>
                <div className="title_left">해당 학교 결과</div>
                <div className="desktop_box" style={{maxHeight: '780px', overflowY: 'scroll'}}>
                  <table className="desktop_box_table">
                    <tr>
                      <th>학과</th>
                      <th>학과 합격 예측</th>
                    </tr>
                    {[
                      '경영학과',
                      '수학과',
                      '경영학과',
                      '수학과',
                      '경영학과',
                      '수학과',
                      '경영학과',
                      '수학과',
                      '경영학과',
                      '수학과',
                      '경영학과',
                      '수학과',
                      '경영학과',
                      '수학과',
                      '경영학과',
                      '수학과',
                      '경영학과',
                      '수학과',
                      '경영학과',
                      '수학과',
                      '경영학과',
                      '수학과',
                      '경영학과',
                      '수학과',
                      '경영학과',
                      '수학과',
                      '경영학과',
                      '수학과',
                    ].map((e, i) => {
                      return (
                        <tr key={e + 'i'}>
                          <td>{e}</td>
                          <td>
                            <button className="orangesmallbtn" onClick={h}>
                              결과 확인
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : (
          result
        )}
      </div>
    </>
  );
};

export default University;
