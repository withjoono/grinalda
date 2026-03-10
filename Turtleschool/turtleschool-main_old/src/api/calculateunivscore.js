

export const calculatedConvertScore = (score, myScore) => {
  //    console.log("score calc",score, myScore)
  //    console.log("전형번호",score.univ_sub_code)
  const calculate_cd = score.calculate_cd;
  //    const list_222 = [456,345,789,234,567,910,678]
  //    large3(list_222)
  //  임시로 1번으로 통일
  //    const calculate_cd = '1'
  const kor = parseInt(score.kor.conversion_score);
  const mat = parseInt(score.mat.conversion_score);
  const eng = parseInt(score.eng.conversion_score);
  const res_sum = parseInt(score.res.conversion_score.sum);
  const res_avg = parseInt(score.res.conversion_score.avg);
  const res_max = parseInt(score.res.conversion_score.max);
  const kst = parseInt(score.kst.conversion_score);

  // 미적 & 기하
  let mat_type_1 = false;
  // 과탐
  let rec_sci = false;
  // 과탐(화학2 or 생명과학2)
  let rec_sci_type_1 = false;
  // 사탐
  let rec_soc = false;
  let rec_soc_count = 0;
  let rec_sci_count = 0;
  myScore.forEach((elem, index) => {
    if (elem.lar_subject_cd == 7) {
      if (elem.subject_a == '7F' || elem.subject_a == '7I') {
        mat_type_1 = true;
      }
    }
    // 탐구
    if (elem.lar_subject_cd == 1) {
      rec_soc = true;
      rec_soc_count += 0;
    } else if (elem.lar_subject_cd == 2) {
      if (elem.subject_a == '2F' || elem.subject_a == '2J') {
        rec_sci_type_1 = true;
      }
      rec_sci_count += 0;
      rec_sci = true;
    }
  });
  let mat_score = 0;
  let rec_score = 0;

  switch (calculate_cd) {
    case '1':
      console.log('1번 계산식. 국어 + 수학 + 영어 + 한국사 + 탐구', kor, mat, eng, kst, res_sum);
      // 국어 + 수학 + 영어 + 한국사 + 탐구
      return kor + mat + eng + kst + res_sum;
      break;
    case '11':
      console.log(
        '11번 계산식. 국어 + 수학 + 영어 + 한국사 + 탐구 + 120',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      // 국어 + 수학 + 영어 + 한국사 + 탐구
      return kor + mat + eng + kst + res_sum + 120;
      break;
    case '12':
      console.log(
        '12번 계산식. 국어 + 수학 + 영어 + 한국사 + 탐구 + 135',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      // 국어 + 수학 + 영어 + 한국사 + 탐구
      return kor + mat + eng + kst + res_sum + 135;
      break;
    case '13':
      console.log(
        '13번 계산식. 국어 + 수학 + 영어 + 한국사 + 탐구 + 800',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      // 국어 + 수학 + 영어 + 한국사 + 탐구
      return kor + mat + eng + kst + res_sum + 800;
      break;
    case '17':
      console.log(
        '17번 계산식. 국어 x 2.5 + 수학 x 3 + 영어 + 한국사 + 탐구 x 2.5',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      // 국어 + 수학 + 영어 + 한국사 + 탐구
      return kor * 2.5 + mat * 3 + eng + kst + res_sum * 2.5;
      break;
    case '211':
      console.log(
        '211번 계산식. MAX(국어, 수학, 영어) + LARGE2(국어, 수학, 영어) + 탐구 + 한국사',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return max3(kor, mat, eng) + large2([kor, mat, eng]) + kst + res_sum;
      break;
    case '212':
      console.log(
        '212번 계산식. MAX(국어, 수학, 영어, 탐구) + LARGE2(국어, 수학, 영어, 탐구) + 한국사',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return max4(kor, mat, eng, res_sum) + large2([kor, mat, eng, res_sum]) + kst;
      break;
    case '213':
      console.log(
        '213번 계산식. MAX(국어, 수학, 영어, 탐구) + LARGE2(국어, 수학, 영어, 탐구) + LARGE3(국어, 수학, 영어, 탐구) + 한국사',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return (
        max4(kor, mat, eng, res_sum) +
        large2([kor, mat, eng, res_sum]) +
        large3([kor, mat, eng, res_sum]) +
        kst
      );
      break;
    case '214':
      console.log(
        '214번 계산식. MAX(국어, 수학, 영어, 탐구) + LARGE2(국어, 수학, 영어, 탐구) + LARGE3(국어, 수학, 영어, 탐구) + 한국사 + 150',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return (
        max4(kor, mat, eng, res_sum) +
        large2([kor, mat, eng, res_sum]) +
        large3([kor, mat, eng, res_sum]) +
        kst +
        150
      );
      break;
    case '215':
      console.log(
        '215번 계산식. MAX(국어, 수학, 영어, 탐구) + LARGE2(국어, 수학, 영어, 탐구) + LARGE3(국어, 수학, 영어, 탐구) + 한국사 + 700 + 기하,미적의 10% 가산점',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      mat_score = 0
      if(mat_type_1) {
        mat_score = mat * 0.1
      }
      return (
        max4(kor, mat, eng, res_sum) +
        large2([kor, mat, eng, res_sum]) +
        large3([kor, mat, eng, res_sum]) +
        kst +
        700 +
        mat_score
      );
      break;
    case '221':
      console.log(
        '221번 계산식. MAX(국어, 수학, 영어) + LARGE2(국어, 수학, 영어) + LARGE3(국어, 수학, 영어) + 한국사 + 탐구',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return (
        max3(kor, mat, eng) * 3 +
        large2([kor, mat, eng]) * 3 +
        large3([kor, mat, eng]) * 1.5 +
        kst +
        res_sum
      );
      break;
    case '222':
      console.log(
        '222번 계산식. MAX(국어, 수학, 영어) x 6 + MAX(LARGE2(국어, 수학, 영어), 한국사, 탐구) x 4',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return max3(kor, mat, eng) * 6 + max3(large2([kor, mat, eng]), kst, res_sum) * 4;
      break;
    case '223':
      console.log(
        '223번 계산식. 국어 + MAX(수학, 영어, 탐구) x 3 + LARGE2(수학, 영어, 탐구) x 2.5 + LARGE3(수학, 영어, 탐구) x 1.5 + 한국사',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return (
        kor +
        max3(mat, eng, res_sum) * 3 +
        large2([mat, eng, res_sum]) * 2.5 +
        large3([mat, eng, res_sum]) * 1.5 +
        kst
      );
      break;
    case '224':
      console.log(
        '224번 계산식. MAX(국어, 수학, 영어, 탐구) x 4 + LARGE2(국어, 수학, 영어, 탐구) x 3 + LARGE3(국어, 수학, 영어, 탐구) x 2 + MIN(국어, 수학, 영어, 탐구)',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return (
        max4(kor, mat, eng, res_sum) * 4 +
        large2([kor, mat, eng, res_sum]) * 3 +
        large3([kor, mat, eng, res_sum]) * 2 +
        min4(kor, mat, eng, res_sum) * 1
      );
      break;
    case '225':
      console.log(
        '225번 계산식. MAX(국어, 수학, 영어, 탐구) x 1.6 + LARGE2(국어, 수학, 영어, 탐구) x 1.4 + LARGE3(국어, 수학, 영어, 탐구)',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return (
        max4(kor, mat, eng, res_sum) * 1.6 +
        large2([kor, mat, eng, res_sum]) * 1.4 +
        large3([kor, mat, eng, res_sum])
      );
      break;
    case '226':
      console.log(
        '226번 계산식. MAX(국어, 수학, 영어, 탐구) x 5 + LARGE2(국어, 수학, 영어, 탐구) x 3 + LARGE3(국어, 수학, 영어, 탐구) x 2 + 한국사',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return (
        max4(kor, mat, eng, res_sum) * 5 +
        large2([kor, mat, eng, res_sum]) * 3 +
        large3([kor, mat, eng, res_sum]) * 2 +
        kst
      );
      break;
    case '227':
      console.log(
        '227번 계산식. MAX(국어, 수학, 영어, 탐구) x 4 + LARGE2(국어, 수학, 영어, 탐구) x 3 + LARGE3(국어, 수학, 영어, 탐구) x 2 + MIN(국어, 수학, 영어, 탐구) x 1 + 한국사',
        kor, mat, eng, kst, res_sum);
      return (
        max4(kor, mat, eng, res_sum) * 4 +
        large2([kor, mat, eng, res_sum]) * 3 +
        large3([kor, mat, eng, res_sum]) * 2 +
        min4(kor, mat, eng, res_sum) * 1 +
        kst
      );
      break;
    case '228':
      console.log(
        '228번 계산식. 수학 + MAX(국어, 영어, 탐구1과목) x 3 + LARGE2(국어, 영어, 탐구1과목) x 2.5 + LARGE3(국어, 영어, 탐구1과목) x 1.5 + 한국사 + 미적,기하가 있으면 10프로 가산점',
        kor, mat, eng, kst, res_max);
      mat_score = 0;
      if(mat_type_1) {
        mat_score = mat * 0.1
      }
      return mat + (max3(kor, eng, res_max) * 3) + (large2([kor, eng, res_max]) * 2.5) + (large3([kor, eng, res_max]) * 1.5) + kst + mat_score;
      break;
    case '229':
      console.log(
        '229번 계산식',
        'MAX(국어, 수학, 영어, 탐구1과목) x 4.5 + LARGE2(국어, 수학, 영어, 탐구1과목) x 3.5 + LARGE3(국어, 수학, 영어, 탐구1과목) x 2 + 한국사',
        '미적,기하가 있으면서, 수학 점수가 LARGE3(국어, 수학, 영어, 탐구1과목)보다 크거나 같아야 10프로 가산점',
        kor, mat, eng, kst, res_max);
      mat_score = 0;
      if(mat_type_1 && mat >= large3([kor, mat, eng, res_max])) {
        mat_score = mat * 0.1
      }
      return (max4(kor, mat, eng, res_max) * 4.5) + (large2([kor, mat, eng, res_max]) * 3.5) + (large3([kor, mat, eng, res_max]) * 2) + kst + mat_score;
      break;
    case '2210':
      console.log(
        '2210번 계산식',
        'MAX(국어, 수학, 영어, 탐구1과목) x 4.5 + LARGE2(국어, 수학, 영어, 탐구1과목) x 3.5 + LARGE3(국어, 수학, 영어, 탐구1과목) x 2 + 한국사',
        kor, mat, eng, kst, res_max);
      return (max4(kor, mat, eng, res_max) * 4.5) + (large2([kor, mat, eng, res_max]) * 3.5) + (large3([kor, mat, eng, res_max]) * 2) + kst;
      break;
    case '2211':
      console.log(
        '2211번 계산식',
        'MAX(국어, 수학, 영어, 탐구1과목, 한국사) x 3 + LARGE2(국어, 수학, 영어, 탐구1과목, 한국사) x 2',
        kor, mat, eng, kst, res_sum);
      return (max5(kor, mat, eng, res_max, kst) * 3) + (large2([kor, mat, eng, res_max, kst]) * 2);
      break;
    case '23':
      console.log(
        '23번 계산식. MAX(국어, 수학, 영어) x 7 + MAX(LARGE2(국어, 수학, 영어), 탐구) x 3',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return max3(kor, mat, eng) + max(large2([kor, mat, eng]), res_sum);
      break;
    case '31':
      console.log(
        '31번 계산식. 국어 + 수학(미적,기하만) + 영어 + 한국사 + 과탐',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      mat_score = 0;
      rec_score = 0;
      if (mat_type_1) {
        mat_score = mat;
      }
      if (rec_sci) {
        rec_score = res_sum;
      }
      return kor + mat_score + eng + kst + rec_score;
      break;
    case '311':
      console.log(
        '311번 계산식. 국어 + 수학(미적,기하만) + 영어 + 한국사 + 사탐',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      mat_score = 0;
      rec_score = 0;
      if (mat_type_1) {
        mat_score = mat;
      }
      if (rec_soc) {
        rec_score = res_sum;
      }
      return kor + mat_score + eng + kst + rec_score;
      break;
    case '312':
      console.log(
        '312번 계산식. 국어 + 수학(미적,기하만) + 영어 + 과탐 MAX(1과목)[표점] * 2',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      mat_score = 0;
      rec_score = 0;
      if (mat_type_1) {
        mat_score = mat;
      }
      if (rec_sci) {
        rec_score = res_max * 2;
      }
      return kor + mat_score + eng + rec_score;
      break;
    case '313':
      console.log(
        '313번 계산식. 국어 + 수학(미적,기하만) + 영어 + 한국사 + 과탐 MAX(1과목)[백분위]',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      mat_score = 0;
      rec_score = 0;
      if (mat_type_1) {
        mat_score = mat;
      }
      if (rec_sci) {
        rec_score = res_max;
      }
      return kor + mat_score + eng + kst + rec_score;
      break;
    case '314':
      console.log(
        '314번 계산식. 국어 + 수학(미적,기하만) + 영어 + 한국사 + 과탐 + 800',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      mat_score = 0;
      rec_score = 0;
      if (mat_type_1) {
        mat_score = mat;
      }
      if (rec_sci) {
        rec_score = res_sum;
      }
      return kor + mat_score + eng + kst + rec_score + 800;
      break;
    case '315':
      console.log(
        '315번 계산식. 수학(미적,기하만) + 과탐 + MAX(국어, 영어) + 한국사',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      mat_score = 0;
      rec_score = 0;
      if (mat_type_1) {
        mat_score = mat;
      }
      if (rec_sci) {
        rec_score = res_sum;
      }
      return mat_score + rec_score + max(kor, eng) + kst;
      break;
    case '321':
      console.log('321번 계산식. 국어 + 수학 + 영어 + 한국사 + 사탐', kor, mat, eng, kst, res_sum);
      rec_score = 0;
      if (rec_soc) {
        rec_score = res_sum;
      }
      return kor + mat + eng + kst + rec_score;
      break;
    case '322':
      console.log(
        '322번 계산식. 국어 + 수학(미적,기하만) + 영어 + 한국사 + 탐구',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      mat_score = 0;
      if (mat_type_1) {
        mat_score = mat;
      }
      return kor + mat_score + eng + kst + res_sum;
      break;
    case '323':
      console.log(
        '323번 계산식. 수학(미적,기하만) + 영어 + MAX(국어, 탐구) + 한국사',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      mat_score = 0;
      if (mat_type_1) {
        mat_score = mat;
      }
      return mat_score + eng + max(kor, res_sum) + kst;
      break;
    case '324':
      console.log('324번 계산식. 국어 + 수학 + 영어 + 과탐 + 한국사', kor, mat, eng, kst, res_sum);
      rec_score = 0;
      if (rec_sci) {
        rec_score = res_sum;
      }
      return kor + mat + eng + rec_score + kst;
      break;
    case '325':
      console.log(
        '325번 계산식. 국어 + 수학 + 영어 + 사탐 + 한국사 + 800',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      rec_score = 0;
      if (rec_soc) {
        rec_score = res_sum;
      }
      return kor + mat + eng + rec_score + kst + 800;
      break;
    case '326':
      console.log(
        '326번 계산식. 수학 + 사탐 + MAX(국어, 영어) + 한국사',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      rec_score = 0;
      if (rec_soc) {
        rec_score = res_sum;
      }
      return mat + rec_score + max(kor, eng) + kst;
      break;
    case '341':
      console.log(
        '341번 계산식. 국어 + 수학 + 영어 + 탐구 + 한국사 + 과탐 과목당 가산점 10%',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      rec_score = 0;
      if (rec_sci) {
        rec_score = res_sum * 0.1;
      }
      return kor + mat + eng + res_sum + kst + rec_score;
      break;
    case '342':
      console.log(
        '342번 계산식. 국어 + 수학 + 영어 + 탐구 + 한국사 + AVG(과탐 백분위) * 5%',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      rec_score = 0;
      if (rec_sci) {
        rec_score = res_avg * 0.05;
      }
      return kor + mat + eng + res_sum + kst + rec_score;
      break;
    case '343':
      console.log(
        '343번 계산식. 국어 + 수학 + 영어 + 탐구 + 한국사 + MAX(과탐) 1과목 * 5%',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      rec_score = 0;
      if (rec_sci) {
        rec_score = res_max * 0.05;
      }
      return kor + mat + eng + res_sum + kst + rec_score;
      break;
    case '344':
      console.log(
        '344번 계산식. 국어 + 수학 + 영어 + 탐구 + 한국사 + (IF(화학2,생명과학2) AVG(과탐 백분위) * 7% ELSE AVG(과탐 백분위) * 5%)',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      rec_score = 0;
      if (rec_sci) {
        if (rec_sci_type_1) {
          rec_score = res_avg * 0.07;
        } else {
          rec_score = res_avg * 0.05;
        }
      }
      return kor + mat + eng + res_sum + kst + rec_score;
      break;
    case '345':
      console.log(
        '345번 계산식. 수학 + 영어 + 탐구 + 한국사 + 탐구2과목 가산점(10) + 미적분 가산점(10%)',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      rec_score = 0;
      if (rec_sci) {
        if (rec_sci_type_1) {
          rec_score = res_avg * 0.07;
        } else {
          rec_score = res_avg * 0.05;
        }
      }

      if (rec_sci_count > 1) {
        rec_score += 10;
      }

      return kor + mat + eng + res_sum + kst + rec_score;
      break;
    case '351':
      console.log(
        '351번 계산식. 국어 + 수학 + 영어 + 탐구 + 한국사 + 과탐 과목당 가산점 3%',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      rec_score = 0;
      if (rec_sci) {
        rec_score = res_sum * 0.03;
      }
      return kor + mat + eng + res_sum + kst + rec_score;
      break;
    case '352':
      console.log(
        '352번 계산식. 국어 + 수학 + 영어 + 탐구 + 한국사 + 과탐 과목당 가산점 2.5%',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      rec_score = 0;
      if (rec_sci) {
        rec_score = res_sum * 0.025;
      }
      return kor + mat + eng + res_sum + kst + rec_score;
      break;
    case '411':
      console.log(
        '411번 계산식. 국어 + SUM(수학, 영어, 탐구) - MIN(수학, 영어, 탐구) + 한국사',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return kor + (mat + eng + res_sum) - min3(mat, eng, res_sum) + kst;
      break;
    case '412':
      console.log(
        '412번 계산식. 수학 + SUM(국어, 영어, 탐구) - MIN(국어, 영어, 탐구) + 한국사',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return mat + (kor + eng + res_sum) - min3(kor, eng, res_sum) + kst;
      break;
    case '413':
      console.log(
        '413번 계산식. 영어 + SUM(국어, 수학, 탐구) - MIN(국어, 수학, 탐구) + 한국사',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return eng + (kor + mat + res_sum) - min3(kor, mat, res_sum) + kst;
      break;
    case '414':
      console.log(
        '414번 계산식. 탐구 + SUM(국어, 수학, 영어) - MIN(국어, 수학, 영어) + 한국사',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return res_sum + (kor + mat + eng) - min3(kor, mat, eng) + kst;
      break;
    case '415':
      console.log(
        '415번 계산식. SUM(국어, 수학, 영어, 탐구) - MIN(국어, 수학, 영어, 탐구) + 한국사',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return kor + mat + eng + res_sum - min4(kor + mat + eng + res_sum) + kst;
      break;
    case '416':
      console.log(
        '416번 계산식. 수학 + SUM(국어, 영어, 탐구) - MIN(국어, 영어, 탐구) + 한국사 + 150',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return mat + (kor + eng + res_sum) - min3(kor, eng, res_sum) + kst + 150;
      break;
    case '417':
      console.log(
        '417번 계산식. 수학 + SUM(국어, 영어, 탐구) - MIN(국어, 영어, 탐구) + 한국사 + 240',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return mat + (kor + eng + res_sum) - min3(kor, eng, res_sum) + kst + 240;
      break;
    case '418':
      console.log(
        '418번 계산식. 수학 + SUM(국어, 영어, 탐구) - MIN(국어, 영어, 탐구) + 한국사 + 700',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return mat + (kor + eng + res_sum) - min3(kor, eng, res_sum) + kst + 700;
      break;
    case '419':
      console.log(
        '419번 계산식. 수학 + SUM(국어, 영어, 탐구) - MIN(국어, 영어, 탐구) + 한국사 + 800',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return mat + (kor + eng + res_sum) - min3(kor, eng, res_sum) + kst + 800;
      break;
    case '51':
      console.log(
        '51번 계산식. MAX(국어, 수학) + 영어 + 한국사 + 탐구',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return max(kor, mat) + eng + kst + res_sum;
      break;
    case '511':
      console.log(
        '511번 계산식. 국어 + 영어 + MAX(수학, 탐구) + 한국사',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return kor + eng + max(mat, res_sum) + kst;
      break;
    case '512':
      console.log(
        '512번 계산식. 국어 + 영어 + MAX(수학, 탐구) + 한국사 + 90',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return kor + eng + max(mat, res_sum) + kst + 90;
      break;
    case '513':
      console.log(
        '513번 계산식. 영어 + 탐구 + MAX(국어, 수학) + 한국사',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return eng + res_sum + max(kor, mat) + kst;
      break;
    case '514':
      console.log(
        '514번 계산식. 수학 + 영어 + MAX(국어, 탐구) + 한국사',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return mat + eng + max(kor, res_sum) + kst;
      break;
    case '515':
      console.log(
        '515번 계산식. 수학 + 영어 + MAX(국어, 탐구) + 한국사 + 90',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return mat + eng + max(kor, res_sum) + kst + 90;
      break;
    case '516':
      console.log(
        '516번 계산식. 수학 + 영어 + MAX(국어, 탐구) + 한국사 + 700',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return mat + eng + max(kor, res_sum) + kst + 700;
      break;
    case '517':
      console.log(
        '517번 계산식. 수학 + MAX(국어, 영어, 탐구) + 한국사 ',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return mat + max3(kor, eng, res_sum) + kst;
      break;
    case '518':
      console.log('518번 계산식. 영어 + MAX(국어, 수학) + 한국사 ', kor, mat, eng, kst, res_sum);
      return mat + max3(kor, eng, res_sum) + kst;
      break;
    case '519':
      console.log(
        '519번 계산식. 탐구 + MAX(국어, 영어, 수학) + 한국사 ',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return res_sum + max3(kor, eng, mat) + kst;
      break;
    case '53':
      console.log(
        '53번 계산식. MAX(국어, 수학) + MAX(영어, 한국사) + 탐구',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return max(kor, mat) + max(eng, kst) + res_sum;
      break;
    case '54':
      console.log(
        '54번 계산식. MAX(영어, 한국사) + SUM(국어 + 수학 + 탐구) - MIN(국어 + 수학 + 탐구)',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return max(eng, kst) + sum3(kor, mat, res_sum) - min3(kor, mat, res_sum);
      break;
    case '55':
      console.log(
        '55번 계산식. 국어 + 수학 + 영어 + 탐구 + 한국사 + (MAX(과탐과목) x 0.1)',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      rec_score = 0;
      if (rec_sci) {
        rec_score = res_max;
      }
      return kor + mat + eng + res_sum + kst + rec_score * 0.1;
      break;
    case '581':
      console.log(
        '58번 계산식. MAX(국어, 수학) x 3.5 + MIN(국어, 수학) x 2.5 + 영어 + 한국사 + 탐구',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return max(kor, mat) * 3.5 + min(kor, mat) * 2.5 + eng + kst + res_sum;
      break;
    case '582':
      console.log(
        '58번 계산식. MAX(국어, 수학) x 3.5 + MIN(국어, 수학) x 2.5 + 영어 + 한국사 + (탐구 x 2)',
        kor,
        mat,
        eng,
        kst,
        res_sum,
      );
      return max(kor, mat) * 3.5 + min(kor, mat) * 2.5 + eng + kst + res_sum * 2;
      break;
    default:
      console.log('작업이 필요합니다. 코드번호:', calculate_cd, '전형번호:', score.univ_sub_code);
      return 0;
      break;
  }
};

export const max = (data1, data2) => {
  return data1 > data2 ? data1 : data2;
};
export const max3 = (data1, data2, data3) => {
  return data1 > data2 && data1 > data3 ? data1 : data3 > data2 ? data3 : data2;
};
export const max4 = (data1, data2, data3, data4) => {
  return data1 > data2 && data1 > data3 && data1 > data4
    ? data1
    : data2 > data3 && data2 > data4
    ? data2
    : data3 > data4
    ? data3
    : data4;
};

export const max5 = (data1, data2, data3, data4, data5) => {
  return data1 > data2 && data1 > data3 && data1 > data4 && data1 > data5
    ? data1
    : data2 > data3 && data2 > data4 && data2 > data5
    ? data2
    : data3 > data4 && data3 > data5
    ? data3
    : data4 > data5
    ? data4
    : data5;
};

export const min = (data1, data2) => {
  return data1 > data2 ? data2 : data1;
};
export const min3 = (data1, data2, data3) => {
  return data2 > data1 && data3 > data1 ? data1 : data2 > data3 ? data3 : data2;
};
export const min4 = (data1, data2, data3, data4) => {
  return data1 < data2 && data1 < data3 && data1 < data4
    ? data1
    : data2 < data3 && data2 < data4
    ? data2
    : data3 < data4
    ? data3
    : data4;
};

export const large2 = arr => {
  let first_largest = 0;
  let second_largest = 0;
  arr.forEach((elem, index) => {
    if (first_largest == 0) {
      first_largest = elem;
    } else {
      if (elem > first_largest) {
        second_largest = first_largest;
        first_largest = elem;
      } else {
        if (second_largest == 0) {
          second_largest = elem;
        } else {
          if (elem > second_largest) {
            second_largest = elem;
          }
        }
      }
    }
  });

  //    console.log('second_largest',second_largest)
  return second_largest;
};

export const large3 = arr => {
  let first_largest = 0;
  let second_largest = 0;
  let third_largest = 0;
  let temp = 0;
  arr.forEach((elem, index) => {
    if (first_largest == 0) {
      first_largest = elem;
    } else {
      if (elem > first_largest) {
        temp = second_largest;
        second_largest = first_largest;
        third_largest = temp;
        first_largest = elem;
      } else {
        if (second_largest == 0) {
          second_largest = elem;
        } else {
          if (elem > second_largest) {
            third_largest = second_largest;
            second_largest = elem;
          } else {
            if (third_largest == 0) {
              third_largest = elem;
            } else {
              if (elem > third_largest) {
                third_largest = elem;
              }
            }
          }
        }
      }
    }
  });

  //    console.log('third_largest',arr, third_largest)
  return second_largest;
};

export const sum = (data1, data2) => {
  return data1 + data2;
};
export const sum3 = (data1, data2, data3) => {
  return data1 + data2 + data3;
};

export const collectConvertScore = async data => {
  console.log('call collectConvertScore data:', data);
  const score = {};
  score.res = {};
  score.res.scores = [];
  data?.forEach((elem, index) => {
    if (elem.res_subject_cd == 0) {
      // 표준점수(국어,수학)
      score.kor = {
        standard_score: elem.kor_standard_score,
        percentage_score: elem.kor_percentage_score,
        rating_score: elem.kor_rating_score,
        conversion_score: elem.kor_conversion_score,
      };
      score.mat = {
        standard_score: elem.mat_standard_score,
        percentage_score: elem.mat_percentage_score,
        rating_score: elem.mat_rating_score,
        conversion_score: elem.mat_conversion_score,
      };
      score.eng = {
        //                    standard_score: elem.eng_standard_score,
        percentage_score: elem.eng_percentage_score,
        rating_score: elem.eng_rating_score,
        conversion_score: elem.eng_conversion_score,
      };
      score.kst = {
        //                    standard_score: elem.kst_standard_score,
        percentage_score: elem.kst_percentage_score,
        rating_score: elem.kst_rating_score,
        conversion_score: elem.kst_conversion_score,
      };
      score.fog = {
        //                    standard_score: elem.fog_standard_score,
        percentage_score: elem.fog_percentage_score,
        rating_score: elem.fog_rating_score,
        conversion_score: elem.fog_conversion_score,
      };
    } else {
      score.res.scores.push({
        standard_score: elem.res_standard_score,
        percentage_score: elem.res_percentage_score,
        rating_score: elem.res_rating_score,
        conversion_score: elem.res_conversion_score,
      });
    }
    let prev_standard_score = -9999;
    let prev_percentage_score = -9999;
    let prev_rating_score = -9999;
    let prev_conversion_score = -9999;

    score.res.scores.forEach((elem, index) => {
      let standard_score = parseInt(elem.standard_score);
      let percentage_score = parseInt(elem.percentage_score);
      let rating_score = parseInt(elem.rating_score);
      let conversion_score = parseFloat(elem.conversion_score);
      if (prev_standard_score == -9999) {
        prev_standard_score = standard_score;
        prev_percentage_score = percentage_score;
        prev_rating_score = rating_score;
        prev_conversion_score = conversion_score;
      } else {
        score.res.standard_score = {
          max: prev_standard_score > standard_score ? prev_standard_score : standard_score,
          min: prev_standard_score < standard_score ? prev_standard_score : standard_score,
          sum: prev_standard_score + standard_score,
          avg: (prev_standard_score + standard_score) / 2,
        };
        score.res.percentage_score = {
          max: prev_percentage_score > percentage_score ? prev_percentage_score : percentage_score,
          min: prev_percentage_score < percentage_score ? prev_percentage_score : percentage_score,
          sum: prev_percentage_score + percentage_score,
          avg: (prev_percentage_score + percentage_score) / 2,
        };
        score.res.rating_score = {
          max: prev_rating_score > rating_score ? prev_rating_score : rating_score,
          min: prev_rating_score < rating_score ? prev_rating_score : rating_score,
          sum: prev_rating_score + rating_score,
          avg: (prev_rating_score + rating_score) / 2,
        };
        score.res.conversion_score = {
          max: prev_conversion_score > conversion_score ? prev_conversion_score : conversion_score,
          min: prev_conversion_score < conversion_score ? prev_conversion_score : conversion_score,
          sum: prev_conversion_score + conversion_score,
          avg: (prev_conversion_score + conversion_score) / 2,
        };
      }
    });
    score.calculate_cd = elem.calculate_cd;
    score.univ_sub_code = elem.univ_sub_code;
  });
  return score;
};