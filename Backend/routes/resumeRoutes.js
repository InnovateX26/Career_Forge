const express = require('express');
const router = express.Router();
const multer = require('multer');

// File ko memory mein save karne ke liye multer setup
const upload = multer({ storage: multer.memoryStorage() });

const { generateResumeAndRoadmap, analyzeResumeMatch } = require('../controllers/resumeController');

router.post('/generate', generateResumeAndRoadmap);

// ✅ Yahan 'upload.single' add kiya taaki file receive ho sake
router.post('/analyze', upload.single('resumeFile'), analyzeResumeMatch);

module.exports = router;