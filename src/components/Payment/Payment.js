import PropTypes from 'prop-types';
import './Payment.scss';

import { Link } from 'react-router-dom';

function Payment({
  callBackHandleSpanToggleOrderDetail,
  callBackHandleSubmitPayment,
  callBackHandleLogoutClick,
  idOrder,
  orders,
}) {
  const handleSubmitPayment = (e) => {
    callBackHandleSubmitPayment(e.currentTarget);
  };

  /* FUNCTION TO REMOVE CLASS ACTIVE ON EACH PAYMENT BUTTON ON CLICK AND ADD ACTIVE TO THE CURRENT PAYMENT BUTTON CLICKED */

  const handleClickPaymentMode = (e) => {
    Array.from(e.currentTarget.parentElement.getElementsByTagName('button')).forEach((elem) => {
      elem.classList.remove('active');
    });

    e.currentTarget.classList.toggle('active');
  };

  const handleSpanToggleOrderDetail = (e) => {
    callBackHandleSpanToggleOrderDetail(e.currentTarget);
  };

  /* FUNCTION TO DISPLAY OR REMOVE DIV CONFIRM DISCONNECT */

  const handleDisplayConfirmBox = () => {
    const confirmBox = document.getElementsByClassName('confirm-disconnect-box')[0];
    confirmBox.classList.toggle('active');
  };

  const handleLogoutClick = () => {
    callBackHandleLogoutClick();
  };

  /* GET UNITARY PRICE BY QUANTITY FOR EACH ARTICLE */

  const totalPrices = orders.map((elem) => elem.Composes.map((element) => element.Price));

  /* GET ORDER TOTAL PRICE */

  const maxPrices = [];
  for (const elem of totalPrices) {
    maxPrices.push(elem.reduce((a, b) => a + b, 0));
  }

  /* ADD TOTALPRICE KEY VALUE TO ORDERS ARRAY OF OBJECTS */

  for (let i = 0; i < orders.length; i += 1) {
    Object.assign(orders[i], { totalPrice: maxPrices[i] });
  }

  return (
    <div className="container-order">

      <div className="confirm-disconnect-box">
        <span>Confirmer?</span>
        <span onClick={handleLogoutClick}>Oui</span>
        <span onClick={handleDisplayConfirmBox}>Non</span>
      </div>

      <div className="order-box-buttons order-box-buttons-payment">
        <Link to="/order">
          <button className="order-back-button" type="button">Retour</button>
        </Link>
        <button className="order-logout-button" type="button" onClick={handleDisplayConfirmBox}>Déconnexion</button>
      </div>

      <h2 className="current-order">Encaissement</h2>
      <div className="wrap-order-ul-box">
        <div className="order-ul-box">
          <ul className="ul-tag">

            {orders.map((elem) => (
              <li className="li-order" key={elem.id} idorder={elem.id}>
                <span className="order-number" onClick={handleSpanToggleOrderDetail}>Commande {elem.tables.Place}</span>
                <div className="wrap-order-status">
                  <span className={`order-status ${elem.Status}`} />
                </div>

                <div className={Number(idOrder) === Number(elem.id) ? 'li-order-details-kitchen li-order-details active' : 'li-order-details-kitchen li-order-details'}>
                  <h4 className="li-order-details-title">Détails commande {elem.tables.Place}</h4>
                  <div className="li-order-details-ul-box li-order-details-ul-box-payment">
                    <ul className="li-order-details-ul-tag">
                      {elem.Composes.map((element) => <li key={element.id} className="li-order-details-li li-order-details-li-text">{element.article.Name} x{element.Quantity}<span>{element.article.Price}€</span><span className="span-border-bottom" /></li>)}
                    </ul>
                  </div>

                  <div className="div-extra-box div-extra-box-payment">
                    <h5 className="div-extra-title">Suppléments</h5>
                    <ul className="div-extra-ul" />
                  </div>

                  <div className="total-price-box">

                    <p className="total-price-p">Total: </p><span className="total-real-price">{elem.totalPrice}€</span>
                  </div>

                  <div className="payment-type-box">
                    <button className="card-button" type="button" name="card" onClick={handleClickPaymentMode}>Carte</button>
                    <button className="check-button" type="button" name="check" onClick={handleClickPaymentMode}>Chèque</button>
                    <button className="cash-button" type="button" name="cash" onClick={handleClickPaymentMode}>Espèces</button>
                  </div>

                  <button className="submit-payment" type="button" name="submit-payment" onClick={handleSubmitPayment}>Valider paiement</button>

                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

Payment.propTypes = {
  callBackHandleSpanToggleOrderDetail: PropTypes.func,
  callBackHandleSubmitPayment: PropTypes.func,
  callBackHandleLogoutClick: PropTypes.func,
  orders: PropTypes.array,
  idOrder: PropTypes.string,
}.isRequired;

export default Payment;
