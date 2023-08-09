import PropTypes from 'prop-types';
import './Order.scss';

import { Link } from 'react-router-dom';

function Order({
  callBackHandleSpanToggleOrderDetail,
  callBackHandleLogoutClick,
  callBackHandleGetTableNumber,
  orders,
  role,
}) {
  /* FUNCTION TO DISPLAY OR REMOVE DIV CONFIRM DISCONNECT */

  const handleDisplayConfirmBox = () => {
    const confirmBox = document.getElementsByClassName('confirm-disconnect-box')[0];
    confirmBox.classList.toggle('active');
  };

  const handleSpanToggleOrderDetail = (e) => {
    callBackHandleSpanToggleOrderDetail(e.currentTarget);
  };

  const handleLogoutClick = () => {
    callBackHandleLogoutClick();
  };

  const handleGetTableNumber = (e) => {
    callBackHandleGetTableNumber(e.currentTarget.getAttribute('idorder'));
  };

  return (
    <div className="container-order">

      <div className="confirm-disconnect-box">
        <span>Confirmer?</span>
        <span onClick={handleLogoutClick}>Oui</span>
        <span onClick={handleDisplayConfirmBox}>Non</span>
      </div>

      <div className="order-box-buttons">
        {role === 'ROLE_ADMIN' && (
          <Link to="/kitchen">
            <button className="order-kitchen-button" type="button">Cuisine</button>
          </Link>
        )}
        <button className="order-logout-button" type="button" onClick={handleDisplayConfirmBox}>Déconnexion</button>
      </div>

      <h2 className="current-order">Commandes en cours</h2>

      <div className="wrap-order-ul-box">
        <div className="order-ul-box">
          <ul className="ul-tag">

            {orders.map((elem) => (
              <li key={elem.id} idorder={elem.id}>
                <span className="order-number" onClick={handleSpanToggleOrderDetail}>Commande {elem.tables.Place}</span>
                <div className="wrap-order-status">
                  <span className={`order-status ${elem.Status}`} />
                </div>

                <div className="li-order-details">
                  <h4 className="li-order-details-title">Détails commande {elem.tables.Place}</h4>
                  <div className="li-order-details-ul-box">
                    <ul className="li-order-details-ul-tag">
                      {elem.Composes.map((element) => <li key={element.id} className="li-order-details-li li-order-details-li-text">{element.article.Name} x{element.Quantity}<span>{element.article.Price}€</span><span className="span-border-bottom" /></li>)}
                    </ul>
                  </div>
                  <Link className="button-details-cash-anchor" to="/payment" idorder={elem.id} onClick={handleGetTableNumber}>
                    <button className="button-details-cash" type="button">Encaisser</button>
                  </Link>
                </div>

              </li>
            ))}

          </ul>
        </div>
      </div>

      <button className="new-order-button" type="button" name="new-order-button">
        <Link className="anchor-new-order" to="/order/new-order">Nouvelle commande</Link>
      </button>

    </div>
  );
}

Order.propTypes = {
  callBackHandleSpanToggleOrderDetail: PropTypes.func,
  callBackHandleLogoutClick: PropTypes.func,
  callBackHandleGetTableNumber: PropTypes.func,
  orders: PropTypes.array,
  role: PropTypes.string,
}.isRequired;

export default Order;
