import { ConfigProvider } from './contexts/ConfigContext';
import { Scene3D } from './components/Scene3D';
import { Sidebar } from './components/Sidebar';
import './App.css';

function App() {
  return (
    <ConfigProvider>
      <div className="app">
        <Sidebar />
        <div className="viewport">
          <Scene3D />
        </div>
      </div>
    </ConfigProvider>
  );
}

export default App;
