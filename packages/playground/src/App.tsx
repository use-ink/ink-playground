import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { Editor } from './components/Editor';
import { Console } from './components/Console';
import { AppContext } from './context';
import { Action, defaultState, reducer } from './redux/reducer';
import { useState } from 'react';

const App = () => {
  const [state, setState] = useState(defaultState)

  const dispatch = (action: Action): void => {
    setState(reducer(action, state))
  }

  return (
    <AppContext.Provider value={[state, dispatch]}>
      <Layout>
        <Header />
        <Editor />
        <Console />
      </Layout>
    </AppContext.Provider>
  );
};

export default App;
