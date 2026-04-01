const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const { generateResumeAndRoadmap, analyzeResumeMatch } = require('../controllers/resumeController');