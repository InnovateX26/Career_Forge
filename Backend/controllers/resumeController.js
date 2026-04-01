const { GoogleGenAI } = require("@google/genai");
const pdfParse = require("pdf-parse");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

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