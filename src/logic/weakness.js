// src/logic/weakness.js

export function detectWeaknesses(subjects) {
    const weaknesses = [];
    const strengths = [];

    subjects.forEach(sub => {
        if (sub.average < 50) {
            weaknesses.push({
                subject: sub.name,
                level: "weak",
                message: `Ana matatizo kwenye ${sub.name}`
            });
        } else if (sub.average >= 75) {
            strengths.push({
                subject: sub.name,
                level: "strong",
                message: `Anafanya vizuri kwenye ${sub.name}`
            });
        }
    });

    return { weaknesses, strengths };
}
