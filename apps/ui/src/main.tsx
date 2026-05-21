import {StrictMode} from 'react';
import * as ReactDOM from 'react-dom/client';
import {ThemeProvider, CssBaseline} from '@mui/material';
import {createTheme} from '@mui/material/styles';
import App from './app/app';

const theme = createTheme();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
