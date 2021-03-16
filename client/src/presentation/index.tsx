import { ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayJsUtils from '@date-io/dayjs';
import App from './App';
import { store } from './store';
import { theme } from './theme/theme';

export default class Presentation {
  static init() {
    ReactDOM.render(
      <React.StrictMode>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={DayJsUtils}>
              <App />
            </MuiPickersUtilsProvider>
          </ThemeProvider>
        </Provider>
      </React.StrictMode>,
      document.getElementById('root')
    );
  }
}
