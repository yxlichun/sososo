import { createSelector } from 'reselect';
import { NAMESPACE } from './constants';

const selectNamespace = state => state.get(NAMESPACE);

export const selectSearchCondition = createSelector(
  selectNamespace,
  subState => subState.get('searchCondition').toJS(),
);

export const selectPagination = createSelector(
  selectNamespace,
  subState => subState.get('pagination').toJS(),
);

export const selectEntityModal = createSelector(
  selectNamespace,
  subState => subState.get('entityModal').toJS(),
);

export const selectTableData = createSelector(
  selectNamespace,
  subState => subState.get('tableData').toJS(),
);

export default {};
