import {useState} from 'react';
import {Login} from './components/Login';
import {MessageForm} from './components/MessageForm';

export const App = () => {
  const [authenticated, setAuthenticated] = useState(
    !!sessionStorage.getItem('token'),
  );

  return authenticated ? (
    <MessageForm />
  ) : (
    <Login onLogin={() => setAuthenticated(true)} />
  );
};

export default App;
