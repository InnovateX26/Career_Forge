const { GoogleGenAI } = require("@google/genai");
const pdfParse = require("pdf-parse");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Roadmap Generation based on job description

const generateResumeAndRoadmap = async (req, res) => {
    try {
        const { jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({
                error: "Job Description is required"
            });
        }
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Act as an expert Career Coach.
            Create a roadmap with:
1. Skills
2. Weekly plan
3. Projects

Job Description:
${jobDescription}`
        });

        const text = response.text;

        res.status(200).json({
            success: true,
            data: text
        });

    } catch (error) {
        console.error("AI ERROR:", error);

        res.status(500).json({
            error: error.message || "Something went wrong"
        });
    }
};

// Analyze Resume Match with job description

const analyzeResumeMatch = async (req, res) => {
    try {
        // Frontend se JD aur User ka Resume (file ya text) aayega
        const { jobDescription, resumeText } = req.body;
        let finalResumeText = resumeText; 

       
        if (req.file) {
            try {
               
                const pdfData = await pdfParse(req.file.buffer);
                finalResumeText = pdfData.text; 
            } catch (pdfError) {
                console.error("PDF Parsing Error:", pdfError);
                return res.status(400).json({ error: "Upload a valid PDF File." });
            }
        }
        
        if (!jobDescription || !finalResumeText) {
            return res.status(400).json({
                error: "Job Description aur Resume (File ya Text) dono zaroori hain"
            });
        }

        //  Gemini 3 Flash (latest)
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Act as an expert ATS (Applicant Tracking System) and Career Coach.
Evaluate the following Resume against the Job Description.

Provide the analysis strictly in this format:

**1. Match Percentage:** [Insert % here]

**2. Key Strengths:**
- [Point 1]
- [Point 2]

**3. Missing Skills / Weaknesses:**
- [Point 1]
- [Point 2]

**4. Skill Roadmap (To get this job):**
- **Week 1-2:** [What to learn based on missing skills]
- **Week 3-4:** [Advanced skills or practice]
- **Projects to Build:** [Suggest 1-2 projects to cover weaknesses]
**5. Custom Cover Letter ✉️:**
[Write a professional, highly engaging 3-paragraph Cover Letter for the user to apply for this exact job. Highlight their strengths from the resume that match the job description.]

---
Job Description:
${jobDescription}

---
Resume:
${finalResumeText}` 

        });

        const text = response.text;

        res.status(200).json({
            success: true,
            data: text
        });

    } catch (error) {
        console.error("ATS MATCH ERROR:", error);

        res.status(500).json({
            error: error.message || "Failed to analyze resume"
        });
    }
};

module.exports = { generateResumeAndRoadmap, analyzeResumeMatch };