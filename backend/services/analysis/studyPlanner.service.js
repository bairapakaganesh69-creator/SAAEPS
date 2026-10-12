// ==========================================================
// STUDY PLANNER ANALYSIS SERVICE
// ==========================================================
//
// Deterministic study-planning logic.
// No AI/LLM is required.
//
// Responsibilities:
// - Input validation
// - Study capacity calculation
// - Topic prioritization
// - Study/practice allocation
// - Revision scheduling
// - Mock-test scheduling
// - Daily schedule generation
//
// ==========================================================


// ==========================================================
// CONSTANTS
// ==========================================================

const HOURS_PER_MOCK_TEST = 3;

const REVISION_PERCENTAGE = 0.20;

const MOCK_TEST_PERCENTAGE = 0.10;

const MAX_REVISION_HOURS = 4;

const TOPIC_WEIGHTS = {
    weak: 3,
    strong: 1
};

const PRACTICE_PERCENTAGE = {
    weak: 0.25,
    strong: 0.20
};


// ==========================================================
// VALIDATE INPUT
// ==========================================================

const validatePlannerInput = ({
    studentName,
    goal,
    subject,
    durationDays,
    studyHoursPerDay,
    weakTopics,
    strongTopics
}) => {

    if (
        !studentName ||
        typeof studentName !== "string"
    ) {
        throw new Error(
            "Student name is required."
        );
    }


    if (
        !goal ||
        typeof goal !== "string"
    ) {
        throw new Error(
            "Goal is required."
        );
    }


    if (
        !subject ||
        typeof subject !== "string"
    ) {
        throw new Error(
            "Subject is required."
        );
    }


    if (
        !Number.isInteger(
            Number(durationDays)
        ) ||
        Number(durationDays) < 1
    ) {
        throw new Error(
            "Duration days must be greater than zero."
        );
    }


    if (
        Number(studyHoursPerDay) < 1
    ) {
        throw new Error(
            "Study hours per day must be at least 1."
        );
    }


    if (!Array.isArray(weakTopics)) {
        throw new Error(
            "Weak topics must be an array."
        );
    }


    if (
        !Array.isArray(
            strongTopics || []
        )
    ) {
        throw new Error(
            "Strong topics must be an array."
        );
    }

};


// ==========================================================
// CALCULATE STUDY CAPACITY
// ==========================================================

const calculateStudyCapacity = (
    durationDays,
    studyHoursPerDay
) => {

    const totalHours =
        Number(durationDays) *
        Number(studyHoursPerDay);


    // ------------------------------------------------------
    // Revision
    // ------------------------------------------------------

    let revisionHours =
        Math.floor(
            totalHours *
            REVISION_PERCENTAGE
        );


    revisionHours =
        Math.min(
            revisionHours,
            MAX_REVISION_HOURS
        );


    // ------------------------------------------------------
    // Mock Test
    // ------------------------------------------------------
    //
    // A mock test must fit inside one study day.
    //
    // Example:
    // 3 hours/day -> 3-hour mock
    // 2 hours/day -> 2-hour mock
    // 1 hour/day -> 1-hour mock
    //
    // ------------------------------------------------------

    const maximumMockHoursPerDay =
        Number(studyHoursPerDay);


    let mockTestHours = 0;


    if (
        totalHours >= 10 &&
        durationDays >= 2
    ) {

        mockTestHours =
            Math.min(
                HOURS_PER_MOCK_TEST,
                maximumMockHoursPerDay
            );

    }


    // ------------------------------------------------------
    // Topic Study Capacity
    // ------------------------------------------------------

    const topicStudyHours =
        Number(
            (
                totalHours -
                revisionHours -
                mockTestHours
            ).toFixed(2)
        );


    return {

        totalHours,

        topicStudyHours,

        revisionHours,

        mockTestHours

    };

};


// ==========================================================
// PRIORITIZE TOPICS
// ==========================================================

const prioritizeTopics = (
    weakTopics,
    strongTopics
) => {

    const topics = [];


    weakTopics.forEach(
        (topic) => {

            topics.push({

                topic,

                category: "weak",

                weight:
                    TOPIC_WEIGHTS.weak

            });

        }
    );


    strongTopics.forEach(
        (topic) => {

            topics.push({

                topic,

                category: "strong",

                weight:
                    TOPIC_WEIGHTS.strong

            });

        }
    );


    return topics;

};


// ==========================================================
// ALLOCATE TOPIC STUDY + PRACTICE TIME
// ==========================================================

const allocateStudyTime = (
    topics,
    topicStudyHours
) => {

    if (
        topics.length === 0
    ) {

        return [];

    }


    const totalWeight =
        topics.reduce(
            (
                sum,
                item
            ) =>
                sum + item.weight,
            0
        );


    let allocatedTotal = 0;


    return topics.map(
        (
            item,
            index
        ) => {

            let allocatedHours;


            // --------------------------------------------------
            // Preserve exact total hours after rounding.
            // --------------------------------------------------

            if (
                index ===
                topics.length - 1
            ) {

                allocatedHours =
                    Number(
                        (
                            topicStudyHours -
                            allocatedTotal
                        ).toFixed(2)
                    );

            }

            else {

                allocatedHours =
                    Number(
                        (
                            (
                                item.weight /
                                totalWeight
                            ) *
                            topicStudyHours
                        ).toFixed(2)
                    );


                allocatedTotal +=
                    allocatedHours;

            }


            // --------------------------------------------------
            // Practice is INSIDE the topic allocation.
            // It is not extra time.
            // --------------------------------------------------

            const practiceRate =
                PRACTICE_PERCENTAGE[
                    item.category
                ] || 0.20;


            let practiceHours =
                Number(
                    (
                        allocatedHours *
                        practiceRate
                    ).toFixed(2)
                );


            // Never allow practice to equal or exceed
            // the complete topic allocation.
            practiceHours =
                Math.min(
                    practiceHours,
                    Math.max(
                        0,
                        allocatedHours - 0.5
                    )
                );


            const studyHours =
                Number(
                    (
                        allocatedHours -
                        practiceHours
                    ).toFixed(2)
                );


            return {

                topic:
                    item.topic,

                category:
                    item.category,

                allocatedHours,

                studyHours,

                practiceHours

            };

        }
    );

};


// ==========================================================
// CREATE REVISION SCHEDULE
// ==========================================================

const createRevisionSchedule = (
    durationDays,
    revisionHours
) => {

    const totalDays =
        Number(durationDays);

    const totalRevisionHours =
        Number(revisionHours);


    if (
        totalDays <= 0 ||
        totalRevisionHours <= 0
    ) {

        return [];

    }


    const sessionCount =
        Math.min(
            totalRevisionHours,
            Math.max(
                1,
                totalDays
            )
        );


    const revisionDays = [];


    // ------------------------------------------------------
    // Very short plans
    // ------------------------------------------------------

    if (
        totalDays <= 3
    ) {

        revisionDays.push(
            totalDays
        );

    }

    else {

        for (
            let i = 1;
            i <= sessionCount;
            i++
        ) {

            let day =
                Math.round(
                    (
                        i *
                        totalDays
                    ) /
                    sessionCount
                );


            day =
                Math.max(
                    1,
                    Math.min(
                        totalDays,
                        day
                    )
                );


            if (
                !revisionDays.includes(day)
            ) {

                revisionDays.push(day);

            }

        }

    }


    revisionDays.sort(
        (a, b) => a - b
    );


    return revisionDays.map(
        (
            day,
            index
        ) => ({

            day,

            hours: 1,

            session:
                index ===
                revisionDays.length - 1
                    ? "Final Revision"
                    : "Spaced Revision"

        })
    );

};


// ==========================================================
// CREATE MOCK-TEST SCHEDULE
// ==========================================================
//
// Mock tests are deliberately placed close to the end
// of preparation.
//
// For a 14-day plan:
//
// Day 13 -> Mock Test
// Day 14 -> Final Revision
//
// ==========================================================

const createMockTestSchedule = (
    durationDays,
    mockTestHours
) => {

    const totalDays =
        Number(durationDays);

    const hours =
        Number(mockTestHours);


    if (
        totalDays < 2 ||
        hours <= 0
    ) {

        return [];

    }


    const mockTestDay =
        Math.max(
            1,
            totalDays - 1
        );


    return [

        {

            day:
                mockTestDay,

            hours,

            activity:
                "Full subject mock test"

        }

    ];

};


// ==========================================================
// CREATE DAILY SCHEDULE
// ==========================================================

const createDailySchedule = ({
    durationDays,
    studyHoursPerDay,
    topicAllocations,
    revisionSchedule,
    mockTestSchedule
}) => {

    const dailySchedule = [];


    // ------------------------------------------------------
    // Make working copies.
    // ------------------------------------------------------

    const remainingTopics =
        topicAllocations.map(
            (
                item
            ) => ({

                ...item

            })
        );


    for (
        let day = 1;
        day <= Number(durationDays);
        day++
    ) {

        let remainingDailyHours =
            Number(
                studyHoursPerDay
            );


        const tasks = [];


        // ==================================================
        // 1. FINAL / SPACED REVISION
        // ==================================================

        const revision =
            revisionSchedule.find(
                (
                    item
                ) =>
                    item.day === day
            );


        if (
            revision &&
            remainingDailyHours > 0
        ) {

            const hours =
                Math.min(
                    revision.hours,
                    remainingDailyHours
                );


            tasks.push({

                type:
                    "revision",

                topic:
                    "Previously Studied Topics",

                session:
                    revision.session,

                hours

            });


            remainingDailyHours =
                Number(
                    (
                        remainingDailyHours -
                        hours
                    ).toFixed(2)
                );

        }


        // ==================================================
        // 2. MOCK TEST
        // ==================================================

        const mockTest =
            mockTestSchedule.find(
                (
                    item
                ) =>
                    item.day === day
            );


        if (
            mockTest &&
            remainingDailyHours > 0
        ) {

            const hours =
                Math.min(
                    mockTest.hours,
                    remainingDailyHours
                );


            tasks.push({

                type:
                    "mock_test",

                topic:
                    "Full Subject Mock Test",

                activity:
                    mockTest.activity,

                hours

            });


            remainingDailyHours =
                Number(
                    (
                        remainingDailyHours -
                        hours
                    ).toFixed(2)
                );

        }


        // ==================================================
        // 3. TOPIC STUDY + PRACTICE
        // ==================================================
        //
        // Study and practice consume the topic allocation.
        // Practice is therefore never "extra" time.
        //
        // ==================================================

        for (
            const topic
            of remainingTopics
        ) {

            if (
                remainingDailyHours <= 0
            ) {

                break;

            }


            // ------------------------------------------------
            // STUDY
            // ------------------------------------------------

            if (
                topic.studyHours > 0
            ) {

                const studyHours =
                    Math.min(
                        topic.studyHours,
                        remainingDailyHours
                    );


                tasks.push({

                    type:
                        "study",

                    topic:
                        topic.topic,

                    category:
                        topic.category,

                    hours:
                        Number(
                            studyHours.toFixed(2)
                        )

                });


                topic.studyHours =
                    Number(
                        (
                            topic.studyHours -
                            studyHours
                        ).toFixed(2)
                    );


                remainingDailyHours =
                    Number(
                        (
                            remainingDailyHours -
                            studyHours
                        ).toFixed(2)
                    );

            }


            if (
                remainingDailyHours <= 0
            ) {

                continue;

            }


            // ------------------------------------------------
            // PRACTICE
            // ------------------------------------------------

            if (
                topic.practiceHours > 0
            ) {

                const practiceHours =
                    Math.min(
                        topic.practiceHours,
                        remainingDailyHours
                    );


                tasks.push({

                    type:
                        "practice",

                    topic:
                        topic.topic,

                    category:
                        topic.category,

                    activity:
                        topic.category === "weak"
                            ? "Focused practice and problem solving"
                            : "Practice questions and self-assessment",

                    hours:
                        Number(
                            practiceHours.toFixed(2)
                        )

                });


                topic.practiceHours =
                    Number(
                        (
                            topic.practiceHours -
                            practiceHours
                        ).toFixed(2)
                    );


                remainingDailyHours =
                    Number(
                        (
                            remainingDailyHours -
                            practiceHours
                        ).toFixed(2)
                    );

            }

        }


        // ==================================================
        // DAILY TOTAL
        // ==================================================

        const totalHours =
            Number(
                (
                    Number(studyHoursPerDay) -
                    remainingDailyHours
                ).toFixed(2)
            );


        dailySchedule.push({

            day,

            totalHours,

            tasks

        });

    }


    return dailySchedule;

};


// ==========================================================
// CREATE STUDY PLANNER
// ==========================================================

const createStudyPlanner = ({
    studentName,
    goal,
    subject,
    durationDays,
    studyHoursPerDay,
    weakTopics,
    strongTopics = [],
    previousScore = null,
    examDate = null
}) => {

    // ------------------------------------------------------
    // Validation
    // ------------------------------------------------------

    validatePlannerInput({

        studentName,

        goal,

        subject,

        durationDays,

        studyHoursPerDay,

        weakTopics,

        strongTopics

    });


    // ------------------------------------------------------
    // Capacity
    // ------------------------------------------------------

    const capacity =
        calculateStudyCapacity(

            Number(durationDays),

            Number(studyHoursPerDay)

        );


    // ------------------------------------------------------
    // Topic prioritization
    // ------------------------------------------------------

    const prioritizedTopics =
        prioritizeTopics(

            weakTopics,

            strongTopics

        );


    // ------------------------------------------------------
    // Topic study + practice allocation
    // ------------------------------------------------------

    const topicAllocations =
        allocateStudyTime(

            prioritizedTopics,

            capacity.topicStudyHours

        );


    // ------------------------------------------------------
    // Revision
    // ------------------------------------------------------

    const revisionSchedule =
        createRevisionSchedule(

            Number(durationDays),

            capacity.revisionHours

        );


    // ------------------------------------------------------
    // Mock test
    // ------------------------------------------------------

    const mockTestSchedule =
        createMockTestSchedule(

            Number(durationDays),

            capacity.mockTestHours

        );


    // ------------------------------------------------------
    // Daily schedule
    // ------------------------------------------------------

    const dailySchedule =
        createDailySchedule({

            durationDays:
                Number(durationDays),

            studyHoursPerDay:
                Number(studyHoursPerDay),

            topicAllocations,

            revisionSchedule,

            mockTestSchedule

        });


    // ------------------------------------------------------
    // Final result
    // ------------------------------------------------------

    return {

        studentName,

        goal,

        subject,

        durationDays:
            Number(durationDays),

        studyHoursPerDay:
            Number(studyHoursPerDay),

        previousScore,

        examDate,

        capacity,

        topicAllocations,

        revisionSchedule,

        mockTestSchedule,

        dailySchedule

    };

};


// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {

    createStudyPlanner,

    validatePlannerInput,

    calculateStudyCapacity,

    prioritizeTopics,

    allocateStudyTime,

    createRevisionSchedule,

    createMockTestSchedule,

    createDailySchedule

};