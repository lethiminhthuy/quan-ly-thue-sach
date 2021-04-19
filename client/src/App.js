import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter, Switch, Route, Link, Redirect } from "react-router-dom";
import { Layout, Menu, Button, Alert } from "antd";
import { HomeOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";

import "antd/dist/antd.css";
import "./App.scss";
import banner from "./assets/images/banner.jpg";

import Home from "./pages/Home/index";
import CallCard from "./pages/CallCard/index";
import SignIn from "./components/SignIn";

import CallCardForm from "./components/CallCardForm/index";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const App = () => {
  const [collapsed, setCollapsed] = useState(!(window.innerWidth >= 807));
  const [isFullWidth, setIsFullWidth] = useState(window.innerWidth >= 807);
  const [showForm, setShowForm] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState({
    status: false,
    msg: "",
  });

  const [isShowCallCardForm, setShowCallCardForm] = useState(false);
  const [callCardId, setCallCardId] = useState(null);
  const [newCallCard, setNewCallCard] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const bool = width >= 807 ? false : true;
      setCollapsed(bool);
      setIsFullWidth(!bool);
    };

    window.addEventListener("resize", handleResize);
  }, []);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
    return;
  };

  //HÀM XỬ LÝ HIỆN/ẨN FORM ĐĂNG NHẬP/KÝ
  const handleForm = (bool) => {
    setShowForm(bool);
  };

  //HÀM ĐĂNG NHẬP
  const handleSignIn = async (username, password) => {
    const user = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "signin",
        userInfo: {
          username,
          password,
        },
      }),
    }).then((res) => res.json());

    if (user.status === "success") {
      setIsSignIn(true);
      setUser(user.data);
      setIsAdmin(user.data.isAdmin);
      setShowForm(false);
      setError({
        status: false,
        msg: "",
      });
      return;
    }

    setError({
      status: true,
      msg: user.msg,
    });
  };

  //HÀM ĐĂNG XUẤT
  const handleLogOut = () => {
    setIsSignIn(false);
    setUser({});
    setIsAdmin(false);
  };

  //HÀM ẨN/HIỆN FORM THÊM THẺ MƯỢN SÁCH
  const handleCallCardForm = (bool, id) => {
    setShowCallCardForm(bool);

    if (id) {
      setCallCardId(id);
      return;
    }

    setCallCardId(null);
  };

  const handleWhiteScreenClick = () => {
    handleForm(false);
    setShowCallCardForm(false);
  };

  //HÀM TẠO VÙNG TRẮNG XUNG QUANH FORM
  const whiteScreen = () => {
    return (
      <div
        onClick={handleWhiteScreenClick}
        style={{
          position: "absolute",
          width: "100vw",
          height: "100vh",
          background: "rgba(255, 255, 255, 0.8)",
          zIndex: 2,
          cursor: "pointer",
        }}
      />
    );
  };

  //HÀM THÊM THẺ THUÊ SÁCH MỚI
  const handleCreateNewCallCard = (callCard) => {
    setNewCallCard(callCard);
  };

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }}>
        {error.status ? (
          <Alert
            message={error.msg}
            type="error"
            closable
            onClose={() =>
              setError({
                status: false,
                msg: "",
              })
            }
            style={{
              width: "50%",
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 3,
            }}
          />
        ) : (
          ""
        )}

        {showForm ? <SignIn onSignIn={handleSignIn} /> : ""}

        {(isShowCallCardForm && isAdmin) ||
        (callCardId && isShowCallCardForm && isAdmin) ? (
          <CallCardForm
            onCallCardForm={handleCallCardForm}
            id={callCardId}
            onCreateNewCallCard={handleCreateNewCallCard}
          />
        ) : (
          ""
        )}

        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <div
            className="slider--wrapped"
            style={{ width: !collapsed ? "200px" : "80px" }}
          >
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
              <Menu.Item key="1" icon={<HomeOutlined />}>
                <Link to="/">Home</Link>
              </Menu.Item>
              {isSignIn ? (
                <Menu.Item key="2" icon={<UserOutlined />}>
                  <Link to="/call-card">Call Card</Link>
                </Menu.Item>
              ) : (
                ""
              )}

              {isSignIn ? (
                <SubMenu key="sub1" icon={<TeamOutlined />} title="Team">
                  <Menu.Item key="3">Mai</Menu.Item>
                  <Menu.Item key="4">Thúy</Menu.Item>
                  <Menu.Item key="5">Ân</Menu.Item>
                </SubMenu>
              ) : (
                ""
              )}
            </Menu>
          </div>
        </Sider>

        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {!isSignIn ? (
              <Button
                onClick={() => {
                  handleForm(true);
                }}
                type="primary"
                shape="round"
              >
                Đăng Nhập
              </Button>
            ) : (
              <Button
                onClick={handleLogOut}
                type="primary"
                danger="true"
                shape="round"
              >
                Đăng Xuất
              </Button>
            )}
          </Header>

          <Content>
            <div className="banner__wrapped">
              <img src={banner} />
            </div>

            <Switch>
              {!user ? <Redirect from="/call-card" to="/" /> : ""}
              <Route path="/call-card">
                <CallCard
                  newCallCard={newCallCard}
                  onCallCardForm={handleCallCardForm}
                  isFullWidth={isFullWidth}
                  onCreateNewCallCard={handleCreateNewCallCard}
                />
              </Route>
              <Route path="/">
                <Home isFullWidth={isFullWidth} isAdmin={isAdmin} />
              </Route>
            </Switch>
          </Content>

          <Footer style={{ textAlign: "center" }}>
            Quản Lý Thư Viện @2021 Xây Dựng Bởi {`<Tên_Nhóm>`}
          </Footer>
        </Layout>

        {showForm ? whiteScreen() : ""}
      </Layout>
    </BrowserRouter>
  );
};

export default App;
