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

  // ✅ NAYA STATE: AI Voice track karne ke liye
  const [isSpeaking, setIsSpeaking] = useState(false);

  // ✅ NAYA FUNCTION: Text ko Aawaz mein badalne ke liye
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Pehle ki aawaz roko
      
      // Markdown symbols (* aur #) ko hata dete hain taaki AI unko na bole
      const cleanText = text.replace(/[*#_]/g, ''); 
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95; // Thoda aaram se bolega interview style mein
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Oops! Tumhara browser Voice feature support nahi karta.");
    }
  };

  // ✅ NAYA FUNCTION: Aawaz rokne ke liye
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

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
    
    setLoadingQ(true); setQuestions(""); stopSpeaking(); 
    try {
      const response = await axios.post("http://localhost:5000/api/resume/questions", { jobDescription: jd });
      setQuestions(response.data.data);
    } catch (error) { 
      console.error("API Error:", error.response?.data || error.message);
      alert("Backend Error: " + (error.response?.data?.error || "Something went wrong!")); 
    }
    setLoadingQ(false);
  };

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
      <h1 className="title">CareerCraft <span className="ai-text">AI</span></h1>
      <p className="subtitle">Upload Resume & Paste Job Description to get ATS Match, Roadmap, Interview Prep & New Resume</p>
      
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

      {result && (
        <div className="result-box result-roadmap">
          <h3 style={{ color: '#60a5fa', marginTop: 0 }}>📊 ATS Analysis & Career Roadmap:</h3>
          <p>{result}</p> 
        </div>
      )}

      {/* ✅ VOICE BUTTON INCLUDED HERE */}
      {questions && (
        <div className="result-box result-questions">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ color: '#34d399', margin: 0 }}>🎯 Custom Interview Questions:</h3>
            <button 
              onClick={() => isSpeaking ? stopSpeaking() : speakText(questions)}
              style={{
                background: isSpeaking ? '#ef4444' : '#10b981',
                color: 'white', border: 'none', padding: '8px 16px', borderRadius: '50px',
                cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.2)', transition: '0.3s'
              }}
            >
              {isSpeaking ? '⏹️ Stop AI HR' : '▶️ Listen to AI HR'}
            </button>
          </div>
          <p>{questions}</p> 
        </div>
      )}

      {/* ✅ PERFECT TAILORED RESUME BLOCK */}
      {tailoredResume && (
        <div className="result-box result-build">
          <h3 style={{ color: '#a78bfa', marginTop: 0 }}>📝 ATS-Optimized Tailored Resume:</h3>
          <p>{tailoredResume}</p> 
        </div>
      )}

      {portals && (
        <div className="result-box result-portals">
          <h3 style={{ color: '#fbbf24', marginTop: 0 }}>🌍 Best Platforms to Apply:</h3>
          <p>{portals}</p> 
        </div>
      )}
    </div>
  );
}

export default App;