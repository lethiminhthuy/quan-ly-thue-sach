import React from "react";
import { Form, Input, Button, Checkbox } from "antd";

import "./style.scss";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const SignIn = (props) => {
  const { onSignIn } = props;

  const onFinish = (values) => {
    const { username, password } = values;
    onSignIn(username, password);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      className="signin__form"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Button type="primary" htmlType="submit" shape="round">
            Đăng Nhập
          </Button>
          <Button type="primary" ghost="true" shape="round">
            Đăng Ký
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default SignIn;
