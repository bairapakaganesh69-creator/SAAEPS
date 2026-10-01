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
        <h1 className="text-3xl font-bold text-gray-800">
          Performance
        </h1>

        <p className="mt-4 text-gray-500">
          Loading your performance...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Performance
        </h1>

        <div className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  const overview = data?.overview || {};
  const subjects = data?.subjectPerformance || [];
  const weakTopics = data?.weakTopics || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Performance
        </h1>

        <p className="mt-2 text-gray-500">
          Track your academic performance and identify areas
          that need improvement.
        </p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Tests Attempted
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {overview.testsAttempted || 0}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Average Score
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {Math.round(overview.averagePercentage || 0)}%
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Strongest Topic
          </p>

          <h2 className="mt-2 text-xl font-bold text-gray-800">
            {data?.strongestTopic?.topic || "Not available"}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Weakest Topic
          </p>

          <h2 className="mt-2 text-xl font-bold text-red-600">
            {data?.weakestTopic?.topic || "Not available"}
          </h2>
        </div>

      </div>

      {/* Subject Performance */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

        <h2 className="text-xl font-bold text-gray-800">
          Subject Performance
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Your accuracy in each subject.
        </p>

        {subjects.length === 0 ? (
          <p className="mt-6 text-gray-500">
            No subject performance data available yet.
            Attempt a test to see your performance.
          </p>
        ) : (
          <div className="mt-6 space-y-5">

            {subjects.map((subject) => (
              <div key={subject.subjectId}>

                <div className="mb-2 flex justify-between">
                  <span className="font-medium text-gray-700">
                    {subject.subject}
                  </span>

                  <span className="font-semibold text-gray-800">
                    {Math.round(subject.accuracy || 0)}%
                  </span>
                </div>

                <div className="h-3 w-full rounded-full bg-gray-200">
                  <div
                    className="h-3 rounded-full bg-blue-600"
                    style={{
                      width: `${Math.min(
                        Math.max(subject.accuracy || 0, 0),
                        100
                      )}%`,
                    }}
                  />
                </div>

              </div>
            ))}

          </div>
        )}
      </div>

      {/* Weak Topics */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

        <h2 className="text-xl font-bold text-gray-800">
          Weak Topics
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Topics where you may need additional practice.
        </p>

        {weakTopics.length === 0 ? (
          <div className="mt-6 rounded-lg bg-green-50 p-4 text-green-700">
            No weak topics identified yet.
          </div>
        ) : (
          <div className="mt-5 space-y-3">

            {weakTopics.map((topic, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-red-50 p-4"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {topic.topic}
                  </p>

                  <p className="text-sm text-gray-500">
                    Accuracy: {Math.round(topic.accuracy || 0)}%
                  </p>
                </div>

                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                  Needs Practice
                </span>
              </div>
            ))}

          </div>
        )}
      </div>

      {/* Recent Tests */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

        <h2 className="text-xl font-bold text-gray-800">
          Recent Tests
        </h2>

        {!data?.recentTests?.length ? (
          <p className="mt-5 text-gray-500">
            No completed tests yet.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b text-sm text-gray-500">
                  <th className="px-3 py-3">Test</th>
                  <th className="px-3 py-3">Score</th>
                  <th className="px-3 py-3">Percentage</th>
                </tr>
              </thead>

              <tbody>
                {data.recentTests.map((test) => (
                  <tr
                    key={test.attemptId}
                    className="border-b last:border-0"
                  >
                    <td className="px-3 py-4 font-medium">
                      {test.testTitle}
                    </td>

                    <td className="px-3 py-4">
                      {test.score}/{test.totalMarks}
                    </td>

                    <td className="px-3 py-4 font-semibold text-blue-600">
                      {Math.round(test.percentage || 0)}%
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};

export default Performance;
