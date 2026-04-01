import { useState } from 'react';

import axios from 'axios';
import './App.css';

function App() {
 
  const [jd, setJd] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");