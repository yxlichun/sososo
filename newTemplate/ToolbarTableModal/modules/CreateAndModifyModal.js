import React from 'react';
import {
  Form,
  Row,
  Col,
  Input,
} from 'antd';

// eslint-disable-next-line
export default class Toolbar extends React.PureComponent {
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

  render() {
    const { values } = this.state;

    return (
      <Form>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label="姓名">
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
      </Form>);
  }
}
