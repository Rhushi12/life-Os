import fetch from 'node-fetch'; // Or native fetch if Node 18+

const WEBHOOK_URL = "https://n8n-63lu.onrender.com/webhook-test/b7f2b640-9a16-4fca-9c73-74ee427f4606";

const mockContext = {
    goal: "Score 330+ on GRE",
    constraints: ["No paid courses", "Self-study only"],
    preferences: ["Video learning", "Practice tests"],
    experienceLevel: "Intermediate",
    budget: "0",
    timeline: "3 months",
    userTier: "Free"
};

const payload = mockContext;

console.log("Sending payload to N8n (POST Test):", payload);

try {
    const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });

    const text = await response.text();
    console.log("Response status:", response.status);
    console.log("Response body:", text);

    try {
        const json = JSON.parse(text);
        console.log("Parsed JSON:", JSON.stringify(json, null, 2));
    } catch (e) {
        console.log("Response is not JSON.");
    }

} catch (error) {
    console.error("Error sending request:", error);
}
