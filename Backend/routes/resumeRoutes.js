const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

const { 
    generateResumeAndRoadmap, 
    analyzeResumeMatch, 
    generateInterviewQuestions,
    buildTailoredResume 
} = require('../controllers/resumeController');

router.post('/generate', generateResumeAndRoadmap);
router.post('/analyze', upload.single('resumeFile'), analyzeResumeMatch);
router.post('/questions', generateInterviewQuestions);

router.post('/build', buildTailoredResume);

module.exports = router;