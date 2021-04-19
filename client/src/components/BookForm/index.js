import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

import { Drawer, Form, Button, Col, Row, Input } from "antd";

import "./style.scss";

import { URL } from "../../constants/url_sever.constant";

const validateMessages = {
  required: "${label} is required",
};

const CallCardForm = (props) => {
  const { id, onShowBookForm, onNewBook } = props;
  const [form] = Form.useForm();
  const [width, setWidth] = useState(window.innerWidth >= 720 ? true : false);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth >= 720 ? true : false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", () => {
        return;
      });
    };
  }, []);

  useEffect(() => {
    const getBookByID = async () => {
      const book = await axios
        .get(URL + "/books/" + id)
        .then((res) => res.data);
      if (book.isSuccess) {
        console.log(book.data);
        form.setFieldsValue({
          _id: book.data._id,
          name: book.data.name,
          thumbnail: book.data.thumbnail,
          description: book.data.description,
        });

        return;
      }

      console.log(book.msg);
    };

    if (id) {
      getBookByID();
    }
  }, [id]);

  const onClose = () => {
    onShowBookForm(false);
  };

  const onSubmit = (values) => {
    if (!id) {
      handleFormCreate(values);
      return;
    }

    handleFormUpdate(values);
  };

  const handleFormCreate = async (values) => {
    const { name, thumbnail, description } = values;
    const book = await axios
      .post(URL + "/books", {
        name,
        thumbnail,
        description,
      })
      .then((res) => res.data);

    if (book.isSuccess) {
      onNewBook(book.data);
      return;
    }

    console.log(book.msg);
  };

  const handleFormUpdate = async (values) => {
    const { _id, name, thumbnail, description } = values;
    const book = await axios
      .put(URL + "/books/" + _id, {
        type: "info",
        data: {
          name,
          thumbnail,
          description,
        },
      })
      .then((res) => res.data);

    if (book.isSuccess) {
      onClose();
      return;
    }

    console.log(book.msg);
  };

  return (
    <>
      <Drawer
        title="Call Card"
        width={width ? 720 : "100%"}
        onClose={onClose}
        visible={true}
      >
        <Form
          className="call-card__form"
          form={form}
          layout="vertical"
          hideRequiredMark
          validateMessages={validateMessages}
          onFinish={onSubmit}
        >
          <Row gutter={16}>
            <Col span={width ? 12 : 24}>
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input placeholder="Nhiều tiền để làm gì?" />
              </Form.Item>
            </Col>

            <Col span={width ? 12 : 24}>
              <Form.Item name="_id" label="ID">
                <Input placeholder="Book ID" disabled />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="thumbnail"
            label="Thumbnail"
            rules={[{ required: true }]}
          >
            <Input
              style={{ width: "100%" }}
              placeholder="https://examle.com/"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Please enter book description..."
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="call-card__form--button">
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button htmlType="submit" type="primary">
              Submit
            </Button>
          </div>
        </Form>
      </Drawer>
    </>
  );
};

export default CallCardForm;
