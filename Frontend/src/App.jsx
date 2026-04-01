import { useState } from 'react';

import axios from 'axios';
import './App.css';

function App() {
 
  const [jd, setJd] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const handleFileUpload = (e) => {
    
    const file = e.target.files[0];
    if (!file) return; 

    if (file.type === "text/plain") {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setResumeText(event.target.result); 
      };
      reader.readAsText(file);
      
    } else {
  
      alert("Smart Tip: Abhi ke liye apna resume .txt format mein upload karein, ya box mein direct paste karein!");
    }
  };