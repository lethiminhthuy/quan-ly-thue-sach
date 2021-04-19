import React from "react";
import classNames from "classnames";
import { Card, Row, Col, Button } from "antd";

import "./style.scss";
import axios from "axios";

import { URL } from "../../constants/url_sever.constant";

const Book = (props) => {
  const { isAdmin, onBookSelected, onShowBookForm, onBookRemove } = props;
  const {
    item: {
      _id,
      name,
      thumbnail,
      rentInfo: { isRented },
    },
    item,
  } = props;

  const handleEditCard = () => {
    onBookSelected(_id);
    onShowBookForm(true);
  };

  const handleRemoveCard = async () => {
    const book = await axios
      .delete(URL + "/books/" + _id)
      .then((res) => res.data);
    if (book.isSuccess) {
      onBookRemove(item);
      return;
    }

    console.log(book.msg);
  };

  return (
    <Card
      hoverable
      className="book-list__item"
      cover={<img alt="example" src={thumbnail} />}
    >
      <h1 className="book-list__item-title">{name}</h1>
      <p
        className={classNames("book-list__item-status", {
          "book-list__item-status__true": isRented,
          "book-list__item-status__false": !isRented,
        })}
      >
        {isRented ? "Đã thuê" : "Có Sẵn"}
      </p>

      {isAdmin ? (
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
      ) : (
        ""
      )}
    </Card>
  );
};

export default Book;
