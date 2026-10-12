import React, { useState } from "react";
import api from "../services/api";

const StudyPlanner = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const [formData, setFormData] = useState({
    studentName: storedUser?.fullName || "",
    goal: "",
    subject: "",
    durationDays: "",
    studyHoursPerDay: "",
    weakTopics: "",
    strongTopics: "",
    previousScore: "",
    examDate: "",
  });

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setPlan(null);

    try {
      const payload = {
        studentName: formData.studentName,
        goal: formData.goal,
        subject: formData.subject,
        durationDays: Number(formData.durationDays),
        studyHoursPerDay: Number(formData.studyHoursPerDay),

        weakTopics: formData.weakTopics
          .split(",")
          .map((topic) => topic.trim())
          .filter(Boolean),

        strongTopics: formData.strongTopics
          ? formData.strongTopics
              .split(",")
              .map((topic) => topic.trim())
              .filter(Boolean)
          : [],

        ...(formData.previousScore
          ? { previousScore: Number(formData.previousScore) }
          : {}),

        ...(formData.examDate
          ? { examDate: formData.examDate }
          : {}),
      };

      const response = await api.post("/ai/study-plan", payload);

      setPlan(response.data?.response || null);
    } catch (err) {
      console.error("Study Planner Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to generate study plan. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
const formatTime = (hours) => {
  if (hours === undefined || hours === null) {
    return "-";
  }

  const totalMinutes = Math.round(Number(hours) * 60);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (hrs === 0) {
    return `${mins} min`;
  }

  if (mins === 0) {
    return `${hrs} hr`;
  }

  return `${hrs} hr ${mins} min`;
};
  return (
    
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>📚 AI Study Planner</h1>

        <p style={styles.subtitle}>
          Create a personalized study plan based on your goals,
          available time, strengths and weak topics.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Student Name</label>
          <input
            style={styles.input}
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Goal</label>
          <input
            style={styles.input}
            type="text"
            name="goal"
            placeholder="Example: Prepare for ECET"
            value={formData.goal}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Subject</label>
          <select
            style={styles.input}
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          >
            <option value="">Select Subject</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Engineering">Engineering</option>
          </select>

          <label style={styles.label}>Study Duration (Days)</label>
          <input
            style={styles.input}
            type="number"
            name="durationDays"
            min="1"
            value={formData.durationDays}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Study Hours Per Day</label>
          <input
            style={styles.input}
            type="number"
            name="studyHoursPerDay"
            min="1"
            step="0.5"
            value={formData.studyHoursPerDay}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Weak Topics</label>
          <input
            style={styles.input}
            type="text"
            name="weakTopics"
            placeholder="Example: Trigonometry, Coordinate Geometry"
            value={formData.weakTopics}
            onChange={handleChange}
            required
          />

          <small style={styles.hint}>
            Separate multiple topics using commas.
          </small>

          <label style={styles.label}>Strong Topics</label>
          <input
            style={styles.input}
            type="text"
            name="strongTopics"
            placeholder="Example: Algebra, Statistics"
            value={formData.strongTopics}
            onChange={handleChange}
          />

          <label style={styles.label}>Previous Score (%)</label>
          <input
            style={styles.input}
            type="number"
            name="previousScore"
            min="0"
            max="100"
            placeholder="Example: 65"
            value={formData.previousScore}
            onChange={handleChange}
          />

          <label style={styles.label}>Exam Date</label>
          <input
            style={styles.input}
            type="date"
            name="examDate"
            value={formData.examDate}
            onChange={handleChange}
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Generating Plan..." : "Generate Study Plan"}
          </button>
        </form>

        {error && <div style={styles.error}>{error}</div>}

        {plan && (
          <div style={styles.result}>
            <h2 style={styles.resultTitle}>📅 Your Study Plan</h2>

            <div style={styles.summary}>
              <div style={styles.summaryCard}>
                <b>Goal</b>
                <span>{plan.goal}</span>
              </div>

              <div style={styles.summaryCard}>
                <b>Subject</b>
                <span>{plan.subject}</span>
              </div>

              <div style={styles.summaryCard}>
                <b>Duration</b>
                <span>{plan.durationDays} Days</span>
              </div>

              <div style={styles.summaryCard}>
                <b>Daily Time</b>
                <span>{plan.studyHoursPerDay} Hr</span>
              </div>

              <div style={styles.summaryCard}>
                <b>Previous Score</b>
                <span>{plan.previousScore ?? "-"}%</span>
              </div>
            </div>

            <h3 style={styles.sectionTitle}>📊 Study Allocation</h3>

            {plan.topicAllocations?.map((topic, index) => (
              <div style={styles.topicCard} key={index}>
                <div>
                  <strong>{topic.topic}</strong>

                  <span
                    style={{
                      ...styles.badge,
                      background:
                        topic.category === "weak"
                          ? "#fee2e2"
                          : "#dcfce7",
                      color:
                        topic.category === "weak"
                          ? "#b91c1c"
                          : "#166534",
                    }}
                  >
                    {topic.category}
                  </span>
                </div>

                <p>
  Total: <b>{formatTime(topic.allocatedHours)}</b>
</p>

<p>
  📖 Study: {formatTime(topic.studyHours)} &nbsp; | &nbsp;
  ✏️ Practice: {formatTime(topic.practiceHours)}
</p>
              </div>
            ))}

            <h3 style={styles.sectionTitle}>📅 Daily Schedule</h3>

            {plan.dailySchedule?.map((day) => (
              <div style={styles.dayCard} key={day.day}>
                <div style={styles.dayHeader}>
                  <strong>Day {day.day}</strong>
                  <span>{formatTime(day.totalHours)}</span>
                </div>

                {day.tasks.length === 0 ? (
                  <p>No tasks scheduled.</p>
                ) : (
                  day.tasks.map((task, index) => (
                    <div style={styles.task} key={index}>
                      <span>
                        {task.type === "study" && "📖"}
                        {task.type === "practice" && "✏️"}
                        {task.type === "revision" && "🔄"}
                        {task.type === "mock_test" && "📝"}
                      </span>

                      <div>
                        <strong>{task.topic}</strong>

                        <p>
                          {task.type === "study" && "Study"}
                          {task.type === "practice" && "Practice"}
                          {task.type === "revision" && task.session}
                          {task.type === "mock_test" &&
                            task.activity}
                          {" — "}
                          {formatTime(task.hours)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "30px 20px",
  },

  container: {
    maxWidth: "850px",
    margin: "0 auto",
    background: "#ffffff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  },

  title: {
    marginBottom: "8px",
    color: "#1e293b",
  },

  subtitle: {
    color: "#64748b",
    marginBottom: "25px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontWeight: "600",
    marginTop: "10px",
    color: "#334155",
  },

  input: {
    padding: "11px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
  },

  hint: {
    color: "#64748b",
  },

  button: {
    marginTop: "20px",
    padding: "13px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
  },

  result: {
    marginTop: "30px",
    padding: "20px",
    background: "#f8fafc",
    borderRadius: "12px",
  },

  resultTitle: {
    color: "#1e293b",
    marginBottom: "20px",
  },

  summary: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
    gap: "10px",
  },

  summaryCard: {
    background: "#ffffff",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
  },

  summaryCardSpan: {
    display: "block",
  },

  sectionTitle: {
    marginTop: "25px",
    color: "#334155",
  },

  topicCard: {
    background: "#ffffff",
    padding: "15px",
    marginTop: "10px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
  },

  badge: {
    marginLeft: "10px",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
  },

  dayCard: {
    background: "#ffffff",
    padding: "15px",
    marginTop: "10px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
  },

  dayHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  task: {
    display: "flex",
    gap: "10px",
    padding: "10px",
    marginTop: "6px",
    background: "#f8fafc",
    borderRadius: "8px",
  },

  error: {
    marginTop: "20px",
    padding: "12px",
    background: "#fee2e2",
    color: "#b91c1c",
    borderRadius: "8px",
  },
};

export default StudyPlanner;