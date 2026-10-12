import React, { useEffect, useState } from "react";
import api from "../services/api";

const Performance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPerformance = async () => {
      try {
        const response = await api.get("/dashboard");
        setData(response.data?.dashboard || null);
      } catch (err) {
        console.error("Performance Error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load performance data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPerformance();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-800">
            Performance
          </h1>

          <p className="mt-4 text-gray-500">
            Loading your performance...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-800">
            Performance
          </h1>

          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  const overview = data?.overview || {};
  const subjects = data?.subjectPerformance || [];
  const weakTopics = data?.weakTopics || [];
  const recentTests = data?.recentTests || [];

  const overallPercentage = Math.round(
    overview.averagePercentage || 0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">

      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Performance
          </h1>

          <p className="mt-2 text-gray-500">
            Track your academic progress and identify areas
            that need improvement.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Tests Attempted */}
          <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Tests Attempted
                </p>

                <h2 className="mt-2 text-3xl font-bold text-blue-600">
                  {overview.testsAttempted || 0}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                📝
              </div>

            </div>

            <p className="mt-4 text-xs text-gray-500">
              Completed mock tests
            </p>
          </div>

          {/* Overall Score */}
          <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Overall Score
                </p>

                <h2 className="mt-2 text-3xl font-bold text-green-600">
                  {overallPercentage}%
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl">
                📊
              </div>

            </div>

            <p className="mt-4 text-xs text-gray-500">
              {overview.totalScore || 0} / {overview.totalMarks || 0} marks
            </p>
          </div>

          {/* Strongest Topic */}
          <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">

              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">
                  Strongest Topic
                </p>

                <h2 className="mt-2 truncate text-xl font-bold text-gray-800">
                  {data?.strongestTopic?.topic || "Not available"}
                </h2>
              </div>

              <div className="ml-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-2xl">
                💪
              </div>

            </div>

            <p className="mt-4 text-xs text-gray-500">
              Accuracy:{" "}
              {Math.round(
                data?.strongestTopic?.accuracy || 0
              )}
              %
            </p>
          </div>

          {/* Weakest Topic */}
          <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">

              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">
                  Weakest Topic
                </p>

                <h2 className="mt-2 truncate text-xl font-bold text-red-600">
                  {data?.weakestTopic?.topic || "Not available"}
                </h2>
              </div>

              <div className="ml-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-2xl">
                ⚠️
              </div>

            </div>

            <p className="mt-4 text-xs text-gray-500">
              Needs additional practice
            </p>
          </div>

        </div>

        {/* Subject Performance */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Subject Performance
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your accuracy in each subject.
              </p>
            </div>
          </div>

          {subjects.length === 0 ? (
            <div className="mt-6 rounded-xl bg-gray-50 p-5 text-gray-500">
              No subject performance data available yet.
              Attempt a test to see your performance.
            </div>
          ) : (
            <div className="mt-7 space-y-7">

              {subjects.map((subject) => {
                const accuracy = Math.min(
                  Math.max(subject.accuracy || 0, 0),
                  100
                );

                return (
                  <div key={subject.subjectId}>

                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {subject.subject}
                        </p>

                        <p className="text-xs text-gray-500">
                          {subject.correct || 0} correct ·{" "}
                          {subject.wrong || 0} wrong ·{" "}
                          {subject.attempted || 0} attempted
                        </p>
                      </div>

                      <span className="text-lg font-bold text-blue-600">
                        {Math.round(accuracy)}%
                      </span>
                    </div>

                    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-700"
                        style={{
                          width: `${accuracy}%`,
                        }}
                      />
                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* Weak Topics + Recent Tests */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">

          {/* Weak Topics */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Weak Topics
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Topics where you may need additional practice.
              </p>
            </div>

            {weakTopics.length === 0 ? (
              <div className="mt-6 rounded-xl bg-green-50 p-5 text-green-700">
                No weak topics identified yet.
              </div>
            ) : (
              <div className="mt-5 space-y-3">

                {weakTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50 p-4"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                        ⚠️
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800">
                          {topic.topic}
                        </p>

                        <p className="text-sm text-gray-500">
                          Accuracy:{" "}
                          {Math.round(topic.accuracy || 0)}%
                        </p>
                      </div>

                    </div>

                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                      Needs Practice
                    </span>

                  </div>
                ))}

              </div>
            )}

          </div>

          {/* Recent Tests */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Recent Tests
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest completed mock tests.
              </p>
            </div>

            {recentTests.length === 0 ? (
              <p className="mt-6 text-gray-500">
                No completed tests yet.
              </p>
            ) : (
              <div className="mt-5 space-y-3">

                {recentTests.map((test) => (
                  <div
                    key={test.attemptId}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:bg-blue-50"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">

                        <p className="truncate font-semibold text-gray-800">
                          {test.testTitle}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {test.examType || "Mock Test"}
                        </p>

                      </div>

                      <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                        {Math.round(test.percentage || 0)}%
                      </span>

                    </div>

                    <div className="mt-3 flex items-center justify-between text-sm">

                      <span className="text-gray-500">
                        Score
                      </span>

                      <span className="font-semibold text-gray-800">
                        {test.score}/{test.totalMarks}
                      </span>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default Performance;