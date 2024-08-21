import "./App.css";
import Footer from './components/Footer/Footer';
import { Navigation } from './components/Navigation/Routes';
import { AuthProvider } from './services/AuthContext';

function App() {
  return (
    <div className="App">
      <AuthProvider>
      <Navigation />
      <Footer />
      </AuthProvider>
    </div>
  );
}

export default App;
