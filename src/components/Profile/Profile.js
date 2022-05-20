import './Profile.css';
import React from "react";
import Header from "../Header/Header";
import { mainApi } from "../../utils/MainApi";

function Profile(props) {
  const { currentUser, setCurrentUser, loggedIn } = props;
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState(null);

  function handleNameChange(e) {
    setName(e.target.value)
  }

  function handleEmailChange(e) {
    setEmail(e.target.value)
  }

  function resetStatus() {
    setTimeout(() => setStatus(null), 2000);
  }

  function handleUpdateUser(name, email) {
    mainApi.patchUserInfo(name, email)
      .then((resultUserInfo) => {
        setName(resultUserInfo.user.name);
        setEmail(resultUserInfo.user.email);
        setCurrentUser({
            name: resultUserInfo.user.name,
            email: resultUserInfo.user.email,
            _id: resultUserInfo.user._id
        })
        setStatus('success');
        resetStatus();
      })
      .catch((err) => {
        setStatus('error');
        resetStatus();
        console.log(err);
      });
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleUpdateUser(name || currentUser.name, email || currentUser.email);
  }

  function handleLogout() {
    mainApi.signOut()
      .then(() => {
        window.location.href = '/';
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <Header isLoggedIn={loggedIn}/>
      <section className="profile">
        <div className="profile__content">
          <h1 className="profile__title">Привет, {currentUser.name}!</h1>
          <form className="profile__form" onSubmit={handleSubmit}>
            <div className="profile__form-field">
              <label className="profile__form-label">Имя</label>
              <input className="profile__form-input" placeholder={currentUser.name} value={name} onChange={handleNameChange}/>
            </div>
            <div className="profile__form-field">
              <label className="profile__form-label">E-mail</label>
              <input className="profile__form-input" placeholder={currentUser.email} value={email} onChange={handleEmailChange}/>
            </div>
            <div className="profile__form-footer">
              {!status && <button className="profile__button" type={"submit"}>Редактировать</button>}
              {status === 'success' && <span className="profile__message">Данные успешно изменены!</span>}
              {status === 'error' && <span className="profile__message">Произошла ошибка, данные не обновлены</span>}
              <button className="profile__button profile__button_red" onClick={handleLogout}>Выйти из аккаунта</button>
            </div>
          </form>
        </div>
      </section>
    </>

  );
}

export default Profile;
