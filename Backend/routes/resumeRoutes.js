const express = require('express');
const router = express.Router();
const multer = require('multer');

// Setup multer for file upload
const upload = multer({ storage: multer.memoryStorage() });

// ✅ SAATHE 5 FUNCTIONS KO SAHI SE IMPORT KIYA HAI
const { 
    generateResumeAndRoadmap, 
    analyzeResumeMatch, 
    generateInterviewQuestions,
    buildTailoredResume,
    findJobPortals 
} = require('../controllers/resumeController');

// ✅ PAACHO (5) RAASTE (ROUTES) EK SATH DEFINE KIYE HAIN
router.post('/generate', generateResumeAndRoadmap);
router.post('/analyze', upload.single('resumeFile'), analyzeResumeMatch);
router.post('/questions', generateInterviewQuestions);
router.post('/build', buildTailoredResume);
router.post('/portals', findJobPortals);

module.exports = router;