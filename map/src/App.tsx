import { TopWrapper } from '@components/TopWrapper';
import { environment, initConfig } from '@lib/config';

// -----------------------------------------------------------------------------

function App() {
  initConfig(environment);
  return (
      <TopWrapper />
  )
}
// -----------------------------------------------------------------------------

export default App

// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------

