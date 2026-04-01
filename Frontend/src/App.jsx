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

  const [tailoredResume, setTailoredResume] = useState("");
  const [loadingR, setLoadingR] = useState(false);

  
  const [portals, setPortals] = useState("");
  const [loadingP, setLoadingP] = useState(false);

  //AI Voice track

const [isSpeaking, setIsSpeaking] = useState(false);

const speakText = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*#_]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);

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
    } catch (error) { 
      console.error("API Error:", error.response?.data || error.message);
      alert("Backend Error: " + (error.response?.data?.error || "Something went wrong!")); 
    } 
    setLoading(false);
  };

  const handleGenerateQuestions = async () => {
    if (!jd) return alert("Please enter the Job Description first!");
    
    setLoadingQ(true); setQuestions(""); 
    try {
      const response = await axios.post("http://localhost:5000/api/resume/questions", { jobDescription: jd });
      setQuestions(response.data.data);
    } catch (error) { 
      console.error("API Error:", error.response?.data || error.message);
      alert("Backend Error: " + (error.response?.data?.error || "Something went wrong!")); 
    }
    setLoadingQ(false);
  };

  // ✅ RESTORED: Auto-Build Resume Function (Ye delete ho gaya tha)
  const handleBuildResume = async () => {
    if (!jd) return alert("Please enter the Job Description first!");
    if (!resumeText) return alert("Please upload or paste your Current Resume!");
    
    setLoadingR(true); setTailoredResume(""); 
    try {
      const response = await axios.post("http://localhost:5000/api/resume/build", { jobDescription: jd, resumeText: resumeText });
      setTailoredResume(response.data.data);
    } catch (error) { 
      console.error("API Error:", error.response?.data || error.message);
      alert("Backend Error: " + (error.response?.data?.error || "Check backend terminal, server might be down!")); 
    }
    setLoadingR(false);
  };

  // ✅ FIXED: Job Portals Function
  const handleFindPortals = async () => {
    if (!jd) return alert("Please enter the Job Description first!");
    
    setLoadingP(true); setPortals(""); 
    try {
      const response = await axios.post("http://localhost:5000/api/resume/portals", { jobDescription: jd });
      setPortals(response.data.data);
    } catch (error) { 
      console.error("API Error:", error.response?.data || error.message);
      alert("Backend Error: " + (error.response?.data?.error || "Check backend terminal!")); 
    }
    setLoadingP(false);
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
      
      {/* Action Buttons */}
      <div className="button-group">
        <button onClick={handleAnalyze} disabled={loading} className="action-btn btn-analyze">
          {loading && <span className="spinner"></span>}
          {loading ? "Analyzing..." : "Analyze & Roadmap 📊"}
        </button>

        <button onClick={handleGenerateQuestions} disabled={loadingQ} className="action-btn btn-interview">
          {loadingQ && <span className="spinner"></span>}
          {loadingQ ? "Generating..." : "Interview Qs 🎯"}
        </button>

        <button onClick={handleBuildResume} disabled={loadingR} className="action-btn btn-build">
          {loadingR && <span className="spinner"></span>}
          {loadingR ? "Building..." : "Auto-Tailor Resume 📝"}
        </button>

        <button onClick={handleFindPortals} disabled={loadingP} className="action-btn btn-portals">
          {loadingP && <span className="spinner"></span>}
          {loadingP ? "Searching..." : "Find Job Portals 🌍"}
        </button>
      </div>

      {/* AI Results */}
      {result && (
        <div className="result-box result-roadmap">
          <h3 style={{ color: '#00c6ff', marginTop: 0 }}>📊 ATS Analysis & Career Roadmap:</h3>
          <p>{result}</p> 
        </div>
      )}

      {questions && (
        <div className="result-box result-questions">
          <h3 style={{ color: '#38ef7d', marginTop: 0 }}>🎯 Custom Interview Questions:</h3>
          <p>{questions}</p> 
        </div>
      )}

      {tailoredResume && (
        <div className="result-box result-build">
          <h3 style={{ color: '#fca5a5', marginTop: 0 }}>📝 ATS-Optimized Tailored Resume:</h3>
          <p>{tailoredResume}</p> 
        </div>
      )}

      {/* ✅ FIXED: Ye block component ke bahar tha, ab andar aa gaya */}
      {portals && (
        <div className="result-box result-portals">
          <h3 style={{ color: '#fcd34d', marginTop: 0 }}>🌍 Best Platforms to Apply:</h3>
          <p>{portals}</p> 
        </div>
      )}
    </div>
  );
}

export default App;