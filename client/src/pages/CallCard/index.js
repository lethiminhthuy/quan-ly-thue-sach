import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import Search from "../../components/Search/index";
import Card from "../../components/CallCard/index";
import "./style.scss";
import { URL } from "../../constants/url_sever.constant";

const info = {
  path: "/call-card",
  name: "Value",
  type: [
    {
      name: "-- All --",
      value: "",
    },

    {
      name: "ID",
      value: "_id",
    },

    {
      name: "Name",
      value: "name",
    },

    {
      name: "Email",
      value: "email",
    },

    {
      name: "Age",
      value: "age",
    },

    {
      name: "Gender",
      value: "gender",
    },

    {
      name: "Address",
      value: "address",
    },

    {
      name: "Phone",
      value: "phone",
    },

    {
      name: "Date",
      value: "date",
    },
  ],
};

const CallCard = (props) => {
  const {
    newCallCard,
    onCallCardForm,
    isFullWidth,
    onCreateNewCallCard,
  } = props;
  const [list, setList] = useState(null);

  useEffect(() => {
    const callCardAPI = async () => {
      const callCards = await getCallCards();
      setList(callCards);
    };

    callCardAPI();
  }, []);

  useEffect(() => {
    if (newCallCard) {
      setList((list) => [...list, newCallCard]);
      onCreateNewCallCard(null);
    }
  }, [newCallCard]);

  const getCallCards = async () => {
    const callCards = await axios
      .get(URL + "/call-cards")
      .then((res) => res.data);

    if (callCards.isSuccess) {
      const newCallCards = await Promise.all(
        callCards.data.map((callCard) => {
          if (callCard.books.length > 0) {
            return callCard;
          }
        })
      );

      return newCallCards;
    }
  };

  const handleSearchValue = async (values) => {
    let { name, type } = values;

    name = name ? name : "";
    type = type ? type : "";

    if (!type && !name) {
      const callCards = await getCallCards();
      setList(callCards);
    }

    const callCards = await axios
      .get(URL + "/call-cards")
      .then((res) => res.data);
    if (callCards.isSuccess) {
      const results = [];
      callCards.data.map((callCard) => {
        if (type && type !== "age") {
          if (callCard[type].toLowerCase().includes(name.toLowerCase())) {
            results.push(callCard);
          }
        } else if (type === "age") {
          if (callCard[type].toString().includes(name.toString())) {
            results.push(callCard);
          }
        } else {
          if (callCard.name.toLowerCase().includes(name.toLowerCase())) {
            results.push(callCard);
          }
        }
      });

      setList([...results]);
    }
  };

  const handleAddForm = () => {
    onCallCardForm(true);
  };

  const handleRemoveCard = (id) => {
    const i = list.findIndex((card) => {
      return card._id === id;
    });
    list.splice(i, 1);
    setList([...list]);
  };

  return (
    <div className="card-list--wrapped">
      <div className="card-list--wrapped__search">
        <div
          style={{
            width: isFullWidth ? "50%" : "100%",
            marginLeft: isFullWidth ? -100 : 0,
          }}
        >
          <Search info={info} onSearchValue={handleSearchValue} />
        </div>
      </div>

      <div className="card-list--wrapped__list">
        <div className="card-list--wrapped__list--add">
          <Button onClick={handleAddForm}>
            <PlusCircleOutlined />
            Add
          </Button>
        </div>

        <div className="card-list--wrapped__list--result">
          {list && list.length > 0
            ? list.map((renterInfo) => {
                if (renterInfo) {
                  return (
                    <Card
                      key={renterInfo._id}
                      renterInfo={renterInfo}
                      onCallCardForm={onCallCardForm}
                      onRemoveCard={handleRemoveCard}
                    />
                  );
                }
              })
            : ""}
        </div>
      </div>
    </div>
  );
};

export default CallCard;
