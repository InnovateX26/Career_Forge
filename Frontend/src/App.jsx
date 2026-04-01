import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
 
  const [jd, setJd] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const [questions, setQuestions] = useState("");
  const [loadingQ, setLoadingQ] = useState(false);
  
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
      alert("Something went wrong!"); 
    }
    
    setLoading(false);
  };

  const handleGenerateQuestions = async () => {
    if (!jd) return alert("Please enter Job Description first!");
    
    setLoadingQ(true);
    setQuestions("");

    try {
      const response = await axios.post("http://localhost:5000/api/resume/questions", {
        jobDescription: jd
      });
      setQuestions(response.data.data);
    } catch (error) {
      console.error("Error", error);
      alert("Something went wrong!"); 
    }
    setLoadingQ(false);
  };

  return (
    <div className="container">
      <h1>CareerCraft AI</h1>
      <p>Upload Resume & Paste Job Description to get ATS Match & Roadmap</p>
      
      {/* 1. Job Description Box */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Job Description</h3>
        <textarea 
          rows="6" 
          cols="50" 
          placeholder="Paste Job Description here..."
          value={jd} 
          onChange={(e) => setJd(e.target.value)} 
          style={{ width: "100%", padding: "10px" }}
        />
      </div>

      {/* 2. Resume Upload Section */}
      <div style={{ marginBottom: "20px", padding: "15px", border: "1px dashed #888", borderRadius: "8px" }}>
        <h3>Your Resume</h3>
        
        
        <input 
          type="file" 
          accept=".txt" 
          onChange={handleFileUpload} 
          style={{ marginBottom: "15px", display: "block" }}
        />
        
        <p style={{ margin: "5px 0" }}>OR paste directly below:</p>
        
       
        <textarea 
          rows="6" 
          cols="50" 
          placeholder="Paste your Resume text here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          style={{ width: "100%", padding: "10px" }}
        />
      </div>

      {/* 3. Action Buttons */}
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={handleAnalyze} disabled={loading} style={{ padding: "12px 24px", fontSize: "16px", cursor: "pointer", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: "5px" }}>
          {loading ? "Analyzing Match..." : "Analyze Resume & Generate Roadmap"}
        </button>

        <button onClick={handleGenerateQuestions} disabled={loadingQ} style={{ padding: "12px 24px", fontSize: "16px", cursor: "pointer", backgroundColor: "#27ae60", color: "white", border: "none", borderRadius: "5px" }}>
          {loadingQ ? "Generating Questions..." : "Get Interview Questions 🎯"}
        </button>
      </div>

      {/* 4. AI Result Section (Roadmap) */}
      {result && (
        <div style={{ whiteSpace: 'pre-wrap', textAlign: 'left', padding: '20px', marginTop: '30px', backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px solid #444' }}>
          <h3>ATS Analysis & Career Roadmap:</h3>
          <p>{result}</p> 
        </div>
      )}
      
      {/* 3. Analyze Button */}
      
      <button onClick={handleAnalyze} disabled={loading} style={{ padding: "12px 24px", fontSize: "16px", cursor: "pointer" }}>
        {loading ? "Analyzing Match & Generating Roadmap..." : "Analyze Resume & Generate Roadmap"}
      </button>

      {/* 4. AI Result Section */}
      {/* Karan: Ye dibba tabhi dikhega jab 'result' state mein kuch text hoga (Conditional Rendering) */}
      {result && (
        
        <div style={{ whiteSpace: 'pre-wrap', textAlign: 'left', padding: '20px', marginTop: '30px', backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px solid #444' }}>
          <h3>ATS Analysis & Career Roadmap:</h3>
          <p>{result}</p> 
        </div>
      )}
    </div>
  );
}

export default App;