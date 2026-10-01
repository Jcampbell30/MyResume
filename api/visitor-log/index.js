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

module.exports = async function (context, req) {
    const forwardedFor = req.headers["x-forwarded-for"] || "";
    const ip = forwardedFor.split(",")[0].trim() || "Unknown";
    const userAgent = req.headers["user-agent"] || "";

    const visitorInfo = {
        ip: ip,
        userAgent: userAgent,
        deviceType: getDeviceType(userAgent),
        os: getOS(userAgent),
        browser: getBrowser(userAgent),
        referrer: req.headers["referer"] || "direct",
        timestamp: new Date().toISOString()
    };

    context.log("Visitor info:", JSON.stringify(visitorInfo));

    context.res = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: visitorInfo
    };
};
