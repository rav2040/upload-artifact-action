import { getInput, setFailed } from "@actions/core";
import { create } from "@actions/artifact";

async function main() {
    try {
        const client = create();

        const paths = getInput("path").split("\n").map((str) => str.trim()).filter(Boolean);
        const uniquePaths = Array.from(new Set(paths));

        await Promise.all(uniquePaths.map((path) => {
            return client.uploadArtifact(path, [path], process.cwd(), { continueOnError: false })
        }))
    } catch (err) {
        if (err instanceof Error) setFailed(err);
    }
}

main();
