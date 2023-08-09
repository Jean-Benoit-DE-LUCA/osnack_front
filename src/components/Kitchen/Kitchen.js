import PropTypes from 'prop-types';
import './Kitchen.scss';

import { Link } from 'react-router-dom';

function Kitchen({
  callBackHandleSpanToggleOrderDetail,
  callBackHandleStartClick,
  callBackHandleEndClick,
  callBackHandleLogoutClick,
  orders,
  role,
}) {
  const handleLogoutClick = () => {
    callBackHandleLogoutClick();
  };

  const handleEndClick = (e) => {
    callBackHandleEndClick(e.currentTarget);
  };

  const handleStartClick = (e) => {
    callBackHandleStartClick(e.currentTarget);
  };

  const handleSpanToggleOrderDetail = (e) => {
    callBackHandleSpanToggleOrderDetail(e.currentTarget);
  };

  /* FUNCTION TO DISPLAY OR REMOVE DIV CONFIRM DISCONNECT */

  const handleDisplayConfirmBox = () => {
    const confirmBox = document.getElementsByClassName('confirm-disconnect-box')[0];
    confirmBox.classList.toggle('active');
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
          <Link to="/order">
            <button className="order-order-button" type="button">Commandes</button>
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

                <div className="li-order-details-kitchen li-order-details div-height">
                  <h4 className="li-order-details-title">Détails commande {elem.tables.Place}</h4>
                  <div className="li-order-details-ul-box">
                    <ul className="li-order-details-ul-tag">
                      {elem.Composes.map((element) => <li key={element.id} className="li-order-details-li li-order-details-li-text">{element.article.Name} x{element.Quantity}<span className="span-border-bottom" /></li>)}
                    </ul>
                  </div>

                  <div className="div-extra-box">
                    <h5 className="div-extra-title">Suppléments</h5>
                    <ul className="div-extra-ul" />
                  </div>

                  <div className="start-confirm-buttons-box">
                    <button className="button-details-cash" type="button" onClick={handleStartClick}>Commencer</button>
                    <button className="button-details-cash" type="button" onClick={handleEndClick}>Valider</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

Kitchen.propTypes = {
  callBackHandleSpanToggleOrderDetail: PropTypes.func,
  callBackHandleStartClick: PropTypes.func,
  callBackHandleEndClick: PropTypes.func,
  callBackHandleLogoutClick: PropTypes.func,
  orders: PropTypes.array,
  role: PropTypes.string,
}.isRequired;

export default Kitchen;
