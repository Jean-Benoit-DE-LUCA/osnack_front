import PropTypes from 'prop-types';
import './Login.scss';

import { Link } from 'react-router-dom';

function Login({ callBackHandleSubmitLogin }) {
  const handleSubmitLogin = (e) => {
    e.preventDefault();
    const userLoginInput = document.getElementsByClassName('user-login-input')[0];
    const userPasswordInput = document.getElementsByClassName('user-password-input')[0];

    callBackHandleSubmitLogin(userLoginInput.value, userPasswordInput.value);
  };

  return (
    <>
      <div className="login-box">
        <h1 className="login-box-h1">Connexion</h1>
        <div className="login-box-form">
          <form className="form">

            <div className="username-box">
              <label className="user-login-label" htmlFor="usernameInput">Utilisateur:
                <input className="user-login-input" type="text" name="usernameInput" id="usernameInput" />
              </label>
            </div>

            <div className="password-box">
              <label className="user-password-label" htmlFor="passwordInput">Mot de passe:
                <input className="user-password-input" type="password" name="passwordInput" id="passwordInput" />
              </label>
            </div>

            <button className="submit-login-butt" type="submit" name="submit-login" onClick={handleSubmitLogin}>Valider</button>

          </form>
        </div>
      </div>

      <div className="login-admin-box">
        <h3 className="login-admin-title">Accueil administrateur</h3>
        <Link className="login-admin-anchor" to="http://92.167.62.144/admin">
          <button className="login-admin-button" type="button">Admin</button>
        </Link>
      </div>
    </>
  );
}

Login.propTypes = {
  callBackHandleSubmitLogin: PropTypes.func,
}.isRequired;

export default Login;
