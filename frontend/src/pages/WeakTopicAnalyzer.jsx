import React, { useEffect, useState } from "react";
import api from "../services/api";

const WeakTopicAnalyzer = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWeakTopics = async () => {
      try {
        const response = await api.get("/weak-topics");
        setData(response.data || null);
      } catch (err) {
        console.error("Weak Topic Analyzer Error:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load weak topic analysis."
        );
      } finally {
        setLoading(false);
      }
    };

    loadWeakTopics();
  }, []);

  const summary = data?.summary || {};
  const weakTopics = data?.weakTopics || [];
  const improvementTopics = data?.improvementTopics || [];
  const goodTopics = data?.goodTopics || [];
  const allTopics = data?.allTopics || [];

  const getStatusStyle = (status) => {
    if (status === "Weak") {
      return "bg-red-100 text-red-700";
    }
    if (status === "Needs Improvement") {
      return "bg-amber-100 text-amber-700";
    }
    return "bg-green-100 text-green-700";
  };

  const TopicCard = ({ topic }) => {
    const accuracy = Number(topic.accuracy) || 0;

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-800">
              {topic.topic || "Untitled topic"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {topic.subject || "Subject not specified"}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
              topic.status
            )}`}
          >
            {topic.status || "Not classified"}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="text-gray-500">Accuracy</span>
          <span className="font-bold text-gray-800">
            {accuracy.toFixed(1)}%
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full ${
              topic.status === "Weak"
                ? "bg-red-500"
                : topic.status === "Needs Improvement"
                  ? "bg-amber-500"
                  : "bg-green-500"
            }`}
            style={{
              width: `${Math.min(100, Math.max(0, accuracy))}%`,
            }}
          />
        </div><p className="mt-3 text-xs text-gray-500">
  {Number(topic.correct) || 0} correct out of{" "}
  {Number(topic.attempted) || 0} attempted questions
</p>

      </div>
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-800">
            Weak Topic Analyzer
          </h1>
          <p className="mt-4 text-gray-500">
            Analyzing your submitted tests...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-800">
            Weak Topic Analyzer
          </h1>
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Weak Topic Analyzer
          </h1>
          <p className="mt-2 text-gray-500">
            Identify topics that need more practice using your submitted test results.
          </p>
        </header>

        <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Topics Analyzed",
              value: summary.totalTopicsAnalyzed || 0,
              color: "text-blue-600",
            },
            {
              label: "Weak Topics",
              value: summary.weakTopics || 0,
              color: "text-red-600",
            },
            {
              label: "Needs Improvement",
              value: summary.needsImprovement || 0,
              color: "text-amber-600",
            },
            {
              label: "Good Topics",
              value: summary.goodTopics || 0,
              color: "text-green-600",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className={`mt-2 text-3xl font-bold ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </section>

        {allTopics.length === 0 ? (
          <div className="rounded-2xl border border-blue-100 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              No analysis data yet
            </h2>
            <p className="mt-2 text-gray-500">
              Complete and submit a mock test to see your topic-wise performance here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {[
              {
                title: "Weak Topics",
                description: "Prioritize these topics for additional practice.",
                topics: weakTopics,
              },
              {
                title: "Needs Improvement",
                description: "Review these topics and practice more questions.",
                topics: improvementTopics,
              },
              {
                title: "Good Performance",
                description: "Keep revising these topics to maintain your progress.",
                topics: goodTopics,
              },
            ].map((group) => (
              <section key={group.title}>
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {group.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {group.description}
                  </p>
                </div>

                {group.topics.length === 0 ? (
                  <p className="rounded-xl bg-white p-5 text-sm text-gray-500 shadow-sm">
                    No topics in this category.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {group.topics.map((topic, index) => (
                      <TopicCard
                        key={`${topic.subject || "subject"}-${topic.topic || index}`}
                        topic={topic}
                      />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default WeakTopicAnalyzer;
