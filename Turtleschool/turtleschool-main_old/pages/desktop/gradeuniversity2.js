import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';

if (typeof Highcharts === 'object') {
  HighchartsMore(Highcharts);
}

const gradeuniversity2 = () => {
  const btn = {
    width: '180px',
    height: '40px',
    textAlign: 'center',
    color: 'white',
    lineHeight: '40px',
    border: '1px solid #fede01',
    backgroundColor: '#fede01',
    margin: '0 20px',
    flexBasis: 0,
    flexGrow: 1,
  };

  const btn2 = {
    ...btn,
    color: 'black',
    backgroundColor: 'white',
  };

  const inactive = {
    textAlign: 'center',
    padding: '7px 32px',
    border: '1px solid #fede01',
    marginLeft: '7px',
  };

  const item = {
    border: '1px solid #e9e9e9',
    borderRadius: '13px',
    boxSizing: 'border-box',
    padding: '0 67px',
    marginBottom: '14px',
    height: '74px',
    display: 'flex',
    alignItems: 'center',
    minWidth: '40%',
    maxWidth: 'calc(50% - 20px)',
    boxSizing: 'border-box',
    flexBasis: 0,
    flexGrow: 1,
  };

  const chartOptions = {
    series: [
      {
        data: [
          [4, 3],
          [8, 2],
          [6, 3.5],
          [7.7, 3.2],
          [2, 1.1],
        ],
        showInLegend: false,
        color: '#fede01',
        pointWidth: '40',
      },
    ],
    chart: {
      marginTop: '20',
      type: 'columnrange',
      height: '617',
    },
    xAxis: {
      categories: ['중앙대', '경희대', '건국대', '서울대', '고려대'],
      title: null,
      labels: {
        style: {
          fontSize: '15px',
        },
      },
    },
    yAxis: {
      gridLineWidth: 0,
      title: null,
      plotLines: [
        {
          value: 3.5,
          width: 1,
          color: 'red',
          label: {
            text: '내등급',
            rotation: 0,
            style: {
              color: 'red',
              fontSize: '15px',
            },
          },
          zIndex: 10,
        },
      ],
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

  return (
    <div className="page">
      <div style={{width: '1280px', margin: '0 auto'}}>
        <div style={{fontSize: '30px', margin: '40px 0 35px'}}>추천 전형/대학</div>
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #fede01',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <div style={btn2}>정시로 가능한 대학</div>
          <div style={btn}>학생부종합전형으로 가능한 대학</div>
          <div style={btn2}>논술로 가능한 대학</div>
        </div>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
      <div
        style={{
          backgroundColor: '#2c2b57',
          display: 'flex',
          width: '100%',
          height: '576px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{textAlign: 'center', color: 'white'}}>
          앞으로의 변동 가능성은 많지만
          <br />
          <br />
          최지웅님의 현재 상황으로서는
          <br />
          <br />
          <br />
          <p style={{fontSize: '1.2em'}}>&lt;정시+학종 전형&gt;을 추천합니다.</p>
        </div>
      </div>
    </div>
  );
};

export default gradeuniversity2;
