const performanceFeedbackPrompt = (quizData) => `
You are an AI academic mentor.

Analyze the student's quiz performance and generate constructive feedback.

Student Data:

${quizData}

Return ONLY valid JSON.

{
  "overall_performance":"",
  "strengths":[],
  "weaknesses":[],
  "recommendations":[],
  "motivation":""
}
`;

module.exports = performanceFeedbackPrompt;