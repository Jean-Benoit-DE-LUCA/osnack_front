import PropTypes from 'prop-types';
import './NewOrder.scss';

import { Link } from 'react-router-dom';

function NewOrder({
  closedEye,
  openEye,
  arrowLeft,
  callBackHandleEyeOpenClosedClick,
  callBackHandleBottomEyeOpenClosedClick,
  callBackHandleTypedArticle,
  callBackHandleCategoryClick,
  callBackHandleBackButtonClick,
  callBackHandleSubmitListArticles,
  detailDisplayNewOrder,
  gridDisplayNewOrder,
  typedText,
  dataArticles,
  userId,
  tables,
  orders,
}) {
  const handleTypedArticle = (e) => {
    callBackHandleTypedArticle(e.target.value);
  };

  const handleEyeOpenClosedClick = () => {
    callBackHandleEyeOpenClosedClick();
  };

  const handleBottomEyeOpenClosedClick = () => {
    callBackHandleBottomEyeOpenClosedClick();
  };

  /* VARIABLES TO ONLY GET AVAILABLES TABLES FOR SELECT TAG */
  const filteredOrders = orders.map((elem) => elem.tables.id);

  const resultOrdersSelect = tables.map((elem) => {
    if (!filteredOrders.find((element) => element === elem.id)) {
      return elem;
    }
  });

  const resultOrdersSelectFiltered = resultOrdersSelect.filter((elem) => elem !== undefined);

  /* FUNCTION TO CREATE NEW OBJECT OF LIST DETAILS ARTICLES ON SUBMIT NEW ORDER */

  const handleSubmitListArticles = () => {
    const liArticles = document.getElementsByClassName('new-order-detail-article-li');
    const selectTable = document.getElementsByClassName('select-table-number')[0];

    const composeArray = {};
    const detailsObj = {
      status: 'standby',
      payment_method: null,
      users_id: [userId],
      compose: composeArray,
      table_id: Number(selectTable.options[selectTable.selectedIndex].value),
    };

    const idArticles = [];
    const quantity = [];

    for (const article of liArticles) {
      const quantitySpanArticle = article.getElementsByClassName('new-order-detail-article-span-count')[0];

      idArticles.push(Number(article.getAttribute('id-article')));
      quantity.push(Number(quantitySpanArticle.textContent));
    }

    composeArray.article_id = idArticles;
    composeArray.quantity = quantity;

    callBackHandleSubmitListArticles(detailsObj, composeArray);
  };

  /* INCREASES THE COUNT OF THE CORRESPONDING ARTICLE IN THE DETAIL LIST */

  const handleListenerClickPlusButton = (event) => {
    const liCount = event.currentTarget.parentElement.parentElement.getElementsByClassName('new-order-detail-article-span-count')[0];
    let actualCount = Number(liCount.textContent);
    actualCount += 1;
    liCount.textContent = actualCount;
  };

  /* DECREASES THE COUNT OF THE CORRESPONDING ARTICLE IN THE DETAIL LIST IF COUNT > 1 ELSE REMOVE CURRENT ARTICLE */

  const handleListenerClickMinusButton = (event) => {
    const liCount = event.currentTarget.parentElement.parentElement.getElementsByClassName('new-order-detail-article-span-count')[0];
    let actualCount = Number(liCount.textContent);

    if (actualCount === 1) {
      event.currentTarget.parentElement.parentElement.remove();
    }
    else {
      actualCount -= 1;
      liCount.textContent = actualCount;
    }
  };

  /* FUNCTION TO ADD AN ARTICLE TO THE LIST IF NOT ALREADY IN */

  const handleClickGridArticle = (e) => {
    const newOrderDetailArticleUl = document.getElementsByClassName('new-order-detail-article-ul')[0];

    const spansElementsIn = document.getElementsByClassName('new-order-detail-article-span');
    const spansElementsInMap = Array.from(spansElementsIn).map((elem) => elem.textContent.replace(/x[0-9]+/, '').trim());

    const checkSpan = spansElementsInMap.find((elem) => elem === e.currentTarget.textContent.trim());

    /* Condition to increase count of article span count if article already in list */

    if (checkSpan !== undefined && checkSpan.includes(e.currentTarget.textContent.trim())) {
      for (let i = 0; i < spansElementsIn.length; i += 1) {
        if (spansElementsIn[i].textContent.replace(/x[0-9]+/, '').trim() === e.currentTarget.textContent.trim()) {
          let num = Number(spansElementsIn[i].getElementsByClassName('new-order-detail-article-span-count')[0].textContent);
          num += 1;
          spansElementsIn[i].getElementsByClassName('new-order-detail-article-span-count')[0].textContent = num;
          break;
        }
      }
    }

    /* If condition is not met => create new LI article and append to list */
    else {
      const count = 1;

      /* Create LI element */

      const liElem = document.createElement('li');
      liElem.setAttribute('class', 'new-order-detail-article-li');
      liElem.setAttribute('price', e.currentTarget.getAttribute('price'));
      liElem.setAttribute('id-article', e.currentTarget.getAttribute('id-article'));

      /* Create SPAN element */

      const spanElem = document.createElement('span');
      spanElem.setAttribute('class', 'new-order-detail-article-span');
      spanElem.textContent = `${e.currentTarget.textContent} x`;

      /* Create SPAN COUNT element */

      const spanCountElem = document.createElement('span');
      spanCountElem.setAttribute('class', 'new-order-detail-article-span-count');
      spanCountElem.textContent = count;

      /* Create DIV element */

      const divElem = document.createElement('div');
      divElem.setAttribute('class', 'new-order-detail-article-div-button');

      /* Create MINUS BUTTON element */

      const minusButtonElem = document.createElement('button');
      minusButtonElem.setAttribute('class', 'minus-button');
      minusButtonElem.setAttribute('type', 'button');
      minusButtonElem.setAttribute('name', 'minus-button');
      minusButtonElem.textContent = '-';

      /* Create PLUS BUTTON element */

      const plusButtonElem = document.createElement('button');
      plusButtonElem.setAttribute('class', 'plus-button');
      plusButtonElem.setAttribute('type', 'button');
      plusButtonElem.setAttribute('name', 'plus-button');
      plusButtonElem.textContent = '+';

      /* APPEND elements */

      divElem.appendChild(minusButtonElem);
      divElem.appendChild(plusButtonElem);

      spanElem.appendChild(spanCountElem);

      liElem.appendChild(spanElem);
      liElem.appendChild(divElem);

      newOrderDetailArticleUl.appendChild(liElem);

      newOrderDetailArticleUl.scroll({
        top: newOrderDetailArticleUl.scrollHeight,
      });

      /* PLUS BUTTON management */

      plusButtonElem.addEventListener('click', handleListenerClickPlusButton);

      /* MINUS BUTTONS management */

      minusButtonElem.addEventListener('click', handleListenerClickMinusButton);
    }
  };

  const handleCategoryClick = (e) => {
    const containerCategoryGrid = document.getElementsByClassName('container-category-grid')[0];
    const gridCategoryElement = containerCategoryGrid.getElementsByClassName('grid-element');
    const backButton = containerCategoryGrid.getElementsByClassName('back-category-button')[0];

    containerCategoryGrid.style.gridTemplateColumns = 'repeat(2, 5.5rem)';

    for (const gridCategory of gridCategoryElement) {
      gridCategory.classList.remove('display-off');
      gridCategory.classList.remove('display-on');

      backButton.classList.add('display-on');

      if (gridCategory !== e.currentTarget) {
        gridCategory.classList.add('display-off');
      }

      else if (gridCategory === e.currentTarget) {
        gridCategory.classList.add('display-on');
      }
    }
    callBackHandleCategoryClick(e.currentTarget.getAttribute('category'));
  };

  const handleBackButtonClick = (e) => {
    const containerCategoryGrid = document.getElementsByClassName('container-category-grid')[0];
    const gridCategoryElement = containerCategoryGrid.getElementsByClassName('grid-element');

    const mediaQueryMin992 = window.matchMedia('(min-width: 992px)');
    const mediaQueryMax992 = window.matchMedia('(max-width: 992px)');

    if (mediaQueryMin992) {
      containerCategoryGrid.style.gridTemplateColumns = '';
    }

    else if (mediaQueryMax992) {
      containerCategoryGrid.style.gridTemplateColumns = 'repeat(var(--number-categories), 5.5rem';
    }

    if (e.currentTarget.classList.contains('display-on')) {
      e.currentTarget.classList.remove('display-on');
    }

    for (const gridCategory of gridCategoryElement) {
      if (gridCategory.classList.contains('display-off') || gridCategory.classList.contains('display-on')) {
        gridCategory.classList.remove('display-off');
        gridCategory.classList.remove('display-on');
      }
    }

    callBackHandleBackButtonClick();
  };

  /* FUNCTION TO FILTER UNIQUE CATEGORIES FROM DATA ARTICLES ARRAY OF OBJECTS */

  const dynamicCategories = () => {
    const arrayCategoriesFiltered = [];

    const filteredCategories = dataArticles.map((elem) => {
      if (!arrayCategoriesFiltered.find((element) => element.idCat === elem.Category.id)) {
        arrayCategoriesFiltered.push({ idCat: elem.Category.id, category: elem.Category.Category_Name });
      }
    });

    let count = 0;
    for (let i = 1; i <= arrayCategoriesFiltered.length; i += 5) {
      count += 1;
    }

    document.documentElement.style.setProperty('--number-rows-grid-categories', count);
    document.documentElement.style.setProperty('--number-categories', arrayCategoriesFiltered.length);
    return arrayCategoriesFiltered;
  };

  return (
    <div className="container-new-order">

      <div className="order-box-buttons">
        <Link to="/order">
          <button className="order-back-button" type="button">Retour</button>
        </Link>
      </div>

      <div className="table-order-box">
        <h4 className="table-order-box-title">Commande</h4>

        <select className="select-table-number" name="select-table-number" id="select-table-number">
          {resultOrdersSelectFiltered.map((elem) => <option key={elem.id} value={elem.id}>{elem.Place}</option>)}
        </select>
      </div>

      <div className="box-input-search-article">
        <input className="input-search-article" type="text" name="inputSearchArticle" onChange={handleTypedArticle} value={typedText} />

        <button className="eye-button eye-button-detail" type="button" onClick={handleEyeOpenClosedClick}>
          <img className="eye-button-img" src={detailDisplayNewOrder === 'active' ? openEye : closedEye} alt="eye" />
        </button>
      </div>

      <div className="wrap-desktop-box">
        <div className={detailDisplayNewOrder === 'active' ? 'new-order-detail-article-box active' : 'new-order-detail-article-box'}>
          <ul className="new-order-detail-article-ul">

            {/* <li className="new-order-detail-article-li">
              <span className="new-order-detail-article-span">Kebab x<span className="new-order-detail-article-span-count">1</span></span>
              <div className="new-order-detail-article-div-button">
                <button className="minus-button" type="button" name="minus-button">-</button>
                <button className="plus-button" type="button" name="plus-button">+</button>
              </div>
            </li> */}

          </ul>
        </div>

        <div className="wrap-desktop-grid">
          <div className="eye-button-article-wrap">
            <button className="eye-button eye-button-article" type="button" onClick={handleBottomEyeOpenClosedClick}>
              <img className="eye-button-article-img" src={gridDisplayNewOrder === 'active' ? openEye : closedEye} alt="eye" />
            </button>
          </div>

          <div className={detailDisplayNewOrder === 'active' ? 'container-grid-wrap active' : 'container-grid-wrap'}>
            <div className="container-article-grid">

              {dataArticles.map((article) => <div onClick={handleClickGridArticle} key={article.id} className={`grid-element catColor${article.Category.id}`} price={article.Price} id-article={article.id}>{article.Name}</div>)}

            </div>
          </div>

          <div className={detailDisplayNewOrder === 'active' ? 'container-grid-wrap active' : 'container-grid-wrap'}>
            <div className="container-category-grid">

              <button className="back-category-button" type="button" name="back-category-button" onClick={handleBackButtonClick}>
                <img className="back-category-button-img" src={arrowLeft} alt="left arrow" />
              </button>

              {dynamicCategories().map((elem) => <div key={elem.idCat} className={`grid-element catColor${elem.idCat}`} category={elem.category} onClick={handleCategoryClick}>{elem.category}</div>)}

            </div>
          </div>
        </div>
      </div>

      <div className="submit-order-wrap">
        <button className="submit-order" type="button" name="submit-order" onClick={handleSubmitListArticles}>Valider</button>
      </div>
    </div>
  );
}

NewOrder.propTypes = {
  closedEye: PropTypes.string,
  openEye: PropTypes.string,
  arrowLeft: PropTypes.string,
  callBackHandleEyeOpenClosedClick: PropTypes.func,
  callBackHandleBottomEyeOpenClosedClick: PropTypes.func,
  callBackHandleTypedArticle: PropTypes.func,
  callBackHandleCategoryClick: PropTypes.func,
  callBackHandleBackButtonClick: PropTypes.func,
  callBackHandleSubmitListArticles: PropTypes.func,
  detailDisplayNewOrder: PropTypes.string,
  gridDisplayNewOrder: PropTypes.string,
  typedText: PropTypes.string,
  dataArticles: PropTypes.array,
  userId: PropTypes.any,
  tables: PropTypes.array,
  orders: PropTypes.array,
}.isRequired;

export default NewOrder;
