import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // --- STATES ---
  const [jd, setJd] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  
  const [questions, setQuestions] = useState("");
  const [loadingQ, setLoadingQ] = useState(false);

  // ✅ NAYA STATE: Auto Resume Builder ke liye
  const [tailoredResume, setTailoredResume] = useState("");
  const [loadingR, setLoadingR] = useState(false);

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
      alert("Smart Tip: Please upload your resume in .txt format, or paste it directly!");
    }
  };

  const handleAnalyze = async () => {
    if (!jd) return alert("Please enter the Job Description!");
    if (!resumeText) return alert("Please upload or paste your Resume!");
    
    setLoading(true); setResult(""); 
    try {
      const response = await axios.post("http://localhost:5000/api/resume/analyze", { jobDescription: jd, resumeText: resumeText });
      setResult(response.data.data);
    } catch (error) { alert("Something went wrong!"); } 
    setLoading(false);
  };

  const handleGenerateQuestions = async () => {
    if (!jd) return alert("Please enter the Job Description first!");
    
    setLoadingQ(true); setQuestions(""); 
    try {
      const response = await axios.post("http://localhost:5000/api/resume/questions", { jobDescription: jd });
      setQuestions(response.data.data);
    } catch (error) { alert("Something went wrong!"); }
    setLoadingQ(false);
  };

  // ✅ NAYA FUNCTION: Resume Auto-Tailor karne ke liye
  const handleBuildResume = async () => {
    if (!jd) return alert("Please enter the Job Description first!");
    if (!resumeText) return alert("Please upload or paste your Current Resume!");
    
    setLoadingR(true); setTailoredResume(""); 
    try {
      const response = await axios.post("http://localhost:5000/api/resume/build", { jobDescription: jd, resumeText: resumeText });
      setTailoredResume(response.data.data);
    } catch (error) { alert("Something went wrong!"); }
    setLoadingR(false);
  };

  return (
    <div className="container">
      <h1 className="title">CareerCraft AI</h1>
      <p className="subtitle">Upload Resume & Paste Job Description to get ATS Match, Roadmap, Interview Prep & New Resume</p>
      
      {/* Job Description Card */}
      <div className="card">
        <h3>Job Description</h3>
        <textarea 
          className="input-box" 
          rows="5" 
          placeholder="Paste Job Description here..." 
          value={jd} 
          onChange={(e) => setJd(e.target.value)} 
        />
      </div>

      {/* Resume Upload Card */}
      <div className="card">
        <h3>Your Resume</h3>
        <input type="file" accept=".txt" onChange={handleFileUpload} className="file-input" />
        <p style={{ color: '#94a3b8', margin: '10px 0', fontSize: '0.9rem' }}>OR paste directly below:</p>
        <textarea 
          className="input-box" 
          rows="5" 
          placeholder="Paste your Resume text here..." 
          value={resumeText} 
          onChange={(e) => setResumeText(e.target.value)} 
        />
      </div>
      
      {/* Action Buttons (Ab 3 buttons hain) */}
      <div className="button-group">
        <button onClick={handleAnalyze} disabled={loading} className="action-btn btn-analyze">
          {loading && <span className="spinner"></span>}
          {loading ? "Analyzing..." : "Analyze & Roadmap 📊"}
        </button>

        <button onClick={handleGenerateQuestions} disabled={loadingQ} className="action-btn btn-interview">
          {loadingQ && <span className="spinner"></span>}
          {loadingQ ? "Generating..." : "Interview Qs 🎯"}
        </button>

        {/* ✅ NAYA BUTTON: Resume Build */}
        <button onClick={handleBuildResume} disabled={loadingR} className="action-btn btn-build">
          {loadingR && <span className="spinner"></span>}
          {loadingR ? "Building..." : "Auto-Tailor Resume 📝"}
        </button>
      </div>

      {/* AI Result: Roadmap */}
      {result && (
        <div className="result-box result-roadmap">
          <h3 style={{ color: '#00c6ff', marginTop: 0 }}>📊 ATS Analysis & Career Roadmap:</h3>
          <p>{result}</p> 
        </div>
      )}

      {/* AI Result: Interview Questions */}
      {questions && (
        <div className="result-box result-questions">
          <h3 style={{ color: '#38ef7d', marginTop: 0 }}>🎯 Custom Interview Questions:</h3>
          <p>{questions}</p> 
        </div>
      )}

      {/* ✅ NAYA AI Result: Tailored Resume */}
      {tailoredResume && (
        <div className="result-box result-build">
          <h3 style={{ color: '#fca5a5', marginTop: 0 }}>📝 ATS-Optimized Tailored Resume:</h3>
          <p>{tailoredResume}</p> 
        </div>
      )}
    </div>
  );
}

export default App;