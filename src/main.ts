import { createHash } from "crypto";
import { getInput, setFailed } from "@actions/core";
import { create } from "@actions/artifact";
import globby from "globby";

async function main() {
    try {
        const client = create();

        const paths = getInput("path").split(/\s+(?=([^"]*"[^"]*")*[^"]*$)/g).filter(Boolean).map((str) => str.trim());
        const uniquePaths = Array.from(new Set(paths));

        await Promise.all(uniquePaths.map(async (path) => {
            const name = createHash("sha256").update(path).digest("hex");
            const paths = await globby(path);
            return client.uploadArtifact(name, paths, ".", { continueOnError: false })
        }))
    } catch (err) {
        if (err instanceof Error) setFailed(err);
    }
}

main();
