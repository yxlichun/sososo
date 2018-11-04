import {
  UPDATE_SEARCH_CONDITION,
  GET_DATA_LIST,
  POST_FORM_DATA,
} from './constants';

import { getDataListService, postFormDataService } from './services';
import { showLoading } from '../../state/actions';

export function updateSearchCondition(payload) {
  return {
    type: UPDATE_SEARCH_CONDITION,
    payload,
  };
}

export function getDataList(params) {
  return {
    type: GET_DATA_LIST,
    service: getDataListService,
    loadingAction: showLoading,
    params,
  };
}

export function postFormData(params) {
  return {
    type: POST_FORM_DATA,
    service: postFormDataService,
    params,
  };
}

export default {};
