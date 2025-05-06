
import { HashRouter, useRoutes } from 'react-router-dom';
import { router } from './router';

type Props = {}

const Routers = () => useRoutes(router);

function App({}: Props) {
  return (
   <HashRouter>
    <Routers />
   </HashRouter>
  )
}

export default App