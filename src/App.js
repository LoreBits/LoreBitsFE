import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import SettingPanel from './SettingPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<MainPage />} />

        <Route path="/setting" element={<SettingPanel />} />
      </Routes>
    </Router>
  );
}

export default App;