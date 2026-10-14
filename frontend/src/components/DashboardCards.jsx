import React from "react";

function DashboardCards({ stats }) {
  const cards = [
    {
      title: "Subjects",
      value: stats?.subjects ?? 0,
      color: "bg-blue-600",
      icon: "📚",
    },
    {
      title: "Mock Tests",
      value: stats?.tests ?? 0,
      color: "bg-green-600",
      icon: "📝",
    },
    {
      title: "Average Score",
      value: `${Number(stats?.score ?? 0).toFixed(1)}%`,
      color: "bg-purple-600",
      icon: "📊",
    },
    {
      title: "Study Hours",
      value:
        stats?.hours == null
          ? "—"
          : `${stats.hours} hrs`,
      subtitle:
        stats?.hours == null
          ? "Not tracked yet"
          : "Total study time",
      color: "bg-orange-500",
      icon: "⏱️",
    },
  ];

  return (
    <section aria-label="Academic statistics">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`${card.color} rounded-xl p-6 text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl`}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-medium">
                {card.title}
              </h3>

              <span className="text-3xl" aria-hidden="true">
                {card.icon}
              </span>
            </div>

            <p className="mt-5 text-4xl font-bold">
              {card.value}
            </p>

            {card.subtitle && (
              <p className="mt-2 text-sm text-white/85">
                {card.subtitle}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default DashboardCards;