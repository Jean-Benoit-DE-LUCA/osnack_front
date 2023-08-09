import './App.css';

import { useState, useEffect } from 'react';

import {
  Routes, Route, Navigate, useNavigate,
} from 'react-router-dom';

import jwt_decode from 'jwt-decode';

import axios from 'axios';

import closedEye from '../../assets/images/eye-closed.svg';
import openEye from '../../assets/images/eye-open.svg';
import arrowLeft from '../../assets/images/arrow-left.svg';

import Login from '../Login/Login';
import Order from '../Order/Order';
import NewOrder from '../NewOrder/NewOrder';
import Kitchen from '../Kitchen/Kitchen';
import Payment from '../Payment/Payment';

function App() {
  const [userLog, setUserLog] = useState('');
  const [userPass, setUserPass] = useState('');

  const [token, setToken] = useState('');
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');

  const [typedText, setTypedText] = useState('');

  const [detailDisplayNewOrder, setDetailDisplayNewOrder] = useState('');
  const [gridDisplayNewOrder, setGridDisplayNewOrder] = useState('');

  const [dataArticles, setDataArticles] = useState([]);
  const [dataArticlesCopy, setDataArticlesCopy] = useState([]);

  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);

  const [addList, setAddList] = useState(0);

  const [idOrder, setIdOrder] = useState('');

  const navigate = useNavigate();

  /* SET DYNAMICALLY TOKEN TO BEARER HEADERS BEFORE API REQUESTS */

  axios.defaults.headers.common.Authorization = `Bearer ${token}`;

  /* GET TABLE ORDER NUMBER */

  const callBackHandleGetTableNumber = (idorder) => {
    setIdOrder(idorder);
  };

  /* UPDATE STATUS TO 'PAID' BY PAYMENT PAGE */

  const callBackHandleSubmitPayment = async (event) => {
    const idOrder = event.parentElement.parentElement.getAttribute('idorder');
    const filteredResult = Array.from(event.parentElement.getElementsByClassName('payment-type-box')[0].getElementsByTagName('button')).filter((elem) => elem.classList.contains('active'));

    if (filteredResult.length !== 0) {
      const response = await axios.patch(
        `http://92.167.62.144/api/order/${idOrder}/edit`,
        {
          Status: 'paid',
        },
      );
      socket.send('Updated status');
      setAddList(addList + 1);
      navigate('/order');
    }
  };

  /* UPDATE STATUS TO 'FINISHED' BY KITCHEN PAGE */

  const callBackHandleEndClick = async (event) => {
    event.parentElement.parentElement.parentElement.getElementsByClassName('order-status')[0].classList.remove('in-progress');
    event.parentElement.parentElement.parentElement.getElementsByClassName('order-status')[0].classList.add('finished');

    event.parentElement.parentElement.classList.remove('active');

    const idOrder = event.parentElement.parentElement.parentElement.getAttribute('idorder');

    const response = await axios.patch(
      `http://92.167.62.144/api/order/${idOrder}/edit`,
      {
        Status: 'finished',
      },
    );
    socket.send('Updated status');
  };

  /* UPDATE STATUS TO 'IN-PROGRESS' BY KITCHEN PAGE */

  const callBackHandleStartClick = async (event) => {
    if (event.parentElement.parentElement.parentElement.getElementsByClassName('order-status')[0].classList.contains('standby')
        || event.parentElement.parentElement.parentElement.getElementsByClassName('order-status')[0].classList.contains('in-progress')
        || event.parentElement.parentElement.parentElement.getElementsByClassName('order-status')[0].classList.contains('finished')) {
      event.parentElement.parentElement.parentElement.getElementsByClassName('order-status')[0].classList.remove('standby');
      event.parentElement.parentElement.parentElement.getElementsByClassName('order-status')[0].classList.remove('in-progress');
      event.parentElement.parentElement.parentElement.getElementsByClassName('order-status')[0].classList.remove('finished');
    }

    event.parentElement.parentElement.parentElement.getElementsByClassName('order-status')[0].classList.add('in-progress');

    event.parentElement.parentElement.classList.remove('active');

    const idOrder = event.parentElement.parentElement.parentElement.getAttribute('idorder');
    const response = await axios.patch(
      `http://92.167.62.144/api/order/${idOrder}/edit`,
      {
        Status: 'in-progress',
      },
    );
    socket.send('Updated status');
  };

  /* RESET VALUES TO LOGOUT THE USER */

  const callBackHandleLogoutClick = () => {
    setToken('');
    setRole('');
    setUserId('');
  };

  /* FIRST API TO POST THE COMPOSE OBJECT AND SECOND API TO POST THE DETAILS OF ARTICLES LIST OBJECT */

  const callBackHandleSubmitListArticles = async (detailsObj, composeObj) => {
    const responseCompose = await axios.post(
      'http://92.167.62.144/api/compose/new',

      JSON.parse(JSON.stringify(composeObj)),
    );

    detailsObj.compose = [...responseCompose.data];

    const response = await axios.post(
      'http://92.167.62.144/api/order/new',

      JSON.parse(JSON.stringify(detailsObj)),
    );
    socket.send('Post new order');
    setAddList(addList + 1);
    navigate('/order');
  };

  /* RESET DATA ARTICLES LIST FROM GET API TO ORIGIN */

  const callBackHandleBackButtonClick = () => {
    setDataArticles([...dataArticlesCopy]);
  };

  /* FILTER FUNCTION TO ONLY GET DATA ARTICLES EQUALS TO CATEGORY NAME CLICKED */

  const callBackHandleCategoryClick = (categoryName) => {
    const filteredResult = dataArticles.filter((elem) => elem.Category.Category_Name === categoryName);
    setDataArticles(filteredResult);
  };

  /* API POST TO LOGIN USER */

  const callBackHandleSubmitLogin = async (userLogin, userPassword) => {
    try {
      const response = await axios.post(
        'http://92.167.62.144/api/login_check',
        {
          username: userLogin,
          password: userPassword,
        },

      );
      setUserLog(userLogin);
      setToken(response.data.token);

      const decoded = jwt_decode(response.data.token);
      setRole(decoded.roles[0]);
      setUserId(decoded.userId);

      navigate('/');
    }
    catch (e) {
      console.log(e);
    }
  };

  /* FUNCTION TO SET OR REMOVE ACTIVE CLASS ON SPAN LI DETAIL ON CLICK (KITCHEN / PAYMENT) */

  const callBackHandleSpanToggleOrderDetail = (event) => {
    const spanElems = document.getElementsByClassName('order-number');
    Array.from(spanElems).forEach((elem) => {
      if (elem !== event) {
        elem.parentElement.getElementsByClassName('li-order-details')[0].classList.remove('active');
      }
    });

    event.parentElement.getElementsByClassName('li-order-details')[0].classList.toggle('active');
  };

  /* API REQUEST TO LOAD ARTICLES LIST */

  const loadArticles = async () => {
    const response = await axios.get('http://92.167.62.144/api/article');
    setDataArticles(response.data);
    setDataArticlesCopy(response.data);
  };

  /* API REQUEST TO LOAD ORDERS LIST */

  const loadOrders = async () => {
    try {
      const response = await axios.get('http://92.167.62.144/api/order');
      setOrders(response.data);
    }

    catch (e) {
      console.log(e);
    }
  };

  /* API REQUEST TO LOAD TABLES LIST */

  const loadTables = async () => {
    try {
      const response = await axios.get('http://92.167.62.144/api/table');
      setTables(response.data);
    }
    catch (e) {
      console.log(e);
    }
  };

  /* CONTROLLED INPUT TO FILTER GRID ARTICLES DEPENDING ON TYPED TEXT */

  const callBackHandleTypedArticle = (typedText) => {
    const newDataArticles = [...dataArticlesCopy];

    const filteredResult = newDataArticles.filter((elem) => elem.Name.toLowerCase().startsWith(typedText.toLowerCase()));
    setDataArticles(filteredResult);
    setTypedText(typedText);
  };

  /* FUNCTION TO SET ACTIVE STATE OR REMOVE ACTIVE STATE TO SET LARGER OR SMALLER DETAIL LIST DIV */

  const callBackHandleEyeOpenClosedClick = () => {
    const eyeButtonBottom = document.getElementsByClassName('eye-button-article')[0];
    if (detailDisplayNewOrder !== 'active') {
      eyeButtonBottom.style.display = 'none';
      setDetailDisplayNewOrder('active');
    }

    else if (detailDisplayNewOrder === 'active') {
      eyeButtonBottom.style.display = 'inline';
      setDetailDisplayNewOrder('');
    }
  };

  /* FUNCTION TO SET ACTIVE STATE OR REMOVE ACTIVE STATE TO SET LARGER OR SMALLER ARTICLES GRID DIV  */

  const callBackHandleBottomEyeOpenClosedClick = () => {
    const ulBox = document.getElementsByClassName('new-order-detail-article-box')[0];
    const eyeButtonDetail = document.getElementsByClassName('eye-button-detail')[0];
    const eyeButtonArticle = document.getElementsByClassName('eye-button-article')[0];
    const containerArticleGrid = document.getElementsByClassName('container-article-grid')[0];

    if (gridDisplayNewOrder !== 'active') {
      const mediaQueryMin768 = window.matchMedia('screen and (min-width: 768px)');
      const mediaQueryMax768 = window.matchMedia('screen and (max-width: 768px)');

      if (mediaQueryMin768.matches) {
        eyeButtonDetail.style.opacity = 0;
        eyeButtonArticle.style.position = 'relative';
        eyeButtonArticle.style.bottom = '1.5rem';
        eyeButtonArticle.style.left = '0.1rem';
        ulBox.style.display = 'none';
        containerArticleGrid.style.height = '24rem';
        setGridDisplayNewOrder('active');
      }

      else if (mediaQueryMax768.matches) {
        eyeButtonDetail.style.opacity = 0;
        eyeButtonArticle.style.position = 'relative';
        eyeButtonArticle.style.bottom = '1.5rem';
        eyeButtonArticle.style.left = '0.4rem';
        ulBox.style.display = 'none';
        containerArticleGrid.style.height = '24rem';
        setGridDisplayNewOrder('active');
      }
    }
    else if (gridDisplayNewOrder === 'active') {
      eyeButtonDetail.style.opacity = 1;
      eyeButtonArticle.style.position = 'static';
      ulBox.style.display = 'block';
      containerArticleGrid.style.height = '12rem';
      setGridDisplayNewOrder('');
    }
  };

  /* WEBSOCKET */

  const socket = new WebSocket('ws://92.167.62.144:8080');

  useEffect(() => {
    /* socket.onopen = () => {
      console.log('Connection established');
    }; */
    socket.onmessage = (/* e */) => {
      setAddList(addList + 1);
      // console.log('Received message: ', e.data);
    };
    socket.onerror = (error) => {
      console.error('Error: ', error);
    };
    /* socket.onclose = () => {
      console.log('Connection closed');
    }; */

    return () => {
      socket.close();
    };
  }, [addList]);

  /* USEEFFECT TO LOAD API GET REQUESTS */

  useEffect(() => {
    if (token) {
      loadArticles();
      loadOrders();
      loadTables();
    }
  }, [token, addList]);

  return (
    <div className="app">
      <Routes>
        {role === '' && (
          <>
            <Route
              path="/login"
              element={(
                <Login
                  callBackHandleSubmitLogin={callBackHandleSubmitLogin}
                />
              )}
            />
            <Route path="/*" element={<Navigate to="/login" />} />
          </>
        )}
        {(role === 'ROLE_WAITER' || role === 'ROLE_ADMIN') && (
          <>
            <Route
              path="/"
              element={
                <Navigate to="/order" />
              }
            />
            <Route
              path="/login"
              element={(
                <Login
                  callBackHandleSubmitLogin={callBackHandleSubmitLogin}
                />
              )}
            />
            <Route
              path="/order"
              element={(
                <Order
                  callBackHandleSpanToggleOrderDetail={callBackHandleSpanToggleOrderDetail}
                  callBackHandleLogoutClick={callBackHandleLogoutClick}
                  callBackHandleGetTableNumber={callBackHandleGetTableNumber}
                  orders={orders}
                  socket={socket}
                  role={role}
                />
              )}
            />
            <Route
              path="/order/new-order"
              element={(
                <NewOrder
                  closedEye={closedEye}
                  openEye={openEye}
                  arrowLeft={arrowLeft}

                  callBackHandleEyeOpenClosedClick={callBackHandleEyeOpenClosedClick}
                  callBackHandleBottomEyeOpenClosedClick={callBackHandleBottomEyeOpenClosedClick}
                  callBackHandleTypedArticle={callBackHandleTypedArticle}
                  callBackHandleCategoryClick={callBackHandleCategoryClick}
                  callBackHandleBackButtonClick={callBackHandleBackButtonClick}
                  callBackHandleSubmitListArticles={callBackHandleSubmitListArticles}

                  detailDisplayNewOrder={detailDisplayNewOrder}
                  gridDisplayNewOrder={gridDisplayNewOrder}
                  typedText={typedText}

                  dataArticles={dataArticles}
                  tables={tables}
                  orders={orders}

                  userId={userId}
                />
              )}
            />
            <Route
              path="/payment"
              element={(
                <Payment
                  callBackHandleSpanToggleOrderDetail={callBackHandleSpanToggleOrderDetail}
                  callBackHandleSubmitPayment={callBackHandleSubmitPayment}
                  callBackHandleLogoutClick={callBackHandleLogoutClick}

                  orders={orders}
                  idOrder={idOrder}
                />
              )}
            />
          </>
        )}
        {(role === 'ROLE_KITCHEN' || role === 'ROLE_ADMIN') && (
          <>
            <Route
              path="/"
              element={
                <Navigate to="/kitchen" />
            }
            />
            <Route
              path="/kitchen"
              element={(
                <Kitchen
                  callBackHandleSpanToggleOrderDetail={callBackHandleSpanToggleOrderDetail}
                  callBackHandleStartClick={callBackHandleStartClick}
                  callBackHandleEndClick={callBackHandleEndClick}
                  callBackHandleLogoutClick={callBackHandleLogoutClick}

                  orders={orders}
                  role={role}
                />
            )}
            />
          </>
        )}
        <Route
          path="/*"
          element={(
            <Navigate to="/login" />
            )}
        />
      </Routes>
    </div>
  );
}

export default App;
