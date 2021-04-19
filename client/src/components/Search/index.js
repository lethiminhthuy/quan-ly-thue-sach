import React, { useRef } from "react";
import { Form, Input, Button, Select } from "antd";

import "./style.scss";

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Search = (props) => {
  const { info, onSearchValue } = props;
  const getTimeout = useRef(null);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    if (getTimeout.current) {
      clearTimeout(getTimeout.current);
    }

    getTimeout.current = setTimeout(() => {
      const { name, type } = values;

      onSearchValue({
        name,
        type,
      });
    }, 300);
  };

  const onReset = () => {
    form.resetFields();
    onFinish({
      name: "",
      type: "",
    });
  };

  return (
    <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
      <Form.Item name="name" label={info.name}>
        <Input placeholder="Aa..." />
      </Form.Item>

      <Form.Item name="type" label="Type">
        <Select defaultValue="" placeholder="Select Type" allowClear>
          {info.type.length > 0
            ? info.type.map((detail) => (
                <Option value={detail.value}>{detail.name}</Option>
              ))
            : ""}
        </Select>
      </Form.Item>

      {/* <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.gender !== currentValues.gender
        }
      >
        {({ getFieldValue }) =>
          getFieldValue("gender") === "other" ? (
            <Form.Item
              name="customizeGender"
              label="Customize Gender"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          ) : null
        }
      </Form.Item> */}

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Search
        </Button>
        <Button htmlType="button" onClick={onReset}>
          Reset
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Search;
