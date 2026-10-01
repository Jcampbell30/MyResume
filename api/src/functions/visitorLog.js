const { app } = require("@azure/functions");

function getDeviceType(userAgent) {
    if (!userAgent) return "Unknown";
    if (/tablet|ipad/i.test(userAgent)) return "Tablet";
    if (/mobi|android|iphone/i.test(userAgent)) return "Mobile";
    return "Desktop";
}

function getOS(userAgent) {
    if (!userAgent) return "Unknown";
    if (/windows/i.test(userAgent)) return "Windows";
    if (/mac os/i.test(userAgent)) return "macOS";
    if (/android/i.test(userAgent)) return "Android";
    if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS";
    if (/linux/i.test(userAgent)) return "Linux";
    return "Unknown";
}

function getBrowser(userAgent) {
    if (!userAgent) return "Unknown";
    if (userAgent.includes("Edg/")) return "Edge";
    if (userAgent.includes("Chrome/") && !userAgent.includes("Edg/")) return "Chrome";
    if (userAgent.includes("Firefox/")) return "Firefox";
    if (userAgent.includes("Safari/") && !userAgent.includes("Chrome/")) return "Safari";
    return "Unknown";
}

app.http("visitorLog", {
    methods: ["GET", "POST"],
    authLevel: "anonymous",
    route: "visitor-log",
    handler: async (request, context) => {
        // Azure Static Web Apps / App Service put the real client IP in
        // x-forwarded-for (may be a comma-separated list; first entry is the client)
        const forwardedFor = request.headers.get("x-forwarded-for") || "";
        const ip = forwardedFor.split(",")[0].trim() || "Unknown";

        const userAgent = request.headers.get("user-agent") || "";

        const visitorInfo = {
            ip: ip,
            userAgent: userAgent,
            deviceType: getDeviceType(userAgent),
            os: getOS(userAgent),
            browser: getBrowser(userAgent),
            referrer: request.headers.get("referer") || "direct",
            timestamp: new Date().toISOString()
        };

        // This gets picked up by Application Insights automatically once it's
        // enabled on the Static Web App (the screen you were just looking at)
        context.log("Visitor info:", JSON.stringify(visitorInfo));

        return {
            status: 200,
            jsonBody: visitorInfo
        };
    }
});
