import React from 'react';
import PropTypes from 'prop-types';
import commonConf from 'config/main.conf';

import {
  Form,
  Row,
  Col,
  Input,
  Button,
} from 'antd';

import connectFactory from 'utils/connectFactory';
import { CREATE } from 'utils/constants';

import { NAMESPACE } from '../constants';
import { getDataList, updateEntityModal, updateSearchCondition } from '../actions';
import { selectSearchCondition } from '../selectors';

const withConnect = connectFactory(NAMESPACE);

@withConnect(
  state => ({
    searchCondition: selectSearchCondition(state),
  }),
  {
    getDataList,
    updateEntityModal,
    updateSearchCondition,
  },
)
@Form.create()
class Toolbar extends React.Component {
  static propTypes = {
    searchCondition: PropTypes.object.isRequired,
    getDataList: PropTypes.func.isRequired,
    updateEntityModal: PropTypes.func.isRequired,
    updateSearchCondition: PropTypes.func.isRequired,
    form: PropTypes.any.isRequired,
  };

  componentDidMount() {
    const { searchCondition } = this.props;
    this.props.getDataList({
      ...searchCondition,
      page: 1,
      perpage: commonConf.table.defaultPageSize,
    });
  }

  handleSearch = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.getDataList({
          ...values,
          page: 1,
          perpage: commonConf.table.defaultPageSize,
        });
        this.props.updateSearchCondition(values);
      }
    });
  }

  handleClickCreate = () => {
    this.props.updateEntityModal({
      type: CREATE,
      show: true,
      data: {},
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { searchCondition } = this.props;

    return (
      <Form>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label="姓名">
              {getFieldDecorator('name', {
                initialValue: searchCondition.name || '',
              })(
                <Input />,
              )}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="年龄">
              {getFieldDecorator('age', {
                initialValue: searchCondition.age || '',
              })(
                <Input />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col><Button onClick={this.handleSearch}>检索</Button></Col>
          <Col><Button onClick={this.handleClickCreate}>创建实体</Button></Col>
        </Row>
      </Form>);
  }
}

export default Toolbar;
