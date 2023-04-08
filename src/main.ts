import { createHash } from "crypto";
import { getInput, setFailed } from "@actions/core";
import { create } from "@actions/artifact";

async function main() {
    try {
        const client = create();

        const paths = getInput("path").split("\n").map((str) => str.trim()).filter(Boolean);
        const uniquePaths = Array.from(new Set(paths));

        await Promise.all(uniquePaths.map((path) => {
            const name = createHash("sha256").update(path).digest("hex");
            return client.uploadArtifact(name, [path], ".", { continueOnError: false })
        }))
    } catch (err) {
        if (err instanceof Error) setFailed(err);
    }
}

main();
