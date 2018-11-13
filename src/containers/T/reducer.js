import { fromJS } from 'immutable';
import commonConf from 'config/main.conf';
import { CREATE, FATCH_ACTION_SUCCESS_PREFIX } from 'utils/constants';
import {
  UPDATE_ENTITY_MODAL,
  UPDATE_SEARCH_CONDITION,
  GET_DATA_LIST,
} from './constants';

const initialState = fromJS({
  searchCondition: {
    // 这里推荐枚举出所有Field的初始值
    name: '',
    age: '',
  },
  entityModal: {
    type: CREATE,
    show: false,
    data: {},
  },
  tableData: [],
  pagination: {
    pageSize: commonConf.table.defaultPageSize,
    total: 100,
    current: 1,
  },
});

function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ENTITY_MODAL:
      return state
        .set('entityModal', fromJS(action.payload));
    case UPDATE_SEARCH_CONDITION:
      return state
        .set('searchCondition', fromJS(action.payload));

    case `${FATCH_ACTION_SUCCESS_PREFIX}${GET_DATA_LIST}`:
      if (action.payload && action.payload.data && action.payload.data.list) {
        return state
          .set('tableData', fromJS(action.payload.data.list))
          .setIn(['pagination', 'total'], action.payload.data.total)
          .setIn(['pagination', 'page'], action.payload.data.page);
      }
      return state;
    default:
      break;
  }
  return state;
}

export default reducer;
