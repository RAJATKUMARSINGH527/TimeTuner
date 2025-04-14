import { useState } from 'react'
import TimeTuner from './components/TimeTuner'
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';


function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<TimeTuner />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* Add more routes here as needed */}
        </Routes>
      </Router>
     
    </>
  )
}

export default App
