import { useState } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js'; 
import './App.css';

function App() {
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
  const [isListening, setIsListening] = useState(false);

  const renderText = (text) => {
    if (!text) return null;
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
    return <div dangerouslySetInnerHTML={{ __html: formattedText }} style={{ lineHeight: '1.6' }} />;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ DIRECT DOWNLOAD PDF LOGIC
  const downloadPDF = () => {
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = tailoredResume
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');

    tempContainer.style.padding = '40px';
    tempContainer.style.color = '#000000';
    tempContainer.style.background = '#ffffff';
    tempContainer.style.fontFamily = 'Arial, sans-serif';
    tempContainer.style.fontSize = '12pt';
    tempContainer.style.lineHeight = '1.5';

    const opt = {
      margin:       10,
      filename:     'Tailored_Resume_CareerForge.pdf',
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 3, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(tempContainer).save();
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser not supported");
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setJd((prev) => prev + " " + transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_]/g, ''));
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => { window.speechSynthesis.cancel(); setIsSpeaking(false); };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setResumeText(event.target.result);
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/resume/analyze", { jobDescription: jd, resumeText });
      setResult(res.data.data);
    } catch (e) { alert("Error analyzing"); }
    setLoading(false);
  };

  const handleGenerateQuestions = async () => {
    setLoadingQ(true);
    try {
      const res = await axios.post("http://localhost:5000/api/resume/questions", { jobDescription: jd });
      setQuestions(res.data.data);
    } catch (e) { alert("Error"); }
    setLoadingQ(false);
  };

  const handleBuildResume = async () => {
    setLoadingR(true);
    try {
      const res = await axios.post("http://localhost:5000/api/resume/build", { jobDescription: jd, resumeText });
      setTailoredResume(res.data.data);
    } catch (e) { alert("Error"); }
    setLoadingR(false);
  };

  const handleFindPortals = async () => {
    setLoadingP(true);
    try {
      const res = await axios.post("http://localhost:5000/api/resume/portals", { jobDescription: jd });
      setPortals(res.data.data);
    } catch (e) { alert("Error"); }
    setLoadingP(false);
  };

  return (
    <div className="app-wrapper">
      <div className="bg-grid"></div>
      <nav className="navbar">
        <div className="nav-logo">CareerCraft <span className="ai-text">AI</span></div>
        <div className="nav-badge">INNOVATEX 2026</div>
      </nav>

      <div className="container">
        <p className="subtitle">AI-Powered ATS Matching & Career Development Suite</p>
        
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3>Job Description</h3>
            <button onClick={startListening} disabled={isListening} className="mic-btn" style={{ background: isListening ? '#ef4444' : '#3b82f6'}}>
              {isListening ? '🎙️ Listening...' : '🎤 Speak JD'}
            </button>
          </div>
          <textarea className="input-box" rows="5" value={jd} onChange={(e) => setJd(e.target.value)} />
        </div>

        <div className="card">
          <h3>Your Resume</h3>
          <input type="file" onChange={handleFileUpload} className="file-input" />
          <textarea className="input-box" rows="5" value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
        </div>
        
        <div className="button-group">
          <button onClick={handleAnalyze} className="action-btn btn-analyze">{loading ? "Analyzing..." : "Analyze & Roadmap"}</button>
          <button onClick={handleGenerateQuestions} className="action-btn btn-interview">{loadingQ ? "Generating..." : "Interview Questions"}</button>
          <button onClick={handleBuildResume} className="action-btn btn-build">{loadingR ? "Building..." : "Auto-Tailor Resume"}</button>
          <button onClick={handleFindPortals} className="action-btn btn-portals">{loadingP ? "Searching..." : "Find Job Portals"}</button>
        </div>

        {result && <div className="result-box"><h3>Analysis & Roadmap</h3>{renderText(result)}</div>}
        
        {questions && (
          <div className="result-box">
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <h3>Interview Questions</h3>
              <button onClick={() => isSpeaking ? stopSpeaking() : speakText(questions)} className="voice-btn">
                {isSpeaking ? 'Stop AI HR' : 'Listen to AI HR'}
              </button>
            </div>
            {renderText(questions)}
          </div>
        )}

        {tailoredResume && (
          <div className="result-box">
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <h3>ATS-Optimized Resume</h3>
              <div style={{display:'flex', gap:'10px'}}>
                <button onClick={() => copyToClipboard(tailoredResume)} className="copy-btn">{copied ? 'Copied!' : 'Copy Text'}</button>
                {/* ✅ UPDATED DOWNLOAD BUTTON */}
                <button onClick={downloadPDF} className="download-btn" style={{background:'#a78bfa', color:'white', border:'none', padding:'8px 15px', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>
                   Download PDF
                </button>
              </div>
            </div>
            {renderText(tailoredResume)}
          </div>
        )}

        {portals && <div className="result-box"><h3>Best Platforms</h3>{renderText(portals)}</div>}
      </div>

      <footer className="footer">
        <p>Developed for INNOVATEX 2026 by Team <strong>CareerForge</strong></p>
      </footer>
    </div>
  );
}

export default App;