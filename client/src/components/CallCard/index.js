import React from "react";
import moment from "moment";
import classNames from "classnames";
import { Card as CardComp, Button, Col, Row } from "antd";
import axios from "axios";

import avatar from "../../assets/images/default-avatar.png";
import "./style.scss";
import { URL } from "../../constants/url_sever.constant";

const Card = (props) => {
  const {
    renterInfo: { _id, name, age, email, gender, date, phone, books },
    onCallCardForm,
    onRemoveCard,
  } = props;

  const end = moment(date[1])._d.getTime();
  const now = new Date().getTime();
  const timeRemaining = end - now;
  const days = timeRemaining / 1000 / 60 / 60 / 24;
  const isEnded = timeRemaining < 0 ? true : Math.floor(days);

  const handleEditCard = () => {
    onCallCardForm(true, _id);
  };

  const handleRemoveCard = async () => {
    const callCard = await axios
      .delete(URL + `/call-cards/${_id}`)
      .then((res) => res.data);
    if (callCard.isSuccess) {
      const booksAfterRemove = await Promise.all(
        books.map(async (id) => {
          const book = await axios
            .put(URL + `/books/${id}`, {
              type: "rent",
              data: {
                rentInfo: {
                  isRented: false,
                  renter: "",
                },
              },
            })
            .then((res) => res.data);

          if (book.isSuccess) {
            return onRemoveCard(_id);
          }

          console.log(book.msg);
        })
      );

      if (booksAfterRemove) {
        return;
      }

      console.log("ERROR");
    }
  };

  return (
    <CardComp
      hoverable
      className="card-list__item"
      cover={<img alt="example" src={avatar} />}
    >
      <h1 className="card-list__item--title">{name}</h1>

      <div className="card-list__item--content">
        <p className="card-list__item--content__email">
          <span className="card-list__item-sub">Email:</span>{" "}
          {email + "@gmail.com"}
        </p>

        <p className="card-list__item--content__birthday">
          <span className="card-list__item-sub">Age:</span> {age}
        </p>

        <p className="card-list__item--content__birthday">
          <span className="card-list__item-sub">Gender:</span>{" "}
          {gender.toUpperCase()}
        </p>

        <p className="card-list__item--content__date">
          <span className="card-list__item-sub">Date:</span>{" "}
          <span
            className={classNames({
              "card-list__item--content__date--default":
                isEnded !== true && isEnded > 1,
              "card-list__item--content__date--warning":
                isEnded === true || isEnded <= 1,
            })}
          >
            {isEnded === true ? "Hết hạn" : `Hơn ${isEnded} ngày`}
          </span>
          .
        </p>

        <p className="card-list__item--content__phone">
          <span className="card-list__item-sub">Phone:</span> {phone}
        </p>
      </div>

      <Row className="card-list__item--button">
        <Col span={12}>
          <Button onClick={handleEditCard}>Check</Button>
        </Col>
        <Col span={12}>
          <Button onClick={handleRemoveCard} type="primary" danger>
            Remove
          </Button>
        </Col>
      </Row>
    </CardComp>
  );
};

export default Card;
