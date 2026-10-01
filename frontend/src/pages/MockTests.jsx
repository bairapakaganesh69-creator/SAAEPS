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

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Mock Tests
        </h1>

        <p className="mt-4 text-gray-500">
          Loading available tests...
        </p>
      </div>
    );
  }

  // Test screen
  if (selectedTest && attempt) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">

        <div className="mx-auto max-w-4xl">

          <button
            onClick={handleBack}
            className="mb-5 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            ← Back to Tests
          </button>

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="flex flex-col justify-between gap-3 border-b pb-5 md:flex-row">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {selectedTest.title}
                </h1>

                <p className="mt-1 text-gray-500">
                  {selectedTest.examType || "Mock Test"}
                </p>
              </div>

              <div className="text-left md:text-right">
                <p className="font-semibold text-blue-600">
                  {selectedTest.duration} minutes
                </p>

                <p className="text-sm text-gray-500">
                  {questions.length} Questions
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-lg bg-red-100 p-3 text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6 space-y-6">

              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="rounded-xl border border-gray-200 p-5"
                >

                  <p className="font-semibold text-gray-800">
                    {index + 1}. {question.question}
                  </p>

                  <div className="mt-4 space-y-3">

                    {[
                      ["A", question.optionA],
                      ["B", question.optionB],
                      ["C", question.optionC],
                      ["D", question.optionD],
                    ].map(([letter, option]) => (
                      <label
                        key={letter}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                          answers[question.id] === letter
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >

                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={letter}
                          checked={
                            answers[question.id] === letter
                          }
                          onChange={() =>
                            handleAnswerChange(
                              question.id,
                              letter
                            )
                          }
                        />

                        <span>
                          <strong>{letter}.</strong>{" "}
                          {option}
                        </span>

                      </label>
                    ))}

                  </div>

                </div>
              ))}

            </div>

            {questions.length === 0 && (
              <p className="mt-6 text-gray-500">
                No questions are available for this test.
              </p>
            )}

            {questions.length > 0 && (
              <button
                onClick={handleSubmitTest}
                disabled={submitting}
                className="mt-8 w-full rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Test"}
              </button>
            )}

          </div>

        </div>
      </div>
    );
  }

  // Result screen
  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">

        <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 text-center shadow-sm">

          <div className="text-5xl">🎉</div>

          <h1 className="mt-4 text-3xl font-bold text-gray-800">
            Test Completed!
          </h1>

          <p className="mt-2 text-gray-500">
            Your test has been evaluated successfully.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="rounded-lg bg-blue-50 p-5">
              <p className="text-sm text-gray-500">
                Score
              </p>

              <p className="mt-2 text-2xl font-bold text-blue-600">
                {result.score ?? 0}
              </p>
            </div>

            <div className="rounded-lg bg-green-50 p-5">
              <p className="text-sm text-gray-500">
                Percentage
              </p>

              <p className="mt-2 text-2xl font-bold text-green-600">
                {result.percentage ?? 0}%
              </p>
            </div>

            <div className="rounded-lg bg-purple-50 p-5">
              <p className="text-sm text-gray-500">
                Total Marks
              </p>

              <p className="mt-2 text-2xl font-bold text-purple-600">
                {result.totalMarks ?? 0}
              </p>
            </div>

          </div>

          <button
            onClick={handleBack}
            className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Mock Tests
          </button>

        </div>

      </div>
    );
  }

  // Test list
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">

      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            📝 Mock Tests
          </h1>

          <p className="mt-2 text-gray-500">
            Attempt mock tests and evaluate your preparation.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {tests.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">
              No mock tests are currently available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {tests.map((test) => (
              <div
                key={test.id}
                className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
              >

                <h2 className="text-xl font-bold text-gray-800">
                  {test.title}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {test.examType || "Mock Test"}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">

                  <div className="rounded-lg bg-blue-50 p-3">
                    <p className="text-xs text-gray-500">
                      Duration
                    </p>

                    <p className="font-semibold text-blue-700">
                      {test.duration} min
                    </p>
                  </div>

                  <div className="rounded-lg bg-green-50 p-3">
                    <p className="text-xs text-gray-500">
                      Total Marks
                    </p>

                    <p className="font-semibold text-green-700">
                      {test.totalMarks}
                    </p>
                  </div>

                </div>

                <button
                  onClick={() => handleStartTest(test)}
                  disabled={starting}
                  className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {starting
                    ? "Starting..."
                    : "Start Test"}
                </button>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default MockTests;