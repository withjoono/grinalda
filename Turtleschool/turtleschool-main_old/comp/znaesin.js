import axios from 'axios';
import {useEffect, useState} from 'react';

const Znaesin = () => {
  const [gpaAsk, setgpaAsk] = useState([]); //내신성적저장
  const [chartTwo, setchartTwo] = useState({
    series: [
      {
        data: [1, 1, 1, 1, 1],
        showInLegend: false,
        color: 'rgb(44, 131, 186)',
        marker: {
          lineColor: 'rgb(44, 131, 186)',
          lineWidth: '1',
          color: '#ffffff',
        },
      },
    ],
    chart: {
      marginTop: '25',
      height: '450',
    },
    xAxis: {
      categories: ['전과목', '국영수사과\n한국사', '국영수사과', '국영수사', '국영수과'],
      title: null,
      labels: {
        style: {
          fontSize: '15px',
        },
      },
    },
    yAxis: {
      title: {
        text: null,
        align: 'high',
        offset: 0,
        rotation: 0,
        y: -10,
        style: {
          fontSize: '15px',
        },
      },
      min: 1,
      max: 9,
      labels: {
        format: '{value}등급',
        style: {
          fontSize: '15px',
        },
      },
      endOnTick: false,
      startOnTick: false,
      reversed: true,
    },
    title: {
      text: null,
    },
  }); //내신그래프
  const [radio, setRadio] = useState([true, true]);
  useEffect(() => {
    if (!localStorage.getItem('uid')) return;
    axios
      .get('/api/gpa/gpaselect', {
        headers: {
          auth: localStorage.getItem('uid'),
        },
        params: {
          dvsn: 'A',
        },
      })
      .then(res => {
        setgpaAsk(res.data.data);
        changetest2(res.data.data);
      });
  }, []);

  useEffect(() => {
    changetest2(gpaAsk);
  }, [radio]);

  function changetest2(param) {
    if (param.length < 5) return;
    setchartTwo({
      series: [
        {
          data: [
            param[0].grade5 * 1.0,
            param[1].grade5 * 1.0,
            param[2].grade5 * 1.0,
            param[3].grade5 * 1.0,
            param[4].grade5 * 1.0,
          ],
          showInLegend: false,
          color: 'rgb(44, 131, 186)',
          marker: {
            lineColor: 'rgb(44, 131, 186)',
            lineWidth: '1',
            color: '#ffffff',
          },
          visible: radio[0] ? true : false,
        },
        {
          data: [
            param[0].grade1 * 1.0,
            param[1].grade1 * 1.0,
            param[2].grade1 * 1.0,
            param[3].grade1 * 1.0,
            param[4].grade1 * 1.0,
          ],
          showInLegend: false,
          color: 'rgb(230, 0, 0)',
          marker: {
            lineColor: 'rgb(230, 0, 0)',
            lineWidth: '1',
            color: '#ffffff',
          },
          visible: radio[1] ? true : false,
        },
      ],
      chart: {
        marginTop: '25',
        height: '450',
      },
      xAxis: {
        categories: ['전과목', '국영수사과\n한국사', '국영수사과', '국영수사', '국영수과'],
        title: null,
        labels: {
          style: {
            fontSize: '15px',
          },
        },
      },
      yAxis: {
        title: {
          text: null,
          align: 'high',
          offset: 0,
          rotation: 0,
          y: -10,
          style: {
            fontSize: '15px',
          },
        },
        min: 1,
        max: 9,
        labels: {
          format: '{value}등급',
          style: {
            fontSize: '15px',
          },
        },
        endOnTick: false,
        startOnTick: false,
        reversed: true,
      },
      title: {
        text: null,
      },
    });
  }

  const handleRadio = () => {
    setRadio(p => {
      p[0] = !p[0];
      return [...p];
    });
  };
  const handleRadioTwo = () => {
    setRadio(p => {
      p[1] = !p[1];
      return [...p];
    });
  };

  const check = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <g id="Group_1000" data-name="Group 1000" transform="translate(-511 -1395)">
        <rect
          id="Rectangle_2338"
          data-name="Rectangle 2338"
          width="24"
          height="24"
          rx="2"
          transform="translate(511 1395)"
          fill="#9d9d9d"
        />
        <path
          id="__TEMP__SVG__"
          d="M26.5,4.5H6.5a2,2,0,0,0-2,2v20a2,2,0,0,0,2,2h20a2,2,0,0,0,2-2V6.5A2,2,0,0,0,26.5,4.5ZM14.5,22l-5-4.957L11.09,15.5l3.41,3.346L21.909,11.5,23.5,13.077Z"
          transform="translate(506.5 1390.5)"
          fill="#dbdbdb"
        />
      </g>
    </svg>
  );
  const checkBlue = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      onClick={handleRadio}
    >
      <g id="Group_1000" data-name="Group 1000" transform="translate(-511 -1395)">
        <rect
          id="Rectangle_2338"
          data-name="Rectangle 2338"
          width="24"
          height="24"
          rx="2"
          transform="translate(511 1395)"
          fill="#9d9d9d"
        />
        <path
          id="__TEMP__SVG__"
          d="M26.5,4.5H6.5a2,2,0,0,0-2,2v20a2,2,0,0,0,2,2h20a2,2,0,0,0,2-2V6.5A2,2,0,0,0,26.5,4.5ZM14.5,22l-5-4.957L11.09,15.5l3.41,3.346L21.909,11.5,23.5,13.077Z"
          transform="translate(506.5 1390.5)"
          fill={radio[0] ? '#89C0E3' : '#dbdbdb'}
        />
      </g>
    </svg>
  );
  const checkRed = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      onClick={handleRadioTwo}
    >
      <g id="Group_1000" data-name="Group 1000" transform="translate(-511 -1395)">
        <rect
          id="Rectangle_2338"
          data-name="Rectangle 2338"
          width="24"
          height="24"
          rx="2"
          transform="translate(511 1395)"
          fill="#9d9d9d"
        />
        <path
          id="__TEMP__SVG__"
          d="M26.5,4.5H6.5a2,2,0,0,0-2,2v20a2,2,0,0,0,2,2h20a2,2,0,0,0,2-2V6.5A2,2,0,0,0,26.5,4.5ZM14.5,22l-5-4.957L11.09,15.5l3.41,3.346L21.909,11.5,23.5,13.077Z"
          transform="translate(506.5 1390.5)"
          fill={radio[1] ? 'rgb(255, 213, 213)' : '#dbdbdb'}
        />
      </g>
    </svg>
  );
  return {
    gpaAsk: gpaAsk,
    setgpaAsk: setgpaAsk,
    chartTwo: chartTwo,
    setchartTwo: setchartTwo,
    radio: radio,
    setRadio: setRadio,
    check: check,
    checkBlue: checkBlue,
    checkRed: checkRed,
  };
};

export default Znaesin;
