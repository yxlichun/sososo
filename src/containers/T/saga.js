/**
 * 使用saga进行流程处理；
 */

import {
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';

import { FATCH_ACTION_SUCCESS_PREFIX, FATCH_ACTION_ERROR_PREFIX, CREATE } from 'utils/constants';
import { loadingDataError } from '../../state/actions';
import { getDataList, updateEntityModal } from './actions';
import { POST_CREATE_ENTITY, POST_EDIT_ENTITY } from './constants';
import { selectSearchCondition, selectPagination } from './selectors';

export function* createEditSuccess() {
  try {
    yield put(updateEntityModal({
      type: CREATE,
      show: false,
      data: {},
    }));
    const searchCondition = yield select(selectSearchCondition);
    const pagination = yield select(selectPagination);
    yield put(getDataList({
      ...searchCondition,
      page: pagination.current,
      perpage: pagination.pageSize,
    }));
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
    call(() => watcher(`${FATCH_ACTION_SUCCESS_PREFIX}${POST_CREATE_ENTITY}`, createEditSuccess)),
    call(() => watcher(`${FATCH_ACTION_SUCCESS_PREFIX}${POST_EDIT_ENTITY}`, createEditSuccess)),
  ];
}
