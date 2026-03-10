import axios from 'axios';
import {
  saveafterPAPI,
  saveBeforeScoreAPI,
  saveAfterScoreAPI,
  scoreToGradeAPI,
  selectanalysis_7API,
  selectsubjectAPI,
} from './urls';
import {
    collectConvertScore,
    calculatedConvertScore
} from './calculateunivscore.js'
import _ from 'lodash';
const logger = require('pino')();

export const saveScoreFetch = async query => {
  const year = new Date().getFullYear().toString();

  return axios.post(saveafterPAPI, {
    headers: {
      auth: localStorage.getItem('uid'),
    },
    data: {
      year,
      array_score: query,
    },
  });
};

export const saveBeforeScoreFetch = async query => {
  try {
    // /pages/api/csat/savescore.js
    const url = saveBeforeScoreAPI;
    const data = {year: '2022', array_score: query};
    console.group('call api. method: POST, url:', url);
    console.log('request:[', data, ']');
    return axios.post(url, {data: data}, {headers: {auth: localStorage.getItem('uid')}});
  } catch (error) {
    console.error(error);
  }
};

export const saveAfterScoreFetch = async query => {
  try {
    
    const url = saveAfterScoreAPI;
    const data = {year: '2022', array_score: query};
    console.group('call api. method: POST, url:', url);
    console.log('request:[', data, ']');
    return axios.post(url, {data: data}, {headers: {auth: localStorage.getItem('uid')}});

    // return axios.post(url, {data: data}, {headers: {auth: localStorage.getItem('uid')}});
  } catch (error) {
    console.error(error);
  }
};

export const getSavedScoreFetch = async () => {
  try {
    // pages/api/csat/selectanalysis_7.js
    const url = selectanalysis_7API;
    const params = {division: 1, year: '2022'};
    console.group('call api. method: GET, url:', url);
    console.log('request:[', params, ']');

    return axios
      .get(url, {
        headers: {auth: localStorage.getItem('uid')},
        params: params,
      })
      .then(res => {
        if (res.data.success) {
          const response = {api: url, data: res.data?.data};
          console.log('response:[', response, ']');
          console.groupEnd();
        }

        return res;
      });
  } catch (error) {}
};

// // 제목 : 원점수로 표준점수, 백분위, 등급 산출
// export const scoreToGradeFetch = async () => {
//   return callGetMethod({
//     name: 'scoreToGradeFetch()',
//     url: scoreToGradeAPI,
//   });
// };

// 제목: 시험 과목 리스트 가져오기

export const selectSubjectFetch = async () => {
  return callGetMethod({
    name: 'selectSubjectFetch()',
    url: selectsubjectAPI,
  });
};

/**
 *  제목: 사용자가 저장한 과목만 조회
 *  샘플 param = {}
 */
export const getSavedUserSubjectFetch = async () => {
  try {
    const data = {
      // 내부
      year: '2022',
      division: 1,
    };
    return callGetMethod({
      name: 'getSavedUserSubjectFetch()',
      url: '/api/csat/beforetest/getsubjectbymemberid',
      data: data,
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 *  제목: 원점수로 표준편차,백분율,등급 계산
 *  샘플 param = {}
 */
export const getCalculatedSubjectScoreFromOrgScore = async params => {
  try {
    const data = {
      // 내부
      year: '2023',
      division: 1,
      // 외부
      subject: params.subject,
      score: params.score,
      common_score: params.is_common ? params.common_score : 999,
    };
    return callGetMethod({
      name: 'getCalculatedSubjectScoreFromOrgScore()',
      url: '/api/csat/beforetest/orgscoretocalculatedscore',
      data: data,
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 *  제목: 대학 중요도
 *  샘플 param = {}
 */
export const getImportantList = async params => {
  try {
    const data = {
      mapping_cd: params.mapping_cd,
      univ_sub_code: params.univ_sub_code,
    };
    return callGetMethod({
      name: 'getImportantList()',
      url: '/api/csat/utils/getunivimportant',
      data: data,
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 *  제목: 수시 지원 대학 선택 결과를 삭제
 *  샘플 param = {}
 */
export const removeOccasionalApply = async params => {
  try {
    const data = {
      occasional_id: params.occasional_id,
    };
    return callDeleteMethod({
      name: 'removeOccasionalApply()',
      url: '/api/csat/occasional/deleteoccasionalapply',
      data: data,
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 *  제목: 수시 지원 대학 선택 결과를 조회
 *  샘플 param = {}
 */
export const getOccasionalApply = async () => {
  try {
    const data = {};
    return callGetMethod({
      name: 'GetOccasionalApply()',
      url: '/api/csat/occasional/getoccasionalapply',
      data: data,
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 *  제목: 수시 지원 대학 선택 결과를 조회. (정시 내 점수를 포함)
 *  샘플 param = {}
 */
export const getOccasionalApplyAndCalculateScore = async () => {
  try {
    return callGetMethod({
      name: 'GetOccasionalApplyAndCalculateScore()',
      url: '/api/csat/occasional/getoccasionalapply',
      data: {},
    })
      .then(res => {
        return getSavedScoreFetch().then(result => {
          res.data.myScore = result.data?.data;
          return res;
        });
      })
      .then(async res => {
        const returnList = await Promise.all(res.data?.data.map(elem => getOntimeData(res, elem)));
        return {res, returnList};
      })
      .then(({res, returnList}) => {
        res.data.data = returnList;

        return res;
      }); // end
  } catch (error) {
    console.error(error);
  }
};

const getOntimeData = async (res, elem) => {
  let _elem = _.cloneDeep(elem);
  await getCalculatedConvertScoreByOccasional({
    univ_nm: elem.univ_nm,
    major_line_cd: elem.major_line_cd,
    major_nm: elem.major_nm,
    myScore: res.data.myScore,
  }).then(data => {
    const _data = _.cloneDeep(data);
    if (data && data.length > 0) {
      const calculate_score = Math.round(_data[0].calculate_score * 100) / 100.0;
      const cumulative = Math.round(_data[0].cumulative * 100) / 100.0;
      const cut_70 = Math.round(_data[0].cut_70_first * 100) / 100.0;
      const cut_70_topaccu = Math.round(_data[0].cut_70_topaccu * 100) / 100.0;
      _elem.ontime_myscore = calculate_score
      _elem.ontime_myscore_percent = cumulative;
      _elem.ontime_last_cut = cut_70
      _elem.ontime_last_cut_percent = cut_70_topaccu
      _elem.ontime_myscore_diff = Math.round((calculate_score - cut_70) * 100) / 100.0;
      _elem.ontime_myscore_percent_diff = Math.round((cumulative - cut_70_topaccu) * 100) / 100.0;
      _elem = _.cloneDeep(_elem);
    } else {
//      _elem.ontime_myscore = 100;
//      _elem.ontime_myscore_percent = 92.01;
//      _elem.ontime_last_cut = 99.03;
//      _elem.ontime_last_cut_percent = 91.32;
//      _elem.ontime_myscore_diff = 0.97;
//      _elem.ontime_myscore_percent_diff = 0.69;
//      _elem = _.cloneDeep(_elem);
    }
  });
  return _elem;
};

/**
 *  제목: 대학 리스트 조회
 *  샘플 param = {}
 */
export const getUnivList = async () => {
  try {
    const data = {};
    return callGetMethod({
      name: 'getUnivList()',
      url: '/api/csat/utils/getunivlist',
      data: data,
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 *  제목: 사용자가 입력한 내용과 계산된 표준편차,백분율 등을 저장
 *  샘플 param = {}
 */
export const saveCalculatedSubjectScoreList = async params => {
  try {
    // is_common=false인 경우, common_score, common_subject를 999로 변환
    params.forEach((elem, index) => {
      (elem.cumulative = elem.cumulative?.trim()),
        (elem.common_score = elem.is_common ? elem.common_score : '999');
      elem.common_subject = elem.is_common ? findCommonSubject(elem.subject) : '999';
    });
    const data = {
      // 내부
      year: '2022',
      division: 1,
      // 외부
      data: params,
    };
    return callPostMethod({
      name: 'saveCalculatedSubjectScoreList()',
      url: '/api/csat/beforetest/savecalculatedsubjectscorelist',
      data: data,
    }).then(res => {
        return savePersonConvertScore().then(() => {
            return res;
        });
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 *  제목: (구)사용자 성적 데이터로 대학전형별 점수를 계산하고 그 결과를 저장.
 */
export const saveScoreAnalysis = async () => {
  try {
    const data = {
      // 내부
      year: '2022',
      division: 1,
    };
    return callPostMethod({
      name: 'saveScoreAnalysis()',
      url: '/api/csat/beforetest/savescoreanalysis',
      data: data,
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 *  제목: 사용자 성적 데이터로 대학전형별 점수를 계산하고 그 결과를 저장.
 */
export const savePersonConvertScore = async () => {
  try {
    const data = {
      // 내부
      year: '2022',
      division: 1,
    };
    return callPostMethod({
      name: 'savePersonConvertScore()',
      url: '/api/csat/analysis/savepersonconvertscore',
      data: data,
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 *  제목: 수시 지원 대학 선택 결과를  저장.
 */
export const saveOccasionalApply = async params => {
  try {
    const data = {
      // 내부
      occasional_id: params.occasional_id,
    };
    return callPostMethod({
      name: 'saveOccasionalApply()',
      url: '/api/csat/occasional/saveoccasionalapply',
      data: data,
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 *  제목: 대학코드, 학과코드, 계열코드(문과,이과)로 대학 전형점수 조회
 *  샘플 param = {}
 */
export const getCalculatedConvertScoreByUniv = async params => {
  try {
    const data = {
      // 내부
      year: '2022',
      division: 1,
      // 외부
      major_line_cd: params.major_line_cd,
      gun_cd: params.gun_cd,
      univ_nm: params.univ_nm,
    };

    // 대학별 변환점수 조회
    return callGetMethod({
      name: 'getCalculatedConvertScoreByUniv()',
      url: '/api/csat/analysis/getconversionscorebyuniv',
      data: data,
    })
      .then(res => {
        const data = res.data.data;
        let map = new Map();

        // univ_sub_code별 점수가 탐구외, 탐구1, 탐구2로 나오는 것을 하나의 키(univ_sub_code)로 취합
        data?.forEach((elem, index) => {
          if (map.get(elem.univ_sub_code) == null) {
            let array = [];
            array.push(elem);
            map.set(elem.univ_sub_code, array);
          } else {
            const array = map.get(elem.univ_sub_code);
            array.push(elem);
            map.set(elem.univ_sub_code, array);
          }
        });

        let resultMap = new Map();
        map.forEach((value, key, mapObject) => {
          // 대학별 계산식 적용 전, 1차 가공.
          collectConvertScore(value).then(score => {
            // 대학별 계산식 적용.
            const dataMap = {};
            dataMap.calculate_score = calculatedConvertScore(score, params.myScore);
            resultMap.set(key, dataMap);
          });
        });
        return resultMap;
      })
      .then(score_codes_map => {
        const data2 = {
          univ_sub_codes: Array.from(score_codes_map.keys())?.join(','),
          major_line_cd: params.major_line_cd
        };
        return callGetMethod({
          name: 'getCumulativeByUnivsubcode()',
          url: '/api/csat/analysis/getcumulativebyunivsubcode',
          data: data2,
        }).then(res => {
          const cumulative_list = res.data.data;
          console.log('cumulative_list',cumulative_list);
       
          const cumulative_map = new Map();
          cumulative_list !== null && cumulative_list.forEach((elem, index) => {
            if (cumulative_map.get(elem.univ_sub_code) == null) {
                let array = [];
                array.push(elem);
                cumulative_map.set(elem.univ_sub_code, array);
            } else {
                const array = cumulative_map.get(elem.univ_sub_code);
                array.push(elem);
                cumulative_map.set(elem.univ_sub_code, array);
            }
          })
          score_codes_map.forEach((score_map, key, mapObject) => {
            const selected_cumulative_list = []
            cumulative_map.get(key)?.forEach((elem, index) => {
                if(key == elem.univ_sub_code && score_map.calculate_score > elem.conversion_score) {
                    selected_cumulative_list.push({
                        cumulative: parseFloat(elem.cumulative),
                        standard_sum: parseFloat(elem.standard_sum),
                        standard_sum_cumulative: parseFloat(elem.standard_sum_cumulative)
                    })
                }
            });
            let cumulative_min = 100.0
            let standard_sum = 0
            let standard_sum_cumulative = 100.0

            selected_cumulative_list.forEach((elem, index) => {
                if(cumulative_min > elem.cumulative) {
                    cumulative_min = elem.cumulative;
                    standard_sum = elem.standard_sum;
                    standard_sum_cumulative = elem.standard_sum_cumulative;
                }
            });
            score_map.cumulative = cumulative_min
            score_map.standard_sum = standard_sum
            score_map.standard_sum_cumulative = standard_sum_cumulative
          });
          return score_codes_map;
        });
      })
      .then(map => {
        const data = {
          univ_nm: params.univ_nm,
          major_line_cd: params.major_line_cd,
          gun_cd: params.gun_cd,
        };
        return callGetMethod({
          name: 'getCutlineScoreByUniv()',
          url: '/api/csat/analysis/getcutlinescorebyuniv',
          data: data,
        }).then(res => {
          const major_list = res.data.data;
          major_list?.forEach((elem, index) => {
            elem.cumulative = String(map?.get(elem.univ_sub_code)?.cumulative)
            elem.standard_sum = String(map?.get(elem.univ_sub_code)?.standard_sum)
            elem.standard_sum_cumulative = String(map?.get(elem.univ_sub_code)?.standard_sum_cumulative)
            elem.calculate_score = String(map?.get(elem.univ_sub_code)?.calculate_score)
          });
          console.log("major_list",major_list)
          return major_list;
        });
      });
  } catch (error) {
    console.error(error);
  }
};

/**
 *  제목: 대학코드, 학과코드, 계열코드(문과,이과)로 대학 전형점수 조회
 *  샘플 param = {}
 */
export const getCalculatedConvertScoreByMajor = async params => {
  try {
    const data = {
      // 내부
      year: '2022',
      division: 1,
      // 외부
      major_line_cd: params.major_line_cd,
      gun_cd: params.gun_cd,
      depart_nms: params.depart_nms,
    };
    return callGetMethod({
      name: 'getCalculatedConvertScoreByMajor()',
      url: '/api/csat/analysis/getconversionscorebymajor',
      data: data,
    })
      .then(res => {
        const data = res.data.data;
        let map = new Map();
        data?.forEach((elem, index) => {
          if (map.get(elem.univ_sub_code) == null) {
            let array = [];
            array.push(elem);
            map.set(elem.univ_sub_code, array);
          } else {
            const array = map.get(elem.univ_sub_code);
            array.push(elem);
            map.set(elem.univ_sub_code, array);
          }
        });
        let resultMap = new Map();
        map.forEach((value, key, mapObject) => {
          // 대학별 계산식 적용 전, 1차 가공.
          collectConvertScore(value).then(score => {
            // 대학별 계산식 적용.
            const dataMap = {};
            dataMap.calculate_score = calculatedConvertScore(score, params.myScore);
            resultMap.set(key, dataMap);
          });
        });
        return resultMap;
      })
      .then(score_codes_map => {
          const data2 = {
            univ_sub_codes: Array.from(score_codes_map.keys())?.join(',')
          };
          return callGetMethod({
            name: 'getCumulativeByUnivsubcode()',
            url: '/api/csat/analysis/getcumulativebyunivsubcode',
            data: data2,
          }).then(res => {
            const cumulative_list = res.data.data;
            score_codes_map.forEach((score_map, key, mapObject) => {
              const selected_cumulative_list = []
              cumulative_list.forEach((elem, index) => {
                  if(key == elem.univ_sub_code && score_map.calculate_score > elem.conversion_score) {
                      selected_cumulative_list.push(parseFloat(elem.cumulative))
                  }
              });
              let cumulative_min = 100.0
              selected_cumulative_list.forEach((elem, index) => {
                  if(cumulative_min > elem) cumulative_min = elem;
              });
              score_map.cumulative = cumulative_min
            });
            return score_codes_map;
          });
        })
      .then(map => {
        return callGetMethod({
          name: 'getCutlineScoreByMajor()',
          url: '/api/csat/analysis/getcutlinescorebymajor',
          data: data,
        }).then(res => {
          const major_list = res.data.data;
          major_list?.forEach((elem, index) => {
            elem.cumulative = String(map?.get(elem.univ_sub_code)?.cumulative)
            elem.calculate_score = String(map?.get(elem.univ_sub_code)?.calculate_score)
          });
          return major_list;
        });
      });
  } catch (error) {
    console.error(error);
  }
};

/**
 *  제목: 대학코드, 학과코드, 계열코드(문과,이과)로 대학 전형점수 조회
 *  샘플 param = {}
 */
export const getCalculatedConvertScoreByOccasional = async params => {
  try {
    console.log('backend call. method: getCalculatedConvertScoreByOccasional(). params:', params);
    const data = {
      // 내부
      year: '2022',
      division: 1,
      // 외부
      major_line_cd: params.major_line_cd,
      univ_nm: params.univ_nm,
      major_nm: params.major_nm,
    };
    //    console.log("2 input data..",data)

    // 1차 계산된 대학별 변환 점수
    return callGetMethod({
      name: 'getCalculatedConvertScoreByOccasional()',
      url: '/api/csat/analysis/getconversionscorebyoccasional',
      data: data,
    })
      .then(res => {
        const data = res.data.data;
//        console.log('getCalculatedConvertScoreByOccasional() data...', data);
        let map = new Map();

        // 대학 이름으로 조회한 경우, 하나 이상의 모집군이 검색될 수 있다.
        data?.forEach((elem, index) => {
          if (map.get(elem.univ_sub_code) == null) {
            let array = [];
            array.push(elem);
            map.set(elem.univ_sub_code, array);
          } else {
            const array = map.get(elem.univ_sub_code);
            array.push(elem);
            map.set(elem.univ_sub_code, array);
          }
        });

        let resultMap = new Map();
        map.forEach((value, key, mapObject) => {
          // 대학별 계산식 적용 전, 1차 가공.
          collectConvertScore(value).then(score => {
            // 대학별 계산식 적용.
            const dataMap = {};
            dataMap.calculate_score = calculatedConvertScore(score, params.myScore);
            resultMap.set(key, dataMap);
          });
        });
        return resultMap;
      })
      .then(score_codes_map => {
          const data2 = {
            univ_sub_codes: Array.from(score_codes_map.keys())?.join(',')
          };
          return callGetMethod({
            name: 'getCumulativeByUnivsubcode()',
            url: '/api/csat/analysis/getcumulativebyunivsubcode',
            data: data2,
          }).then(res => {
            const cumulative_list = res.data.data;
            score_codes_map.forEach((score_map, key, mapObject) => {
              const selected_cumulative_list = []
              cumulative_list.forEach((elem, index) => {
    //                console.log(key, elem.univ_sub_code, score_map.calculate_score, elem.conversion_score)
                  if(key == elem.univ_sub_code && score_map.calculate_score > elem.conversion_score) {
                      selected_cumulative_list.push(parseFloat(elem.cumulative))
                  }
              });
              let cumulative_min = 100.0
              selected_cumulative_list.forEach((elem, index) => {
                  if(cumulative_min > elem) cumulative_min = elem;
              });
              score_map.cumulative = cumulative_min
            });
            console.log("score_codes_map",score_codes_map)
            return score_codes_map;
          });
      })
      .then(map => {
        const data = {
          univ_nm: params.univ_nm,
          major_line_cd: params.major_line_cd,
          major_nm: params.major_nm,
        };
        return callGetMethod({
          name: 'getCutlineScoreByOccasional()',
          url: '/api/csat/analysis/getcutlinescorebyoccasional',
          data: data,
        }).then(res => {
          const major_list = res.data.data;
          major_list?.forEach((elem, index) => {
            elem.cumulative = String(map?.get(elem.univ_sub_code)?.cumulative)
            elem.calculate_score = String(map?.get(elem.univ_sub_code)?.calculate_score)
          });
          return major_list;
        });
      });
  } catch (error) {
    console.error(error);
  }
};

/**
 *  제목: 대학별 학과 커트라인 점수
 *  샘플 param = {}
 */
export const getCutlineScoreByUniv = async params => {
  try {
    const data = {
      // 내부
      year: '2022',
      division: 1,
      // 외부
      univ_id: params.univ_id,
      major_line_cd: params.major_line_cd,
    };
    return callGetMethod({
      name: 'getCutlineScoreByUniv()',
      url: '/api/csat/analysis/getcutlinescorebyuniv',
      data: data,
    }).then(res => {
      console.log('res', res);
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 *  제목: 대학별 학과 커트라인 점수
 *  샘플 param = {}
 */
export const getUnivSubCodeListByRegion = async params => {
  try {
    const data = {
      // 내부
      year: '2022',
      division: 1,
      // 외부
      area_cd: params.area_cd,
      major_line_cd: params.major_line_cd,
    };
    return callGetMethod({
      name: 'getUnivSubCodeListByRegion()',
      url: '/api/csat/analysis/getunivsubcodelistbyregion',
      data: data,
    }).then(res => {
      return res;
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 *  제목: 수시 대학,전형, 모집단위 조회
 *  샘플 param = {}
 */
export const getOccasionalUnivList = async params => {
  try {
    const data = {
      // 외부
      univ_nm: params.univ_nm,
      recruit_contents: params.recruit_contents,
      recruit_type: params.recruit_type,
    };
    return callGetMethod({
      name: 'getOccasionalUnivList()',
      url: '/api/csat/occasional/getoccasionalunivlist',
      data: data,
    }).then(res => {
      return res;
    });
  } catch (error) {
    console.error(error);
  }
};



// 과목코드가 6, 7로 시작하는 경우, 각각 60, 70을 반환. 나머지는 999를 반환
const findCommonSubject = subject => {
  switch (subject?.substr(0, 1)) {
    case '6':
      return '60';
    case '7':
      return '70';
    default:
      return '999';
  }
};

/**
 *  공통 기능
 */
// GET Method 공통
export const callGetMethod = async request => {
  try {
    logger.group('call. method:', request.name);
    logger.log('request:[', request.data, ']');
    return axios
      .get(request.url, {
        headers: {auth: localStorage.getItem('uid')},
        params: request.data,
      })
      .then(res => {
        if (res.data.success) {
          const response = {name: request.name, data: res.data?.data, params: request.data};
          logger.log('response:[', response, ']');
          logger.groupEnd();
          res.data.params = request.data;
        }
        return res;
      });
  } catch (error) {
    console.error(error);
  }
};

/**
 *  공통 기능
 */
// GET Method 공통
export const callDeleteMethod = async request => {
  try {
    console.group('backend call. method:', request.name);
    console.log('request:[', request.data, ']');
    return axios
      .delete(request.url, {
        headers: {auth: localStorage.getItem('uid')},
        params: request.data,
      })
      .then(res => {
        if (res.data.success) {
          const response = {name: request.name, data: res.data?.data};
          console.log('response:[', response, ']');
          console.groupEnd();
          res.data.params = request.data;
        }
        return res;
      });
  } catch (error) {
    console.error(error);
  }
};

// POST Method 공통
export const callPostMethod = async request => {
  try {
    console.group('backend call. method:', request.name);
    console.log('request:[', request.data, ']');
    return axios
      .post(
        request.url,
        {
          data: request.data,
        },
        {
          headers: {auth: localStorage.getItem('uid')},
        },
      )
      .then(res => {
        const response = {name: request.name, success: res.data?.success, params: request.data};
        console.log('response:[', response, ']');
        console.groupEnd();
        res.data.params = request.data;
        return res;
      })
      .catch(err => {
        return err;
      });
  } catch (error) {
    console.error(error);
  }
};

export const saveAfterScore = async request => {
  try {
   console.log('req');
    return axios
      .delete(request.url, {
        headers: {auth: localStorage.getItem('uid')},
        params: request.data,
      })
      .then(res => {
        if (res.data.success) {
          const response = {name: request.name, data: res.data?.data};
          console.log('response:[', response, ']');
          console.groupEnd();
          res.data.params = request.data;
        }
        return res;
      });
  } catch (error) {
    console.error(error);
  }
}


function copyObj(obj) {
  const result = {};

  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      result[key] = copyObj(obj[key]);
    } else {
      result[key] = obj[key];
    }
  }

  return result;
}
