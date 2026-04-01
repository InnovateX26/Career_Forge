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

  const handleAnalyze = async () => {
   
    if (!jd) return alert("Please enter Job Description!");
    if (!resumeText) return alert("Please upload or paste your Resume!");
    
    setLoading(true);
    setResult(""); 
    
    try {
      const response = await axios.post("http://localhost:5000/api/resume/analyze", {
        jobDescription: jd,
        resumeText: resumeText
      });

      setResult(response.data.data);
    } catch (error) {
      console.error("Error fetching data", error);
      alert("Something went wrong!"); // Agar backend fat gaya ya band hai toh error dikhao.
    }
    
    setLoading(false);
  };