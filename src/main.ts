import { getInput, setFailed } from "@actions/core";
import { create } from "@actions/artifact";

async function main() {
    try {
        const client = create();

        const paths = getInput("path").split("\n").map((str) => str.trim()).filter(Boolean);
        const uniquePaths = Array.from(new Set(paths));

        await Promise.all(uniquePaths.map((path) => {
            const name = encodeURIComponent(path);
            console.log("cwd:", process.cwd());
            return client.uploadArtifact(name, [path], ".", { continueOnError: false })
        }))
    } catch (err) {
        if (err instanceof Error) setFailed(err);
    }
}

main();
