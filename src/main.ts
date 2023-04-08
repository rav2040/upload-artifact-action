import { createHash } from "crypto";
import { walk } from '@nodelib/fs.walk';
import { getInput, setFailed } from "@actions/core";
import { create } from "@actions/artifact";

async function main() {
    try {
        const client = create();

        const paths = getInput("path").split("\n").map((str) => str.trim()).filter(Boolean);
        const uniquePaths = Array.from(new Set(paths));

        await Promise.all(uniquePaths.map(async (path) => {
            const name = createHash("sha256").update(path).digest("hex");
            const paths = await getFileList(path);
            return client.uploadArtifact(name, paths, ".", { continueOnError: false })
        }))
    } catch (err) {
        if (err instanceof Error) setFailed(err);
    }
}

function getFileList(path: string) {
    return new Promise<string[]>((resolve, reject) => {
        walk(path, { entryFilter: ({ dirent }) => !dirent.isDirectory() }, (err, entries) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(entries.map((entry) => entry.path));
        });
    });
}

main();
