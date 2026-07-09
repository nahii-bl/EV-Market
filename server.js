const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = process.env.PORT || 8091;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const REQUESTS_FILE = path.join(DATA_DIR, "requests.json");

const mimeTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".SCRIPT": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".ico": "image/x-icon"
};

function ensureDataFile() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(REQUESTS_FILE)) {
        fs.writeFileSync(REQUESTS_FILE, "[]", "utf8");
    }
}

function readRequests() {
    ensureDataFile();
    try {
        return JSON.parse(fs.readFileSync(REQUESTS_FILE, "utf8"));
    } catch {
        return [];
    }
}

function saveRequests(requests) {
    ensureDataFile();
    fs.writeFileSync(REQUESTS_FILE, JSON.stringify(requests, null, 2), "utf8");
}

function sendJson(response, statusCode, data) {
    response.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
    });
    response.end(JSON.stringify(data));
}

function readBody(request) {
    return new Promise((resolve, reject) => {
        let body = "";

        request.on("data", (chunk) => {
            body += chunk;
            if (body.length > 1_000_000) {
                request.destroy();
                reject(new Error("Request body is too large."));
            }
        });

        request.on("end", () => resolve(body));
        request.on("error", reject);
    });
}

function serveFile(response, requestedPath) {
    const cleanPath = requestedPath === "/" ? "/index.html" : decodeURIComponent(requestedPath);
    const filePath = path.normalize(path.join(ROOT, cleanPath));

    if (!filePath.startsWith(ROOT)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            response.end("Page not found");
            return;
        }

        const ext = path.extname(filePath);
        response.writeHead(200, {
            "Content-Type": mimeTypes[ext] || "application/octet-stream"
        });
        response.end(content);
    });
}

function cleanText(value) {
    return String(value || "").trim().slice(0, 300);
}

const server = http.createServer(async (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (request.method === "GET" && url.pathname === "/api/health") {
        sendJson(response, 200, { ok: true, service: "Mikey EV backend" });
        return;
    }

    if (request.method === "GET" && url.pathname === "/api/requests") {
        sendJson(response, 200, readRequests());
        return;
    }

    if (request.method === "POST" && url.pathname === "/api/requests") {
        try {
            const body = await readBody(request);
            const data = JSON.parse(body || "{}");

            const lead = {
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                name: cleanText(data.name),
                phone: cleanText(data.phone),
                model: cleanText(data.model),
                message: cleanText(data.message)
            };

            if (!lead.name || !lead.phone || !lead.model) {
                sendJson(response, 400, {
                    ok: false,
                    message: "Please fill your name, phone number, and interested model."
                });
                return;
            }

            const requests = readRequests();
            requests.unshift(lead);
            saveRequests(requests);

            sendJson(response, 201, {
                ok: true,
                message: "Request saved successfully.",
                request: lead
            });
        } catch {
            sendJson(response, 400, {
                ok: false,
                message: "Could not save the request."
            });
        }
        return;
    }

    serveFile(response, url.pathname);
});

server.listen(PORT, () => {
    console.log(`Mikey EV website is running at http://localhost:${PORT}`);
    console.log(`Admin requests page: http://localhost:${PORT}/admin.html`);
});
