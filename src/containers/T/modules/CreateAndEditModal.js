import React from 'react';
import PropTypes from 'prop-types';

import {
  Modal,
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  AutoComplete,
} from 'antd';

import { createStructuredSelector } from 'reselect';
import connectFactory from 'utils/connectFactory';
import { CREATE, EDIT } from 'utils/constants';
import { NAMESPACE } from '../constants';
import { updateEntityModal, postCreateEntity, postEditEntity } from '../actions';
import { selectEntityModal } from '../selectors';

const withConnect = connectFactory(NAMESPACE);

const FormItem = Form.Item;
const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

const residences = [{
  value: 'zhejiang',
  label: 'Zhejiang',
  children: [{
    value: 'hangzhou',
    label: 'Hangzhou',
    children: [{
      value: 'xihu',
      label: 'West Lake',
    }],
  }],
}, {
  value: 'jiangsu',
  label: 'Jiangsu',
  children: [{
    value: 'nanjing',
    label: 'Nanjing',
    children: [{
      value: 'zhonghuamen',
      label: 'Zhong Hua Men',
    }],
  }],
}];

@withConnect(
  createStructuredSelector({ // 实用reselect性能有明显的提升；
    entityModal: selectEntityModal,
  }),
  { // 其实这里可以处理掉，当前每引入一个action,需要更新props绑定，更新PropsType，
    // 实际可以直接将action全量引入，但是出于对性能及规范开发的要求，这里仍然使用单独引入的方式；
    updateEntityModal,
    postCreateEntity,
    postEditEntity,
  },
)
@Form.create({
  mapPropsToFields: props => ({
    // 这里埋个坑，没空细看到底发生了什么……
    // email: Form.createFormField({ value: props.entityModal.data.email || '' }),
  }),
})
// eslint-disable-next-line
class CreateAndEditModal extends React.PureComponent {
  static propTypes = {
    entityModal: PropTypes.object.isRequired,
    updateEntityModal: PropTypes.func.isRequired,
    postCreateEntity: PropTypes.func.isRequired,
    postEditEntity: PropTypes.func.isRequired,
  };

  state = {
    autoCompleteResult: [],
  };

  handleOk = (e) => {
    e.preventDefault();
    const { type } = this.props.entityModal;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (type === CREATE) {
          this.props.postCreateEntity(values);
        } else if (type === EDIT) {
          this.props.postEditEntity(values);
        }
      }
    });
  }

  handleCancel = () => {
    this.props.updateEntityModal({
      type: CREATE,
      show: false,
      data: {},
    });
  }

  handleWebsiteChange = (value) => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  }

  render() {
    const { entityModal } = this.props;
    const { data } = entityModal;

    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>,
    );

    const websiteOptions = autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));

    return (
      <div>
        <Modal
          width={700}
          title="基础 Modal"
          visible={entityModal.show}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form
            className="sofa-modal-form"
            onSubmit={this.handleSubmit}
          >
            <FormItem
              {...formItemLayout}
              label="E-mail"
            >
              {getFieldDecorator('email', {
                initialValue: data.email || '',
                rules: [{
                  type: 'email', message: 'The input is not valid E-mail!',
                }, {
                  required: true, message: 'Please input your E-mail!',
                }],
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={(
                <span>
                  Nickname&nbsp;
                  <Tooltip title="What do you want others to call you?">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              )}
            >
              {getFieldDecorator('name', {
                initialValue: data.name || '',
                rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Habitual Residence"
            >
              {getFieldDecorator('residence', {
                initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                rules: [{ type: 'array', required: true, message: 'Please select your habitual residence!' }],
              })(
                <Cascader options={residences} />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Phone Number"
            >
              {getFieldDecorator('phone', {
                initialValue: data.phone || '',
                rules: [{ required: true, message: 'Please input your phone number!' }],
              })(
                <Input addonBefore={prefixSelector} style={{ width: '100%' }} />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Website"
            >
              {getFieldDecorator('website', {
                rules: [{ required: true, message: 'Please input website!' }],
              })(
                <AutoComplete
                  dataSource={websiteOptions}
                  onChange={this.handleWebsiteChange}
                  placeholder="website"
                >
                  <Input />
                </AutoComplete>,
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>);
  }
}

export default CreateAndEditModal;
