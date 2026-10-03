import { useEffect, useState } from "react";
import {
  Brain,
  Target,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Lightbulb,
  RefreshCw,
} from "lucide-react";

import api from "../services/api";

export default function AIFeedback() {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/ai-feedback");

      if (response.data?.success) {
        setFeedback(response.data.feedback);
      } else {
        setError("Unable to generate AI feedback.");
      }
    } catch (err) {
      console.error("AI Feedback Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load AI feedback."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500">
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl px-8 py-6 text-white text-lg font-semibold flex items-center gap-3">
          <RefreshCw className="animate-spin" size={22} />
          Generating AI Feedback...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <AlertTriangle
            className="mx-auto text-red-500 mb-4"
            size={45}
          />

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Unable to Load AI Feedback
          </h2>

          <p className="text-gray-500 mb-5">
            {error}
          </p>

          <button
            onClick={fetchFeedback}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const summary = feedback?.summary || {};

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4">

          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-indigo-600 text-white">
                <Brain size={28} />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                AI Performance Feedback
              </h1>
            </div>

            <p className="text-gray-600 dark:text-gray-400">
              Personalized insights based on your test performance.
            </p>
          </div>

          <button
            onClick={fetchFeedback}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
          >
            <RefreshCw size={18} />
            Refresh
          </button>

        </div>
      </div>

      {/* Overall Message */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-2xl p-6 text-white shadow-lg mb-8">

        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Brain size={28} />
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">
              AI Insight
            </h2>

            <p className="text-white/90 leading-relaxed">
              {feedback?.overallMessage ||
                "Keep practicing and complete more tests to receive personalized feedback."}
            </p>
          </div>
        </div>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <SummaryCard
          icon={<Target size={22} />}
          title="Topics Analyzed"
          value={summary.totalTopicsAnalyzed || 0}
        />

        <SummaryCard
          icon={<AlertTriangle size={22} />}
          title="Weak Topics"
          value={summary.weakTopics || 0}
        />

        <SummaryCard
          icon={<TrendingUp size={22} />}
          title="Needs Improvement"
          value={summary.needsImprovement || 0}
        />

        <SummaryCard
          icon={<CheckCircle size={22} />}
          title="Good Topics"
          value={summary.goodTopics || 0}
        />

      </div>

      {/* Recommendations */}
      <Section
        title="AI Recommendations"
        icon={<Lightbulb size={22} />}
      >
        {feedback?.recommendations?.length > 0 ? (
          <div className="space-y-4">
            {feedback.recommendations.map(
              (recommendation, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {typeof recommendation === "string"
                      ? recommendation
                      : recommendation.message ||
                        recommendation.text ||
                        JSON.stringify(recommendation)}
                  </p>
                </div>
              )
            )}
          </div>
        ) : (
          <EmptyState message="Complete more tests to receive AI recommendations." />
        )}
      </Section>

      {/* Weak Topics */}
      <Section
        title="Topics You Need to Improve"
        icon={<AlertTriangle size={22} />}
      >
        <TopicList
          topics={feedback?.weakTopics}
          emptyMessage="No weak topics identified yet."
        />
      </Section>

      {/* Improvement Topics */}
      <Section
        title="Topics Showing Improvement"
        icon={<TrendingUp size={22} />}
      >
        <TopicList
          topics={feedback?.improvementTopics}
          emptyMessage="No improvement topics identified yet."
        />
      </Section>

      {/* Good Topics */}
      <Section
        title="Strong Topics"
        icon={<CheckCircle size={22} />}
      >
        <TopicList
          topics={feedback?.goodTopics}
          emptyMessage="No strong topics identified yet."
        />
      </Section>

    </div>
  );
}

function SummaryCard({ icon, title, value }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>

        <span className="text-sm text-gray-500 dark:text-gray-400">
          {title}
        </span>
      </div>

      <div className="text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>

    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-6">

      <div className="flex items-center gap-3 mb-5">

        <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>

      </div>

      {children}

    </section>
  );
}

function TopicList({ topics, emptyMessage }) {
  if (!topics || topics.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {topics.map((topic, index) => {

        const name =
          topic.topic ||
          topic.name ||
          topic.title ||
          `Topic ${index + 1}`;

        const accuracy =
          topic.accuracy ??
          topic.percentage ??
          topic.score;

        return (
          <div
            key={index}
            className="p-5 rounded-xl border border-gray-200 dark:border-gray-700"
          >

            <div className="flex items-center justify-between mb-3">

              <h3 className="font-semibold text-gray-800 dark:text-white">
                {name}
              </h3>

              {accuracy !== undefined && (
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {Number(accuracy).toFixed(1)}%
                </span>
              )}

            </div>

            {accuracy !== undefined && (
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{
                    width: `${Math.min(
                      Math.max(Number(accuracy), 0),
                      100
                    )}%`,
                  }}
                />
              </div>
            )}

            {topic.feedback && (
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                {topic.feedback}
              </p>
            )}

          </div>
        );
      })}

    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
      {message}
    </div>
  );
}