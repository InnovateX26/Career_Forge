import { useState } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
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
  const tempContainer = document.createElement('div');

    tempContainer.innerHTML = tailoredResume
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');

      // PDF specific styling

      tempContainer.style.padding = '30px';
      tempContainer.style.color = '#000000';
      tempContainer.style.background = '#ffffff';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.fontSize = '14px';
      tempContainer.style.lineHeight = '1.6';

      const opt = {
        margin:       15,
      filename:     'CareerCraft_Tailored_Resume.pdf',
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 3 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(tempContainer).save();
  };

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

// ✅ Text to Speech (AI HR)

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