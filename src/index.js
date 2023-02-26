import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import {createStore,applyMiddleware} from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer,{rootSaga} from './modules';
import createSagaMiddleware from '@redux-saga/core';
import { loadableReady } from '@loadable/component';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer,
              window.__PRELOADED_STATE__,
              applyMiddleware(thunk,sagaMiddleware));


sagaMiddleware.run(rootSaga);

// hydarate를 사용하기전
// ReactDOM.render(
//   <Provider store={store}>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </Provider>,
//   document.getElementById('root')
// );

const Root = () => {
  return(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
  );
};

const root = document.getElementById('root');

// 프로덕션 환경에서는 loadableReady와 hydrate를 사용하고 개발환경에서는 기존 방식으로 처리
if(process.env.NODE_ENV === 'production'){
  loadableReady(() => {
    ReactDOM.hydrate(<Root />,root);
  })
}
else{
  ReactDOM.render(<Root />,root);
}

reportWebVitals();