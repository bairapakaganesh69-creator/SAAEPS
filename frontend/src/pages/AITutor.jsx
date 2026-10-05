import { useState } from "react";
import {
  Bot,
  Send,
  User,
  BookOpen,
  RefreshCw,
} from "lucide-react";

import api from "../services/api";

export default function AITutor() {
  const [subject, setSubject] = useState("Mathematics");
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I'm your SAAEPS Chatbot. Ask me any question about your exam subjects and I'll help you understand it.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      return;
    }

    const currentQuestion = question.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: currentQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await api.post("/ai/tutor", {
        subject,
        topic,
        question: currentQuestion,
      });

      console.log("AI Tutor Response:", response.data);

      const aiResponse =
        response.data?.data?.response ||
        response.data?.response ||
        response.data?.message ||
        "I couldn't generate a response right now.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: aiResponse,
        },
      ]);
    } catch (error) {
      console.error("AI Tutor Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            error.response?.data?.message ||
            "Sorry, I couldn't connect to the AI Tutor. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        text: "Hello! I'm your SAAEPS Chatbot. Ask me any question about your exam subjects and I'll help you understand it.",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-4 md:p-6">

      {/* Header */}
      <div className="max-w-5xl mx-auto mb-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <div className="flex items-center gap-3">

              <div className="p-3 rounded-xl bg-indigo-600 text-white shadow-lg">
                <Bot size={28} />
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  AI Tutor
                </h1>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your personal exam preparation chatbot
                </p>
              </div>

            </div>
          </div>

          <button
            onClick={clearChat}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <RefreshCw size={17} />
            Clear Chat
          </button>

        </div>

      </div>

      {/* Main Tutor Card */}
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">

        {/* Settings */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>

              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Computer Science</option>
                <option>General</option>
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Topic
              </label>

              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Trigonometry"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

          </div>

        </div>

        {/* Chat Area */}
        <div className="h-[500px] overflow-y-auto p-5 space-y-5 bg-gray-50 dark:bg-gray-950">

          {messages.map((message, index) => (

            <div
              key={index}
              className={`flex gap-3 ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              {/* AI Avatar */}
              {message.role === "assistant" && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Bot size={20} />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-md"
                    : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-800 rounded-bl-md shadow-sm"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">
                  {message.text}
                </p>
              </div>

              {/* User Avatar */}
              {message.role === "user" && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 text-white flex items-center justify-center">
                  <User size={20} />
                </div>
              )}

            </div>

          ))}

          {/* Loading */}
          {loading && (
            <div className="flex gap-3">

              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                <Bot size={20} />
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl rounded-bl-md px-5 py-3 shadow-sm">

                <div className="flex items-center gap-2 text-gray-500">
                  <RefreshCw
                    size={17}
                    className="animate-spin"
                  />

                  <span>
                    Chatbot is thinking...
                  </span>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
        >

          <div className="flex items-center gap-3">

            <div className="flex-1 relative">

              <BookOpen
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={question}
                onChange={(e) =>
                  setQuestion(e.target.value)
                }
                placeholder="Ask your question..."
                disabled={loading}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
              />

            </div>

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="flex items-center justify-center gap-2 px-5 py-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={19} />
              <span className="hidden sm:inline">
                Ask
              </span>
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}