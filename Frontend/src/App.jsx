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

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // ✅ NAYA STATE: Mic track karne ke liye
  const [isListening, setIsListening] = useState(false);

  // ✅ SMART FORMATTER: AI ke "**text**" ko asli Bold mein convert karta hai
  const renderText = (text) => {
    if (!text) return null;
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text conversion
      .replace(/\n/g, '<br/>'); // Line break preservation
    return <div dangerouslySetInnerHTML={{ __html: formattedText }} style={{ lineHeight: '1.6' }} />;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    window.print();
  };

  // ✅ NAYA FUNCTION: Voice to Text (Speak JD)
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Oops! Your browser doesn't support Voice Input. Try Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; 
    recognition.interimResults = false;
    recognition.lang = 'en-IN'; 

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setJd((prevJd) => prevJd ? prevJd + " " + transcript : transcript);
    };

    recognition.onerror = (event) => {
      console.error("Mic Error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // Text to Speech (AI HR)
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
    } else {
      alert("Oops! Your browser does not support the Voice feature.");
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return; 

    if (file.type === "text/plain" || file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText(event.target.result); 
      };
      reader.readAsText(file);
    } else {
      alert("Please upload your resume in .txt format, or paste it directly.");
    }
  };

  const handleAnalyze = async () => {
    if (!jd) return alert("Please enter the Job Description.");
    if (!resumeText) return alert("Please upload or paste your Resume.");
    
    setLoading(true); setResult(""); 
    try {
      const response = await axios.post("http://localhost:5000/api/resume/analyze", { jobDescription: jd, resumeText: resumeText });
      setResult(response.data.data);
    } catch (error) { 
      console.error("API Error:", error.response?.data || error.message);
      alert("Backend Error: " + (error.response?.data?.error || "Something went wrong.")); 
    } 
    setLoading(false);
  };

  const handleGenerateQuestions = async () => {
    if (!jd) return alert("Please enter the Job Description first.");
    
    setLoadingQ(true); setQuestions(""); stopSpeaking(); 
    try {
      const response = await axios.post("http://localhost:5000/api/resume/questions", { jobDescription: jd });
      setQuestions(response.data.data);
    } catch (error) { 
      console.error("API Error:", error.response?.data || error.message);
      alert("Backend Error: " + (error.response?.data?.error || "Something went wrong.")); 
    }
    setLoadingQ(false);
  };

  const handleBuildResume = async () => {
    if (!jd) return alert("Please enter the Job Description first.");
    if (!resumeText) return alert("Please upload or paste your Current Resume.");
    
    setLoadingR(true); setTailoredResume(""); 
    try {
      const response = await axios.post("http://localhost:5000/api/resume/build", { jobDescription: jd, resumeText: resumeText });
      setTailoredResume(response.data.data);
    } catch (error) { 
      console.error("API Error:", error.response?.data || error.message);
      alert("Backend Error: " + (error.response?.data?.error || "Check backend terminal, server might be down.")); 
    }
    setLoadingR(false);
  };

  const handleFindPortals = async () => {
    if (!jd) return alert("Please enter the Job Description first.");
    
    setLoadingP(true); setPortals(""); 
    try {
      const response = await axios.post("http://localhost:5000/api/resume/portals", { jobDescription: jd });
      setPortals(response.data.data);
    } catch (error) { 
      console.error("API Error:", error.response?.data || error.message);
      alert("Backend Error: " + (error.response?.data?.error || "Check backend terminal.")); 
    }
    setLoadingP(false);
  };

  return (
    <div className="app-wrapper">
      <div className="bg-grid"></div>

      {/* ✅ PREMIUM NAVBAR (Header) */}
      <nav className="navbar">
        <div className="nav-logo">CareerCraft <span className="ai-text">AI</span></div>
        <div className="nav-badge">INNOVATEX 2026</div>
      </nav>

      <div className="container">
        <p className="subtitle">Upload Resume & Paste Job Description to get ATS Match, Roadmap, Interview Prep & New Resume</p>
        
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ marginBottom: 0 }}>Job Description</h3>
            
            {/* ✅ NAYA MIC BUTTON */}
            <button 
              onClick={startListening} 
              disabled={isListening}
              style={{
                background: isListening ? '#ef4444' : '#3b82f6',
                color: 'white', border: 'none', padding: '6px 12px', borderRadius: '50px',
                cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px',
                animation: isListening ? 'pulse 1.5s infinite' : 'none', transition: '0.3s'
              }}
            >
              {isListening ? '🎙️ Listening...' : '🎤 Speak JD'}
            </button>
          </div>
          <textarea 
            className="input-box" 
            rows="5" 
            placeholder="Paste Job Description here, or click 'Speak JD' to dictate..." 
            value={jd} 
            onChange={(e) => setJd(e.target.value)} 
          />
        </div>

        <div className="card">
          <h3>Your Resume</h3>
          <input type="file" accept=".txt, .pdf" onChange={handleFileUpload} className="file-input" />
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
            {loading ? "Analyzing..." : "Analyze & Roadmap"}
          </button>

          <button onClick={handleGenerateQuestions} disabled={loadingQ} className="action-btn btn-interview">
            {loadingQ && <span className="spinner"></span>}
            {loadingQ ? "Generating..." : "Interview Questions"}
          </button>

          <button onClick={handleBuildResume} disabled={loadingR} className="action-btn btn-build">
            {loadingR && <span className="spinner"></span>}
            {loadingR ? "Building..." : "Auto-Tailor Resume"}
          </button>

          <button onClick={handleFindPortals} disabled={loadingP} className="action-btn btn-portals">
            {loadingP && <span className="spinner"></span>}
            {loadingP ? "Searching..." : "Find Job Portals"}
          </button>
        </div>

        {result && (
          <div className="result-box result-roadmap">
            <h3 style={{ color: '#60a5fa', marginTop: 0 }}>ATS Analysis & Career Roadmap</h3>
            {renderText(result)}
          </div>
        )}

        {questions && (
          <div className="result-box result-questions">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ color: '#34d399', margin: 0 }}>Custom Interview Questions</h3>
              <button 
                onClick={() => isSpeaking ? stopSpeaking() : speakText(questions)}
                style={{
                  background: isSpeaking ? '#ef4444' : '#10b981',
                  color: 'white', border: 'none', padding: '8px 16px', borderRadius: '50px',
                  cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.2)', transition: '0.3s'
                }}
              >
                {isSpeaking ? 'Stop AI HR' : 'Listen to AI HR'}
              </button>
            </div>
            {renderText(questions)}
          </div>
        )}

        {tailoredResume && (
          <div className="result-box result-build">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ color: '#a78bfa', margin: 0 }}>ATS-Optimized Tailored Resume</h3>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => copyToClipboard(tailoredResume)}
                  style={{
                    background: copied ? '#10b981' : '#334155', color: 'white', border: 'none', 
                    padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', transition: '0.3s'
                  }}
                >
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>

                <button 
                  onClick={downloadPDF}
                  style={{
                    background: '#a78bfa', color: 'white', border: 'none', 
                    padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem',
                    fontWeight: 'bold', transition: '0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  Save as PDF
                </button>
              </div>
            </div>
            {renderText(tailoredResume)}
          </div>
        )}

        {portals && (
          <div className="result-box result-portals">
            <h3 style={{ color: '#fbbf24', marginTop: 0 }}>Best Platforms to Apply</h3>
            {renderText(portals)}
          </div>
        )}
      </div>

      {/* ✅ PREMIUM BOTTOM FOOTER */}
      <footer className="footer">
        <p>Developed with 💡 for INNOVATEX 2026 by Team <strong>[CareerForge]</strong></p>
      </footer>
    </div>
  );
}

export default App;