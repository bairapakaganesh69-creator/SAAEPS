const {
    createStudyPlanner
} = require("./services/analysis/studyPlanner.service");


const testInput = {
    studentName: "Test Student",

    goal: "Prepare for Data Structures examination",

    subject: "Data Structures",

    durationDays: 14,

    studyHoursPerDay: 3,

    weakTopics: [
        "Linked Lists",
        "Trees"
    ],

    strongTopics: [
        "Stacks",
        "Graphs"
    ],

    previousScore: 62,

    examDate: "2026-09-10"
};


const assert = (condition, message) => {

    if (!condition) {
        throw new Error(
            `ASSERTION FAILED: ${message}`
        );
    }

};


try {

    console.log(
        "\n=========================================="
    );

    console.log(
        "SAAEPS STUDY PLANNER REGRESSION TEST"
    );

    console.log(
        "==========================================\n"
    );


    const result =
        createStudyPlanner(testInput);


    // ======================================================
    // BASIC OUTPUT
    // ======================================================

    console.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );


    // ======================================================
    // 1. CAPACITY VALIDATION
    // ======================================================

    const {
        totalHours,
        topicStudyHours,
        revisionHours,
        mockTestHours
    } = result.capacity;


    assert(
        totalHours === 42,
        "Total study capacity should be 42 hours."
    );


    const plannedCapacity =
        topicStudyHours +
        revisionHours +
        mockTestHours;


    assert(
        Math.abs(
            plannedCapacity -
            totalHours
        ) < 0.01,
        "Capacity components must equal total capacity."
    );


    // ======================================================
    // 2. DAILY CAPACITY VALIDATION
    // ======================================================

    let totalScheduledHours = 0;


    result.dailySchedule.forEach(
        (day) => {

            assert(
                day.totalHours <=
                    testInput.studyHoursPerDay + 0.01,
                `Day ${day.day} exceeds the daily study-hour limit.`
            );


            assert(
                day.totalHours >= 0,
                `Day ${day.day} has an invalid negative total.`
            );


            const taskTotal =
                day.tasks.reduce(
                    (
                        sum,
                        task
                    ) =>
                        sum +
                        Number(task.hours),
                    0
                );


            assert(
                Math.abs(
                    taskTotal -
                    day.totalHours
                ) < 0.01,
                `Day ${day.day} task total does not match day total.`
            );


            totalScheduledHours +=
                day.totalHours;

        }
    );


    // ======================================================
    // 3. TOTAL SCHEDULE VALIDATION
    // ======================================================

    assert(
        Math.abs(
            totalScheduledHours -
            totalHours
        ) < 0.01,
        "Total scheduled hours must equal total available hours."
    );


    // ======================================================
    // 4. WEAK TOPIC PRIORITY
    // ======================================================

    const linkedLists =
        result.topicAllocations.find(
            (item) =>
                item.topic === "Linked Lists"
        );


    const stacks =
        result.topicAllocations.find(
            (item) =>
                item.topic === "Stacks"
        );


    assert(
        linkedLists.allocatedHours >
            stacks.allocatedHours,
        "Weak topics should receive more time than strong topics."
    );


    // ======================================================
    // 5. REVISION VALIDATION
    // ======================================================

    assert(
        result.revisionSchedule.length > 0,
        "Revision schedule should not be empty."
    );


    const finalRevision =
        result.revisionSchedule[
            result.revisionSchedule.length - 1
        ];


    assert(
        finalRevision.session ===
            "Final Revision",
        "The final revision session must be labeled Final Revision."
    );


    // ======================================================
    // 6. MOCK TEST VALIDATION
    // ======================================================

    assert(
        result.mockTestSchedule.length > 0,
        "Mock test schedule should not be empty."
    );


    const mockTest =
        result.mockTestSchedule[0];


    assert(
        mockTest.day >
            Math.floor(
                testInput.durationDays / 2
            ),
        "Mock test should occur toward the end of the plan."
    );


    assert(
        mockTest.hours <=
            testInput.studyHoursPerDay,
        "Mock test must fit within one study day."
    );


    // ======================================================
    // 7. MOCK TEST MUST APPEAR IN DAILY SCHEDULE
    // ======================================================

    const mockTestTasks =
        result.dailySchedule.flatMap(
            (day) =>
                day.tasks.filter(
                    (task) =>
                        task.type === "mock_test"
                )
        );


    assert(
        mockTestTasks.length ===
            result.mockTestSchedule.length,
        "Every scheduled mock test must appear in the daily schedule."
    );


    // ======================================================
    // 8. PRACTICE VALIDATION
    // ======================================================

    const practiceTasks =
        result.dailySchedule.flatMap(
            (day) =>
                day.tasks.filter(
                    (task) =>
                        task.type === "practice"
                )
        );


    assert(
        practiceTasks.length > 0,
        "Practice tasks should appear in the daily schedule."
    );


    // ======================================================
    // SUCCESS
    // ======================================================

    console.log(
        "\n=========================================="
    );

    console.log(
        "✅ ALL PLANNER ASSERTIONS PASSED"
    );

    console.log(
        "==========================================\n"
    );


} catch (error) {

    console.error(
        "\n=========================================="
    );

    console.error(
        "❌ STUDY PLANNER TEST FAILED"
    );

    console.error(
        "=========================================="
    );


    console.error(
        error.message
    );


    console.error(
        "\n==========================================\n"
    );

    process.exitCode = 1;

}