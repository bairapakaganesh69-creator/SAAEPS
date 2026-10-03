import React, { useEffect, useState } from "react";
import api from "../services/api";

const MockTests = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load available tests
  useEffect(() => {
    const loadTests = async () => {
      try {
        const response = await api.get("/tests");

        setTests(response.data?.tests || []);
      } catch (err) {
        console.error("Load Tests Error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load mock tests."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTests();
  }, []);

  // Start selected test
  const handleStartTest = async (test) => {
    setStarting(true);
    setError("");
    setResult(null);

    try {
      const response = await api.post(
        `/tests/${test.id}/attempt`
      );

      const newAttempt = response.data?.attempt;

      if (!newAttempt) {
        throw new Error("Failed to create test attempt.");
      }

      const questionResponse = await api.get(
        `/tests/${test.id}/questions`
      );

      setSelectedTest(test);
      setQuestions(
        questionResponse.data?.questions || []
      );
      setAttempt(newAttempt);
      setAnswers({});
    } catch (err) {
      console.error("Start Test Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to start the test."
      );
    } finally {
      setStarting(false);
    }
  };

  // Select answer
  const handleAnswerChange = async (
    questionId,
    selectedAnswer
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedAnswer,
    }));

    if (!attempt || !selectedTest) return;

    try {
      await api.post(
        `/tests/${selectedTest.id}/attempt/${attempt.id}/answers`,
        {
          questionId,
          selectedAnswer,
        }
      );
    } catch (err) {
      console.error("Save Answer Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save answer."
      );
    }
  };

  // Submit test
  const handleSubmitTest = async () => {
    if (!selectedTest || !attempt) return;

    const confirmed = window.confirm(
      "Are you sure you want to submit this test?"
    );

    if (!confirmed) return;

    setSubmitting(true);
    setError("");

    try {
      const response = await api.post(
        `/test-attempts/${selectedTest.id}/${attempt.id}/submit`
      );

      setResult(response.data?.result || null);

      setSelectedTest(null);
      setQuestions([]);
      setAttempt(null);
      setAnswers({});
    } catch (err) {
      console.error("Submit Test Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to submit the test."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Back to test list
  const handleBack = () => {
    setSelectedTest(null);
    setQuestions([]);
    setAttempt(null);
    setAnswers({});
    setResult(null);
    setError("");
  };

  const answeredCount = Object.keys(answers).length;

  const progress =
    questions.length > 0
      ? Math.round(
          (answeredCount / questions.length) * 100
        )
      : 0;

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"></div>

            <h2 className="text-xl font-semibold text-gray-800">
              Loading Mock Tests
            </h2>

            <p className="mt-2 text-gray-500">
              Please wait while we load available tests.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Test screen
  if (selectedTest && attempt) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-5xl">

          {/* Back button */}
          <button
            onClick={handleBack}
            className="mb-5 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100"
          >
            ← Back to Tests
          </button>

          {/* Test Header */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

            <div className="border-b border-gray-200 p-6 md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <div>
                  <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                    {selectedTest.examType || "MOCK TEST"}
                  </div>

                  <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                    {selectedTest.title}
                  </h1>

                  <p className="mt-2 text-gray-500">
                    Answer the following questions carefully and submit when you are ready.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 md:min-w-[250px]">
                  <div className="rounded-xl bg-blue-50 p-4 text-center">
                    <p className="text-xs font-medium text-gray-500">
                      Duration
                    </p>

                    <p className="mt-1 text-lg font-bold text-blue-600">
                      {selectedTest.duration} min
                    </p>
                  </div>

                  <div className="rounded-xl bg-green-50 p-4 text-center">
                    <p className="text-xs font-medium text-gray-500">
                      Questions
                    </p>

                    <p className="mt-1 text-lg font-bold text-green-600">
                      {questions.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-7">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    Test Progress
                  </span>

                  <span className="font-semibold text-blue-600">
                    {answeredCount}/{questions.length} answered
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mx-6 mt-5 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 md:mx-8">
                {error}
              </div>
            )}

            {/* Questions */}
            <div className="space-y-6 p-6 md:p-8">

              {questions.map((question, index) => {
                const selectedAnswer =
                  answers[question.id];

                return (
                  <div
                    key={question.id}
                    className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm md:p-6"
                  >
                    {/* Question number */}
                    <div className="mb-4 flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                        {index + 1}
                      </div>

                      <div>
                        <p className="font-semibold leading-6 text-gray-900">
                          {question.question}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Question {index + 1} of {questions.length}
                        </p>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">

                      {[
                        ["A", question.optionA],
                        ["B", question.optionB],
                        ["C", question.optionC],
                        ["D", question.optionD],
                      ].map(([letter, option]) => (
                        <label
                          key={letter}
                          className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                            selectedAnswer === letter
                              ? "border-blue-500 bg-blue-50 shadow-sm"
                              : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={letter}
                            checked={
                              selectedAnswer === letter
                            }
                            onChange={() =>
                              handleAnswerChange(
                                question.id,
                                letter
                              )
                            }
                            className="h-4 w-4 accent-blue-600"
                          />

                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                              selectedAnswer === letter
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {letter}
                          </span>

                          <span className="text-sm text-gray-800 md:text-base">
                            {option}
                          </span>
                        </label>
                      ))}

                    </div>
                  </div>
                );
              })}

              {questions.length === 0 && (
                <div className="rounded-xl bg-gray-50 p-8 text-center">
                  <p className="text-gray-500">
                    No questions are available for this test.
                  </p>
                </div>
              )}

              {/* Submit area */}
              {questions.length > 0 && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 md:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>
                      <p className="font-semibold text-gray-900">
                        Ready to submit?
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        You have answered {answeredCount} out of{" "}
                        {questions.length} questions.
                      </p>
                    </div>

                    <button
                      onClick={handleSubmitTest}
                      disabled={submitting}
                      className="rounded-xl bg-green-600 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting
                        ? "Submitting..."
                        : "Submit Test"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Result screen
  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="mx-auto max-w-3xl">

          <div className="rounded-2xl bg-white p-8 text-center shadow-sm md:p-10">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
              ✓
            </div>

            <h1 className="mt-5 text-3xl font-bold text-gray-900">
              Test Completed!
            </h1>

            <p className="mt-2 text-gray-500">
              Your test has been evaluated successfully.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

              <div className="rounded-2xl bg-blue-50 p-6">
                <p className="text-sm font-medium text-gray-500">
                  Score
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {result.score ?? 0}
                </p>
              </div>

              <div className="rounded-2xl bg-green-50 p-6">
                <p className="text-sm font-medium text-gray-500">
                  Percentage
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {result.percentage ?? 0}%
                </p>
              </div>

              <div className="rounded-2xl bg-purple-50 p-6">
                <p className="text-sm font-medium text-gray-500">
                  Total Marks
                </p>

                <p className="mt-2 text-3xl font-bold text-purple-600">
                  {result.totalMarks ?? 0}
                </p>
              </div>

            </div>

            <div className="mt-8 rounded-xl bg-gray-50 p-5 text-left">
              <p className="font-semibold text-gray-800">
                Performance Summary
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Your result has been recorded and will be reflected in your performance analysis and weak-topic analysis.
              </p>
            </div>

            <button
              onClick={handleBack}
              className="mt-8 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Back to Mock Tests
            </button>

          </div>
        </div>
      </div>
    );
  }

  // Test list
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-6xl">

        {/* Page Header */}
        <div className="mb-8">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                <span>📝</span>
                Assessment Center
              </div>

              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Mock Tests
              </h1>

              <p className="mt-2 text-gray-500">
                Attempt mock tests and evaluate your preparation.
              </p>
            </div>

            <div className="rounded-xl bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-medium text-gray-500">
                Available Tests
              </p>

              <p className="mt-1 text-2xl font-bold text-blue-600">
                {tests.length}
              </p>
            </div>

          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* No Tests */}
        {tests.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
              📝
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              No Mock Tests Available
            </h2>

            <p className="mt-2 text-gray-500">
              No mock tests are currently available. Please check again later.
            </p>

          </div>
        ) : (

          /* Test Cards */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {tests.map((test) => (
              <div
                key={test.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >

                {/* Card top */}
                <div className="h-2 bg-blue-600"></div>

                <div className="p-6">

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                        {test.examType || "MOCK TEST"}
                      </span>

                      <h2 className="mt-4 text-xl font-bold text-gray-900">
                        {test.title}
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        Test your preparation and identify areas that need more practice.
                      </p>
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                      📝
                    </div>

                  </div>

                  {/* Information */}
                  <div className="mt-6 grid grid-cols-2 gap-3">

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-medium text-gray-500">
                        Duration
                      </p>

                      <p className="mt-1 text-lg font-bold text-gray-800">
                        {test.duration} min
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-medium text-gray-500">
                        Total Marks
                      </p>

                      <p className="mt-1 text-lg font-bold text-gray-800">
                        {test.totalMarks}
                      </p>
                    </div>

                  </div>

                  {/* Start button */}
                  <button
                    onClick={() => handleStartTest(test)}
                    disabled={starting}
                    className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {starting
                      ? "Starting Test..."
                      : "Start Test →"}
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default MockTests;