import { fromJS } from 'immutable';
import commonConf from 'config/main.conf';

const initialState = fromJS({
  searchCondition: {
    name: 'lichun',
    age: '',
  },
  mainData: [{
    id: 1,
    name: '李淳',
    age: 18,
  }, {
    id: 2,
    name: '凤凤',
    age: 88,
  }, {
    id: 3,
    name: '天晴',
    age: 99,
  }, {
    id: 4,
    name: '肚肚疼',
    age: 10,
  }],
  pagination: {
    pageSize: commonConf.table.defaultPageSize,
    total: 100,
    current: 1,
  },
});

function reducer(state = initialState, action) {
  switch (action.type) {
    default:
      break;
  }
  return state;
}

export default reducer;
