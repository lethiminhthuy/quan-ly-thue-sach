import React, { useState, useEffect } from "react";
import axios from "axios";
import classNames from "classnames";

import BookCard from "../../components/BookCard/index";
import Search from "../../components/Search/index";
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import BookForm from "../../components/BookForm/index";

import "./style.scss";
import { URL } from "../../constants/url_sever.constant";

const info = {
  path: "/",
  name: "Name",
  type: [
    {
      name: "-- All --",
      value: "",
    },

    {
      name: "Có sẵn",
      value: "false",
    },

    {
      name: "Đã thuê",
      value: "true",
    },
  ],
};

const Home = (props) => {
  const { isFullWidth, isAdmin } = props;
  const [list, setList] = useState([]);
  const [isShowBookForm, setShowBookForm] = useState(false);
  const [bookSelected, setBookSelected] = useState(null);

  useEffect(() => {
    const getBooks = async () => {
      const books = await axios.get(URL + "/books").then((res) => res.data);

      if (books.isSuccess) {
        let activeBooks = [];
        books.data.map((book) => {
          if (book.status) {
            activeBooks.push(book);
          }
        });

        setList(activeBooks);
      }
    };

    getBooks();
  }, []);

  const handleNewBook = (book) => {
    setList((list) => [...list, book]);
  };

  //HÀM LẤY GIÁ TRỊ TÌM KIẾM VÀO TRẢ KẾT QUẢ TÌM KIẾM
  const handleSearchValue = async (values) => {
    let { name, type } = values;

    name = name ? name : "";
    type = type ? type : "";

    const books = await axios.get(URL + "/books").then((res) => res.data);

    if (name === "" && type === "") {
      setList(books.data);
      return;
    }

    let searchList = [];
    if (books.isSuccess) {
      let i = 0;
      while (i < books.data.length) {
        if (name.length > 0) {
          if (books.data[i].name.toLowerCase().includes(name.toLowerCase())) {
            if (type === "") {
              searchList.push(books.data[i]);
            }

            if (type === "false") {
              if (!books.data[i].rentInfo.isRented) {
                searchList.push(books.data[i]);
              }
            }

            if (type === "true") {
              if (books.data[i].rentInfo.isRented) {
                searchList.push(books.data[i]);
              }
            }
          }
        }

        if (type === "") {
          searchList.push(books.data[i]);
        }

        if (type === "false") {
          if (!books.data[i].rentInfo.isRented) {
            searchList.push(books.data[i]);
          }
        }

        if (type === "true") {
          if (books.data[i].rentInfo.isRented) {
            searchList.push(books.data[i]);
          }
        }

        i++;
      }

      setList(searchList);
    }
  };

  const handleShowBookForm = (bool = true) => {
    if (!bool) {
      setBookSelected(null);
    }
    setShowBookForm(bool);
  };

  const handleBookSelected = (id) => {
    setBookSelected(id);
  };

  const handleBookRemove = (book) => {
    const i = list.findIndex((item) => item._id === book._id);
    if (i !== -1) {
      list.splice(i, 1);
      setList([...list]);
    }
  };

  return (
    <div className="book-list--wrapped">
      {isShowBookForm && isAdmin ? (
        <BookForm
          id={bookSelected}
          onShowBookForm={handleShowBookForm}
          onNewBook={handleNewBook}
        />
      ) : (
        ""
      )}

      <div className="book-list--wrapped__search">
        <div
          style={{
            width: isFullWidth ? "50%" : "100%",
            marginLeft: isFullWidth ? -100 : 0,
          }}
        >
          <Search info={info} onSearchValue={handleSearchValue} />
        </div>
      </div>

      <div
        className={classNames("book-list--wrapped__list--add", {
          "book-list--wrapped__list--add--visible": isAdmin,
        })}
      >
        <Button onClick={handleShowBookForm}>
          <PlusCircleOutlined />
          Add
        </Button>
      </div>

      <div className="book-list--wrapped__result">
        {list.length > 0 ? (
          list.map((item) => (
            <BookCard
              key={item._id}
              item={item}
              onBookSelected={handleBookSelected}
              onShowBookForm={handleShowBookForm}
              onBookRemove={handleBookRemove}
              isAdmin={isAdmin}
            />
          ))
        ) : (
          <div className="book-list--wrapped__result--false">
            Không tìm thấy.
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
