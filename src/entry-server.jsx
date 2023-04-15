import ReactDOMServer from 'react-dom/server';
import App from './App';
import './index.css';

export const render = () => ReactDOMServer.renderToString(<App />);
