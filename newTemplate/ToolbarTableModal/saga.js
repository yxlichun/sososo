/**
 * 使用saga进行流程处理；
 */

import {
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';

import { FATCH_ACTION_SUCCESS_PREFIX, FATCH_ACTION_ERROR_PREFIX } from 'utils/constants';
import { loadingDataError } from '../../state/actions';
import { getDataList } from './actions';
import { POST_FORM_DATA } from './constants';

export function* postSuccess() {
  try {
    yield put(getDataList());
  } catch (err) {
    yield put(loadingDataError(err));
  }
}

export function* watcher(type, process) {
  yield takeLatest(type, process);
}
/**
 * Root saga manages watcher lifecycle
 */
export default function* rootSaga() {
  yield [
    call(() => watcher(`${FATCH_ACTION_SUCCESS_PREFIX}${POST_FORM_DATA}`, postSuccess)),
    call(() => watcher(`${FATCH_ACTION_ERROR_PREFIX}${POST_FORM_DATA}`, postSuccess)),
  ];
}
