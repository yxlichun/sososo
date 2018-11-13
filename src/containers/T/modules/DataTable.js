import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  Button,
} from 'antd';

import { createStructuredSelector } from 'reselect';
import connectFactory from 'utils/connectFactory';
import { EDIT } from 'utils/constants';

import { NAMESPACE } from '../constants';
import { getDataList, updateEntityModal } from '../actions';
import { selectPagination, selectSearchCondition, selectTableData } from '../selectors';
import { selectLoading } from '../../../state/selectors';

const withConnect = connectFactory(NAMESPACE);

@withConnect(
  // 可以使用者两种方式mapstatetoprops 但是推荐使用select的方式，经测会减少渲染次数，性能较好；
  // (globalState, state) => ({
  //   tableData: state.get('tableData').toJS(),
  //   pagination: state.get('pagination').toJS(),
  //   searchCondition: state.get('searchCondition').toJS(),
  //   loading: globalState.getIn(['global', 'loading']),
  // }),
  createStructuredSelector({
    tableData: selectTableData,
    pagination: selectPagination,
    searchCondition: selectSearchCondition,
    loading: selectLoading,
  }),
  {
    getDataList,
    updateEntityModal,
  },
)
class DataTable extends React.Component {
  // 静态变量，propTypes一定是静态变量，是挂载在类上的；
  static propTypes = {
    tableData: PropTypes.array.isRequired,
    pagination: PropTypes.object.isRequired,
    getDataList: PropTypes.func.isRequired,
    updateEntityModal: PropTypes.func.isRequired,
    searchCondition: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  // 静态方法，类的不使用this的函数，一般声明为静态方法；
  static showTotal(total) {
    return `总共 ${total} 条`;
  }

  // 实例变量，挂载在实例上，如若在此变量中未使用this，也可声明为静态变量
  columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  }, {
    title: 'E-mail',
    dataIndex: 'email',
    key: 'email',
  }, {
    title: '电话',
    dataIndex: 'phone',
    key: 'phone',
  }, {
    title: '',
    dataIndex: 'id',
    key: 'id',
    render: (value, row) => (
      <div>
        <Button onClick={() => this.handleClickEdit(row)}>编辑</Button>
      </div>
    ),
  }];

  handleClickEdit(data) {
    this.props.updateEntityModal({
      type: EDIT,
      show: true,
      data,
    });
  }

  // 实例变量/方法，使用了箭头函数做this的绑定，若无特殊传参，在render函数中优先使用这种方式进行函数声明；
  handlePageChange = (page) => {
    const { searchCondition, pagination } = this.props;

    this.props.getDataList({
      ...searchCondition,
      perpage: pagination.pageSize,
      page,
    });
  }

  render() {
    const { tableData, pagination, loading } = this.props;

    return (
      <Table
        bordered
        loading={loading}
        columns={this.columns}
        dataSource={tableData}
        rowKey="id"
        pagination={{
          current: pagination.page,
          total: pagination.total,
          pageSize: pagination.pageSize,
          showTotal: DataTable.showTotal,
          onChange: this.handlePageChange,
        }}
      />
    );
  }
}

export default DataTable;
