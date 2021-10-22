import * as ReactDOM from 'react-dom';
import App from './page/App';
import './style/fonts.css';
import './style/tailwind.css';
import './style/global.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/mdc-dark-deeppurple/theme.css';
import 'primeicons/primeicons.css';

ReactDOM.render(<App />, document.getElementById('container'));
