import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const render = () => {
	ReactDOM.render(
		<React.StrictMode>
			<App/>
		</React.StrictMode>,
		document.getElementById('root')
	);
}

render()

if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./App', render);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();