
const { spawn } = require("child_process");

const BASE_URL =
    process.env.LLAMA_CPP_BASE_URL ||
    "http://127.0.0.1:1234";

const SERVER_PATH =
    process.env.LLAMA_CPP_SERVER_PATH ||
    "";

const MODEL_PATH =
    process.env.LLAMA_CPP_MODEL_PATH ||
    "";

const AUTO_START =
    process.env.LLAMA_CPP_AUTO_START !== "false";

const STARTUP_TIMEOUT =
    Number(process.env.LLAMA_CPP_STARTUP_TIMEOUT) || 120000;

let childProcess = null;
let ownsProcess = false;
let stopping = false;

const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

async function isServerReady() {
    try {
        const response = await fetch(
            `${BASE_URL}/v1/models`,
            {
                signal: AbortSignal.timeout(2000),
            }
        );

        return response.ok;
    } catch {
        return false;
    }
}

async function waitForServer() {
    const deadline = Date.now() + STARTUP_TIMEOUT;

    while (Date.now() < deadline) {
        if (stopping) {
            throw new Error(
                "llama.cpp startup was cancelled."
            );
        }

        if (childProcess && childProcess.exitCode !== null) {
            throw new Error(
                `llama.cpp exited with code ${childProcess.exitCode}.`
            );
        }

        if (await isServerReady()) {
            console.log(
                "✅ llama.cpp server is ready."
            );
            return;
        }

        await sleep(1000);
    }

    throw new Error(
        "llama.cpp did not become ready before the startup timeout."
    );
}

async function startLlamaCpp() {
    stopping = false;

    // Reuse a server that is already listening.
    if (await isServerReady()) {
        console.log(
            "✅ Reusing the existing llama.cpp server."
        );
        ownsProcess = false;
        return;
    }

    if (!AUTO_START) {
        throw new Error(
            "llama.cpp is not running and automatic startup is disabled."
        );
    }

    if (!SERVER_PATH || !MODEL_PATH) {
        throw new Error(
            "Set LLAMA_CPP_SERVER_PATH and LLAMA_CPP_MODEL_PATH in backend/.env."
        );
    }

    console.log(
        "🚀 Starting llama.cpp automatically..."
    );

    childProcess = spawn(
        SERVER_PATH,
        [
            "-m",
            MODEL_PATH,
            "--host",
            "127.0.0.1",
            "--port",
            new URL(BASE_URL).port || "1234",
            "-c",
            "4096",
        ],
        {
            stdio: "inherit",
        }
    );

    ownsProcess = true;

    childProcess.once("error", (error) => {
        console.error(
            "❌ Could not start llama.cpp:",
            error.message
        );
    });

    childProcess.once("exit", (code, signal) => {
        if (!stopping) {
            console.warn(
                `⚠️ llama.cpp exited (code=${code}, signal=${signal}).`
            );
        }
    });

    try {
        await waitForServer();
    } catch (error) {
        if (ownsProcess && childProcess && childProcess.exitCode === null) {
            childProcess.kill("SIGTERM");
        }

        childProcess = null;
        ownsProcess = false;
        throw error;
    }
}

async function stopLlamaCpp() {
    stopping = true;

    // Never stop a server that was already running before this manager.
    if (!ownsProcess || !childProcess) {
        return;
    }

    const processToStop = childProcess;

    childProcess = null;
    ownsProcess = false;

    if (processToStop.exitCode === null) {
        processToStop.kill("SIGTERM");
    }
}

module.exports = {
    startLlamaCpp,
    stopLlamaCpp,
};
