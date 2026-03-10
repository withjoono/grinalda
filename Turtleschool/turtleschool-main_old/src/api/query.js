import {QueriesOptions, useQuery, UseQueryOptions, UseQueryResult} from 'react-query';
import {adminUserFetch} from './admin';
import {
  getOccasionalApply,
  getOccasionalApplyAndCalculateScore,
  getSavedUserSubjectFetch,
  getUnivList,
  selectSubjectFetch,
} from './csat';
import {paymentFetch} from './pay';

export const usePayment = options => useQuery('payment', paymentFetch, options);

export const useUserFetch = (id, options) => useQuery('user', () => adminUserFetch(id), options);

export const useSelectSubjectFetch = options =>
  useQuery('selectSubjects', () => selectSubjectFetch(), options);

export const useSavedUserSubjectsFetch = options =>
  useQuery('savedUserSubjects', () => getSavedUserSubjectFetch(), options);

export const useSavedScoreFetch = options =>
  useQuery('savedUserSubjects', () => getSavedUserSubjectFetch(), options);

export const useGetUnivListFetch = options => useQuery('univList', () => getUnivList(), options);

export const useGetOccasionalApply = options =>
  useQuery('occasionalApplyList', () => getOccasionalApply(), options);

export const useGetOccasionalApplyAndCalculateScore = options =>
  useQuery('getOccasionalApplyAndCalculateScore', getOccasionalApplyAndCalculateScore, options);
