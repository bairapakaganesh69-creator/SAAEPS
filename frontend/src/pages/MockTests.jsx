
import React, { useEffect, useRef, useState } from "react";
import api from "../services/api";

const MockTests = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [previousAttempts, setPreviousAttempts] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [viewingPreviousResult, setViewingPreviousResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(null);

  const expiryHandled = useRef(false);
  const submittingRef = useRef(false);
  const pendingSavesRef = useRef(new Set());

  // Load tests and previous attempts
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

    const loadPreviousAttempts = async () => {
      try {
        const response = await api.get(
          "/test-attempts/my-attempts"
        );
        setPreviousAttempts(response.data?.attempts || []);
      } catch (err) {
        console.error("Load Previous Attempts Error:", err);
        setPreviousAttempts([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    loadTests();
    loadPreviousAttempts();
  }, []);

  // View a previously submitted result
  const handleViewResult = async (attemptId) => {
    setError("");

    try {
      const response = await api.get(`/results/${attemptId}`);
      const data = response.data;

      if (!data?.result) {
        throw new Error("Result details were not returned.");
      }

      setResult({
        ...data.result,
        answers: data.answers || [],
      });

      setViewingPreviousResult(true);
    } catch (err) {
      console.error("View Previous Result Error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load the previous result."
      );
    }
  };

  // Start a test and calculate its deadline from the server start time
  const handleStartTest = async (test) => {
    setStarting(true);
    setError("");
    setResult(null);
    setViewingPreviousResult(false);

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

      const startTime = new Date(
        newAttempt.startedAt
      ).getTime();
      const durationMs = Number(test.duration) * 60 * 1000;

      expiryHandled.current = false;
      submittingRef.current = false;

      setSelectedTest(test);
      setQuestions(questionResponse.data?.questions || []);
      setAttempt(newAttempt);
      setAnswers({});
      if (
  !Number.isFinite(startTime) ||
  !Number.isFinite(durationMs) ||
  durationMs <= 0
) {
  throw new Error(
    "Cannot start the test: invalid start time or duration."
  );
}

const secondsLeft = Math.ceil(
  (startTime + durationMs - Date.now()) / 1000
);

if (secondsLeft <= 0) {
  throw new Error(
    "This test attempt has expired. Return to the test list and try starting again."
  );
}

setRemainingSeconds(secondsLeft);
    } catch (err) {
      console.error("Start Test Error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to start the test."
      );
    } finally {
      setStarting(false);
    }
  };

  // Save a selected answer
  const handleAnswerChange = async (
    questionId,
    selectedAnswer
  ) => {
    if (
      !attempt ||
      !selectedTest ||
      submittingRef.current ||
      expiryHandled.current ||
      remainingSeconds === 0
    ) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedAnswer,
    }));

    const saveRequest = api.post(
      `/tests/${selectedTest.id}/attempt/${attempt.id}/answers`,
      {
        questionId,
        selectedAnswer,
      }
    );

    pendingSavesRef.current.add(saveRequest);

    try {
      await saveRequest;
    } catch (err) {
      console.error("Save Answer Error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to save answer. Please check your connection."
      );
    } finally {
      pendingSavesRef.current.delete(saveRequest);
    }
  };

  // Submit a test manually or automatically when time expires
  const handleSubmitTest = async (automatic = false) => {
    if (
      !selectedTest ||
      !attempt ||
      submittingRef.current
    ) {
      return;
    }

    if (expiryHandled.current && !automatic) {
      return;
    }

    if (!automatic) {
      const confirmed = window.confirm(
        "Are you sure you want to submit this test?"
      );

      if (!confirmed) {
        return;
      }
    }

    expiryHandled.current = true;
    submittingRef.current = true;
    setSubmitting(true);
    setError("");

    try {
      // Wait for answer requests already in progress before evaluation.
      await Promise.allSettled([
        ...pendingSavesRef.current,
      ]);

      const response = await api.post(
        `/test-attempts/${selectedTest.id}/${attempt.id}/submit`
      );

      let resultData = response.data?.result || {};
      let answerData = [];

      try {
        const resultResponse = await api.get(
          `/results/${attempt.id}`
        );

        resultData = {
          ...resultData,
          ...(resultResponse.data?.result || {}),
        };
        answerData = resultResponse.data?.answers || [];
      } catch (resultError) {
        console.error(
          "Could not load detailed answer review:",
          resultError
        );
      }

      setResult({
        ...resultData,
        answers: answerData,
      });

      setSelectedTest(null);
      setQuestions([]);
      setAttempt(null);
      setAnswers({});
      setRemainingSeconds(null);

      // Refresh previous attempts after submission
      try {
        const historyResponse = await api.get(
          "/test-attempts/my-attempts"
        );
        setPreviousAttempts(
          historyResponse.data?.attempts || []
        );
      } catch (historyError) {
        console.error("Refresh History Error:", historyError);
      }
    } catch (err) {
      console.error("Submit Test Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to submit the test. Please try again."
      );

      // Permit another submission attempt if the request failed
      expiryHandled.current = false;
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  // Countdown: update once per second and submit at zero
  useEffect(() => {
    if (
      !selectedTest ||
      !attempt ||
      remainingSeconds === null
    ) {
      return;
    }

    const startTime = new Date(
      attempt.startedAt
    ).getTime();
    const durationMs = Number(selectedTest.duration) * 60 * 1000;

    if (
      !Number.isFinite(startTime) ||
      !Number.isFinite(durationMs) ||
      durationMs <= 0
    ) {
      setError("This test has an invalid duration or start time.");
      return;
    }

    const updateCountdown = () => {
      const secondsLeft = Math.max(
  0,
  Math.ceil(
    (startTime + durationMs - Date.now()) / 1000
  )
);

      setRemainingSeconds(secondsLeft);

      if (
        secondsLeft === 0 &&
        !expiryHandled.current &&
        !submittingRef.current
      ) {
        handleSubmitTest(true);
      }
    };

    updateCountdown();

    const timerId = window.setInterval(
      updateCountdown,
      1000
    );

    return () => window.clearInterval(timerId);
  }, [selectedTest, attempt, remainingSeconds === null]);

  // Return to the test list
  const handleBack = () => {
    if (selectedTest && attempt && !expiryHandled.current) {
      const leave = window.confirm(
        "Leave this test? Your attempt may remain unfinished."
      );

      if (!leave) return;
    }

    setSelectedTest(null);
    setQuestions([]);
    setAttempt(null);
    setAnswers({});
    setResult(null);
    setRemainingSeconds(null);
    setError("");
    setViewingPreviousResult(false);
  };

  const answeredCount = Object.keys(answers).length;

  const progress =
    questions.length > 0
      ? Math.round(
          (answeredCount / questions.length) * 100
        )
      : 0;

  const formatTime = (seconds) => {
    const safeSeconds = Math.max(0, seconds || 0);
    const minutes = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
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

  // Active test screen
  if (selectedTest && attempt) {
    const timeIsLow =
      remainingSeconds !== null && remainingSeconds <= 60;

    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={handleBack}
            className="mb-5 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100"
          >
            ← Back to Tests
          </button>

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
                    Answer each question carefully. Your test
                    submits automatically when the timer reaches zero.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 md:min-w-[360px]">
                  <div className="rounded-xl bg-blue-50 p-3 text-center">
                    <p className="text-xs font-medium text-gray-500">
                      Duration
                    </p>
                    <p className="mt-1 text-lg font-bold text-blue-600">
                      {selectedTest.duration} min
                    </p>
                  </div>

                  <div
                    className={`rounded-xl p-3 text-center ${
                      timeIsLow
                        ? "bg-red-100"
                        : "bg-amber-50"
                    }`}
                  >
                    <p className="text-xs font-medium text-gray-600">
                      Time Left
                    </p>
                    <p
                      className={`mt-1 text-lg font-bold ${
                        timeIsLow
                          ? "text-red-700"
                          : "text-amber-700"
                      }`}
                    >
                      {formatTime(remainingSeconds)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-green-50 p-3 text-center">
                    <p className="text-xs font-medium text-gray-500">
                      Questions
                    </p>
                    <p className="mt-1 text-lg font-bold text-green-600">
                      {questions.length}
                    </p>
                  </div>
                </div>
              </div>

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
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="mx-6 mt-5 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 md:mx-8">
                {error}
              </div>
            )}

            {submitting && (
              <div className="mx-6 mt-5 rounded-xl bg-blue-50 p-4 text-sm font-medium text-blue-700 md:mx-8">
                Submitting your test and calculating your result...
              </div>
            )}

            <div className="space-y-6 p-6 md:p-8">
              {questions.map((question, index) => {
                const selectedAnswer = answers[question.id];

                return (
                  <div
                    key={question.id}
                    className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm md:p-6"
                  >
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

                    <div className="space-y-3">
                      {[
                        ["A", question.optionA],
                        ["B", question.optionB],
                        ["C", question.optionC],
                        ["D", question.optionD],
                      ].map(([letter, option]) => (
                        <label
                          key={letter}
                          className={`flex items-center gap-4 rounded-xl border p-4 transition ${
                            selectedAnswer === letter
                              ? "border-blue-500 bg-blue-50 shadow-sm"
                              : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
                          } ${
                            submitting ||
                            remainingSeconds === 0
                              ? "cursor-not-allowed opacity-70"
                              : "cursor-pointer"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={letter}
                            checked={selectedAnswer === letter}
                            disabled={
                              submitting ||
                              remainingSeconds === 0
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

              {questions.length > 0 && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 md:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {remainingSeconds === 0
                          ? "Time is up"
                          : "Ready to submit?"}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        You have answered {answeredCount} out of{" "}
                        {questions.length} questions.
                      </p>
                    </div>

                    <button
                      onClick={() => handleSubmitTest(false)}
                      disabled={submitting}
                      className="rounded-xl bg-green-600 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting
                        ? "Submitting..."
                        : remainingSeconds === 0
                          ? "Submitting Test..."
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
                {viewingPreviousResult
                  ? "Previous Test Result"
                  : "Performance Summary"}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {result.testTitle || "Mock Test"}
                {result.attemptId
                  ? ` · Attempt #${result.attemptId}`
                  : ""}
              </p>

              {result.answers?.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="font-semibold text-gray-800">
                    Answer Review
                  </h3>

                  {result.answers.map((answer, index) => (
                    <div
                      key={answer.questionId || index}
                      className="rounded-xl border border-gray-200 bg-white p-4"
                    >
                      <p className="font-medium text-gray-900">
                        {index + 1}. {answer.question}
                      </p>

                      <p className="mt-3 text-sm text-gray-600">
                        Your answer:{" "}
                        <span
                          className={
                            answer.isCorrect
                              ? "font-semibold text-green-700"
                              : "font-semibold text-red-700"
                          }
                        >
                          {answer.selectedAnswer || "Not answered"}
                          {answer.selectedAnswer &&
                          answer[`option${answer.selectedAnswer}`]
                            ? ` — ${answer[`option${answer.selectedAnswer}`]}`
                            : ""}
                        </span>
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        Correct answer:{" "}
                        <span className="font-semibold text-green-700">
                          {answer.correctAnswer || "Not available"}
                          {answer.correctAnswer &&
                          answer[`option${answer.correctAnswer}`]
                            ? ` — ${answer[`option${answer.correctAnswer}`]}`
                            : ""}
                        </span>
                      </p>

                      {answer.explanation && (
                        <p className="mt-3 text-sm leading-6 text-gray-500">
                          Explanation: {answer.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {result.answers?.length === 0 && (
                <p className="mt-5 text-sm text-gray-500">
                  Detailed answer review is currently unavailable.
                </p>
              )}
            </div>

            <button
              onClick={() => {
                setResult(null);
                setViewingPreviousResult(false);
                setError("");
              }}
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

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Previous Attempts
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review completed tests and track your progress.
            </p>
          </div>

          {historyLoading ? (
            <p className="text-sm text-gray-500">
              Loading your test history...
            </p>
          ) : previousAttempts.length === 0 ? (
            <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
              No previous attempts found. Start a mock test to see your history here.
            </p>
          ) : (
            <div className="space-y-3">
              {previousAttempts.map((item) => {
                const submitted = item.status === "Submitted";

                return (
                  <div
                    key={item.attemptId}
                    className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.testTitle || "Mock Test"}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.examType || "Mock Test"} · Attempt #
                        {item.attemptId}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.submittedAt
                          ? `Submitted: ${new Date(item.submittedAt).toLocaleString()}`
                          : `Started: ${new Date(item.startedAt).toLocaleString()}`}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {submitted && (
                        <div className="text-left md:text-right">
                          <p className="font-bold text-gray-900">
                            {item.score ?? 0} / {item.totalMarks ?? 0}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.percentage ?? 0}%
                          </p>
                        </div>
                      )}

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          submitted
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.status || "Unknown"}
                      </span>

                      {submitted && (
                        <button
                          onClick={() =>
                            handleViewResult(item.attemptId)
                          }
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          View Result
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {tests.map((test) => (
              <div
                key={test.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-2 bg-blue-600" />

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

                  <button
                    onClick={() => handleStartTest(test)}
                    disabled={starting}
                    className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {starting ? "Starting Test..." : "Start Test →"}
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
