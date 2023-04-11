import { createHash } from "crypto";
import { getMultilineInput, setFailed } from "@actions/core";
import { create as createArtifactClient } from "@actions/artifact";
import { create as createGlobClient } from "@actions/glob";

const artifactClient = createArtifactClient();

async function main() {
    try {
        const paths = getMultilineInput("path", { required: true });

        console.log("paths:", paths)

        await Promise.all(paths.map(async (path) => {
            const name = createHash("sha256").update(path).digest("hex");

            const globber = await createGlobClient(path);
            const paths = await globber.glob();

            console.log("paths:", paths)


            return artifactClient.uploadArtifact(name, paths, ".", { continueOnError: false })
        }))
    } catch (err) {
        if (err instanceof Error) setFailed(err);
    }
}

main();
