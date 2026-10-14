import React from "react";

function RecentTests({ tests = [] }) {
  return (
    <section className="rounded-xl bg-white p-5 shadow-lg">
      <h2 className="mb-4 text-xl font-bold text-gray-800">
        Recent Tests
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-gray-600">
              <th scope="col" className="p-3 text-left">
                Test
              </th>
              <th scope="col" className="p-3 text-left">
                Score
              </th>
              <th scope="col" className="p-3 text-left">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {tests.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="p-6 text-center text-gray-500"
                >
                  No completed tests yet.
                </td>
              </tr>
            ) : (
              tests.map((test, index) => (
                <tr
                  key={test.attemptId ?? `${test.name}-${test.date}-${index}`}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="p-3 font-medium text-gray-800">
                    {test.name || "Mock Test"}
                  </td>

                  <td className="p-3 whitespace-nowrap">
                    <span className="font-semibold text-gray-800">
                      {test.scoreEarned != null &&
                      test.totalMarks != null
                        ? `${test.scoreEarned} / ${test.totalMarks}`
                        : "—"}
                    </span>

                    <span className="mt-1 block text-xs text-gray-500">
                      {Number.isFinite(Number(test.score))
                        ? `${Number(test.score).toFixed(1)}%`
                        : "Percentage unavailable"}
                    </span>
                  </td>

                  <td className="p-3 whitespace-nowrap text-gray-600">
                    {test.date || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default RecentTests;