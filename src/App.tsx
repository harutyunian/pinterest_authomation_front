import { AppRouter } from './routes/AppRouter';
import { GoogleAnalyticsTracker } from './components/GoogleAnalyticsTracker';

function App() {
  return (
    <>
      <GoogleAnalyticsTracker />
      <AppRouter />
    </>
  );
}

export default App;
