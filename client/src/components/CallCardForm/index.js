import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  InputNumber,
} from "antd";

import "./style.scss";
import { URL } from "../../constants/url_sever.constant";

const validateMessages = {
  required: "${label} is required",
};

const CallCardForm = (props) => {
  const { onCallCardForm, id, onCreateNewCallCard } = props;
  const [form] = Form.useForm();
  const [width, setWidth] = useState(window.innerWidth >= 720 ? true : false);
  const [booksOptions, setBooksOptions] = useState([]);
  const [bookValues, setBookValues] = useState([]);
  const [callCardInfo, setCallCardInfo] = useState([]);

  const booksProps = {
    mode: "tags",
    style: {
      width: "100%",
    },
    value: bookValues,
    options: booksOptions,
    onChange: (newValue) => {
      setBookValues(newValue);
    },
    placeholder: "Select Book...",
    maxTagCount: "responsive",
  };

  const genderProps = {
    options: [
      {
        label: "MALE",
        value: "male",
      },

      {
        label: "FEMALE",
        value: "female",
      },

      {
        label: "OPTION",
        value: "option",
      },
    ],
    placeholder: "Select Gender...",
  };

  useEffect(() => {
    const getAPI = async () => {
      const callCard = await axios
        .get(URL + `/call-cards/${id}`)
        .then((res) => res.data);

      if (callCard.isSuccess) {
        setCallCardInfo(callCard.data);
        form.setFieldsValue({
          name: callCard.data.name,
          email: callCard.data.email,
          age: callCard.data.age,
          phone: callCard.data.phone,
          gender: callCard.data.gender,
          books: callCard.data.books,
          date: [moment(callCard.data.date[0]), moment(callCard.data.date[1])],
        });
      }
    };

    const getBooksAPI = async () => {
      const books = await axios.get(URL + "/books").then((res) => res.data);
      if (books.isSuccess) {
        let OPTIONS = [];

        books.data.map((book) => {
          OPTIONS.push({
            label: book.name,
            value: book._id,
            disabled: book.rentInfo.isRented,
          });
        });

        setBooksOptions(OPTIONS);
        if (id) {
          getAPI();
        }
      }
    };

    getBooksAPI();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const formWidth = window.innerWidth >= 720 ? true : false;
      setWidth(formWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", () => {
        return;
      });
    };
  }, []);

  const onClose = () => {
    onCallCardForm(false);
  };

  const onSubmit = (values) => {
    if (!id) {
      handleFormCreate(values);
      return;
    }

    handleFormUpdate(values);
  };

  const handleFormCreate = async (values) => {
    const { name, email, age, gender, phone, date, books } = values;

    const callCard = await axios
      .post(URL + "/call-cards", {
        name,
        email,
        age,
        gender,
        phone,
        date,
        books,
      })
      .then((res) => res.data);

    if (callCard.isSuccess) {
      const bookDetails = await Promise.all(
        callCard.data.books.map(async (id) => {
          const book = await updateRentedBook(id, callCard.data._id);

          if (book.isSuccess) {
            return book.data;
          }

          console.log(book.msg);
        })
      );

      if (bookDetails) {
        onCreateNewCallCard(callCard.data);
        onClose();
      }
    }
  };

  const handleFormUpdate = async (values) => {
    const { name, email, age, gender, phone, date, books } = values;
    if (
      name === callCardInfo.name &&
      email === callCardInfo.email &&
      age === callCardInfo.age &&
      gender === callCardInfo.gender &&
      phone === callCardInfo.phone &&
      JSON.stringify(date) === JSON.stringify(callCardInfo.date) &&
      JSON.stringify(books) === JSON.stringify(callCardInfo.books)
    ) {
      return;
    }

    const callCard = await axios
      .put(URL + `/call-cards/${id}`, {
        type: "update",
        data: values,
      })
      .then((res) => res.data);
    if (callCard.isSuccess) {
      if (JSON.stringify(books) !== JSON.stringify(callCardInfo.books)) {
        const next = books.filter(
          (nextId) => !callCardInfo.books.some((prevId) => nextId === prevId)
        );
        const prev = callCardInfo.books.filter(
          (prevId) => !books.some((nextId) => prevId === nextId)
        );

        const bookIDs = next.concat(prev);
        const books = await Promise.all(
          bookIDs.map(async (id) => {
            const book = await updateRentedBook(id, callCard.data._id);
            if (book.isSuccess) {
              return book.data;
            }

            console.log(book.msg);
          })
        );

        if (books) {
          onClose();
        }
      }
    }
  };

  const updateRentedBook = (id, renter) => {
    return axios
      .put(URL + `/books/${id}`, {
        type: "rent",
        data: {
          rentInfo: {
            isRented: true,
            renter,
          },
        },
      })
      .then((res) => res.data);
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
                <Input value={"Check 1"} placeholder="Lê Thị B" />
              </Form.Item>
            </Col>

            <Col span={width ? 12 : 24}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true }]}
              >
                <Input
                  style={{ width: "100%" }}
                  addonAfter="@gmail.com"
                  placeholder="Examle"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={width ? 12 : 24}>
              <Form.Item
                name="age"
                label="Age"
                rules={[
                  {
                    type: "number",
                    required: true,
                    min: 0,
                    max: 99,
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} placeholder="21" />
              </Form.Item>
            </Col>

            <Col span={width ? 12 : 24}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true }]}
              >
                <Select {...genderProps}></Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={width ? 12 : 24}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[
                  {
                    required: true,
                  },
                  {
                    pattern: /^(?:\d*)$/,
                    message: "Value should contain just number.",
                  },
                ]}
              >
                <Input minLength={10} maxLength={10} placeholder="0123456789" />
              </Form.Item>
            </Col>

            <Col span={width ? 12 : 24}>
              <Form.Item
                name="date"
                label="Date"
                rules={[
                  { required: true, message: "Please choose the dateTime" },
                ]}
              >
                <DatePicker.RangePicker
                  defaultValue={moment()}
                  format={"DD/MM/YYYY"}
                  style={{ width: "100%" }}
                  getPopupContainer={(trigger) => trigger.parentElement}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="books"
                label="Books"
                rules={[{ required: true }]}
              >
                <Select {...booksProps} />
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
