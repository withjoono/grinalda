import Highcharts from 'highcharts';
import HighchartsCustom from 'highcharts-custom-events';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import {useMemo, useState} from 'react';
import withDesktop from '../../comp/withdesktop';
import pool from '../../lib/pool';
import page from '../desktop/gradeuniversity';

if (typeof Highcharts === 'object') {
  HighchartsMore(Highcharts);
  HighchartsCustom(Highcharts);
}

const Result = () => {
  <div className="mobile_page">
    <div style={{height: '22px', width: '100%'}} />
    <div
      style={{
        lineHeight: '30px',
        fontSize: '22px',
        marginBottom: '12px',
        borderBottom: '5px solid #DE6B3D',
      }}
    >
      {localStorage.getItem('name')}님의 합격 진단
    </div>
    <div className="orange_text">중앙대 국어국문학과 | 교과전형</div>
    <div className="mobile_menu">
      <button className={chosen == 0 ? 'mobile_menuactive' : ''} onClick={() => setChosen(0)}>
        교과/논술 전형
      </button>
      <button className={chosen == 1 ? 'mobile_menuactive' : ''} onClick={() => setChosen(1)}>
        학생부 종합 전형
      </button>
    </div>
    <button className="orangebigbtn">진단하기</button>
    <HighchartsReact highcharts={Highcharts} options={chartOptions} />
  </div>;
};

const EarlyInput = ({areaCodes}) => {
  const [chosen, setChosen] = useState(0);
  const a = useMemo(
    () =>
      Array(8)
        .fill(0)
        .map(e => {
          const t = Math.random() * 8 + 1;
          return [t, Math.min(9, t + Math.random() * 3)];
        }),
    [],
  );

  const chartOptions = {
    series: [
      {
        data: a,
        showInLegend: false,
        color: {
          linearGradient: {x1: 0, x2: 0, y1: 0, y2: 1},
          stops: [
            [0, '#D8DC6A'], // start
            [1, '#FD8492'], // end
          ],
        },
        borderRadius: 4,
      },
    ],
    chart: {
      height: '80%',
      marginTop: 40,
      type: 'columnrange',
    },
    yAxis: {
      title: {
        align: 'high',
        offset: 0,
        text: '등급',
        rotation: 0,
        y: -10,
      },
      min: 1,
      max: 9,
      reversed: true,
    },
    xAxis: {
      title: null,
      categories: ['고려대', '고려대', '고려대', '고려대', '고려대', '고려대', '고려대', '고려대'],
      style: {
        cursor: 'pointer',
      },
      labels: {
        events: {},
      },
    },
    title: {
      text: null,
    },
  };

  return (
    <div className="page" style={{width: '90%', margin: '0 auto'}}>
      <style jsx>{`
        .s {
          width: 100%;
          border: 1px solid #9d9d9d;
          height: 40px;
        }
        select {
          width: 100%;
          height: 100%;
        }
      `}</style>
      <div style={{height: '22px', width: '100%'}} />
      <div className="mobile_menu">
        <button className={chosen == 0 ? 'mobile_menuactive' : ''} onClick={() => setChosen(0)}>
          교과
        </button>
        <button className={chosen == 1 ? 'mobile_menuactive' : ''} onClick={() => setChosen(1)}>
          학생부 종합
        </button>
        <button className={chosen == 2 ? 'mobile_menuactive' : ''} onClick={() => setChosen(2)}>
          논술
        </button>
      </div>
      <div>
        <select>
          <option value="">지역 선택</option>
          {areaCodes.map(r => (
            <option value={r.code} key={r.code}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
      <button className="orangebigbtn">진단하기</button>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};
export default withDesktop(page, EarlyInput);

export async function getStaticProps() {
  const {rows} = await pool.query(`select code, "groupId" , "name" , description , "isUse" , sort
	 from codes where "isUse" = true and "groupId" = 1`);
  return {props: {areaCodes: rows}};
}
