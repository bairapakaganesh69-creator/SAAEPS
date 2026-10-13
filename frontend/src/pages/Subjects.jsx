import React, { useState } from "react";

function Subjects() {
  const [selectedExam, setSelectedExam] = useState("ECET");

  const examSubjects = {
    ECET: [
      {
        name: "Mathematics",
        description: "Practise mathematical concepts and problem-solving.",
        icon: "📐",
      },
      {
        name: "Physics",
        description: "Review physics concepts and numerical problems.",
        icon: "⚡",
      },
      {
        name: "Chemistry",
        description: "Revise chemistry concepts and important topics.",
        icon: "🧪",
      },
      {
        name: "Branch-Specific Subjects",
        description: "Prepare for your selected engineering branch.",
        icon: "💻",
      },
    ],
    POLYCET: [
      {
        name: "Mathematics",
        description: "Practise mathematical concepts and problems.",
        icon: "📐",
      },
      {
        name: "Physics",
        description: "Review physics concepts and applications.",
        icon: "⚡",
      },
      {
        name: "Chemistry",
        description: "Revise chemistry concepts and important topics.",
        icon: "🧪",
      },
    ],
  };

  const subjects = examSubjects[selectedExam];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            ExamMentor AI
          </p>

          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Explore Subjects
          </h1>

          <p className="mt-3 text-slate-600">
            Choose your entrance exam and explore the subjects for your
            preparation.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {["ECET", "POLYCET"].map((exam) => (
            <button
              key={exam}
              type="button"
              onClick={() => setSelectedExam(exam)}
              className={`rounded-xl px-6 py-3 font-semibold transition ${
                selectedExam === exam
                  ? "bg-blue-700 text-white shadow-md"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
              }`}
            >
              {exam}
            </button>
          ))}
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {selectedExam} Subjects
          </h2>

          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            {subjects.length} categories
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <div
              key={subject.name}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-3xl">
                {subject.icon}
              </div>

              <h3 className="mb-2 text-lg font-bold text-slate-900">
                {subject.name}
              </h3>

              <p className="text-sm leading-6 text-slate-600">
                {subject.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <h3 className="font-semibold text-blue-900">
            Prepare at your own pace
          </h3>

          <p className="mt-2 text-sm leading-6 text-blue-800">
            Select a subject category to begin exploring its study materials
            and practice questions as those features are connected.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Subjects;