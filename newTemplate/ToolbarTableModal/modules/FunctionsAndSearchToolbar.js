import React from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Row,
  Col,
  Input,
  Button,
} from 'antd';

import connectFactory from 'utils/connectFactory';

import { NAMESPACE } from '../constants';
import { postFormData } from '../actions';

const withConnect = connectFactory(NAMESPACE);

@withConnect(
  state => ({
    searchCondition: state.get('searchCondition').toJS(),
  }),
  {
    postFormData,
  },
)
class Toolbar extends React.Component {
  static propTypes = {
    searchCondition: PropTypes.object.isRequired,
    postFormData: PropTypes.func.isRequired,
  };

  state = {
    values: {},
  };

  handleChange(e, key) {
    const { values } = this.state;
    const { value } = e.target;
    this.setState({
      values: {
        ...values,
        [key]: value,
      },
    });
  }

  handleSearch = () => {
    const { values } = this.state;
    this.props.postFormData(values);
  }

  render() {
    const { values } = this.state;
    const { searchCondition } = this.props;

    return (
      <Form>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label="姓名eeeee">
              <Input
                placeholder="请输入姓名"
                onChange={e => this.handleChange(e, 'name')}
                value={values.name}
              ></Input>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="年龄">
              <Input placeholder="请输入年龄" onChange={e => this.handleChange(e, 'age')}></Input>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col><Button onClick={this.handleSearch}>检索</Button></Col>
        </Row>
      </Form>);
  }
}

export default Toolbar;
