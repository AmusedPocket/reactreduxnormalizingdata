import { useSelector } from 'react-redux';
import {createSelector} from 'reselect';

const LOAD_ARTICLES = 'article/loadArticles';
const ADD_ARTICLE = 'article/addArticle';

export const loadArticles = (articles) => {
  return {
    type: LOAD_ARTICLES,
    articles
  };
};

export const addArticle = (article) => {
  return {
    type: ADD_ARTICLE,
    article
  };
};

export const fetchArticles = () => async (dispatch) => {
  const response = await fetch('/api/articles');
  const articles = await response.json();
  dispatch(loadArticles(articles));
};

export const writeArticle = (payload) => async (dispatch) => {
  const response = await fetch('/api/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    const article = await response.json();
    dispatch(addArticle(article));
    return article;
  }
};

const selectArticles = useSelector((state) => state.entries)

export const selectArticlesArray = createSelector(selectArticles, () => {
  const articles = Object.values(selectArticles);
  return articles;
})

const initialState = { entries: {}, isLoading: true };

const articleReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ARTICLES: {
      const articlesObj = {}
      action.articles.map((article) => articlesObj[article.id] = article);
      return { ...state, entries: articlesObj };
    }
    case ADD_ARTICLE:
      return { ...state, entries: [...state.entries, action.article] };
    default:
      return state;
  }
};

export default articleReducer;
