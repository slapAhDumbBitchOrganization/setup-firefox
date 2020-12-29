import * as core from "@actions/core";
import * as io from "@actions/io";
import cp from "child_process";
import * as installer from "./installer";
import { getPlatform } from "./platform";
import { LatestVersion } from "./versions";

async function run(): Promise<void> {
  try {
    const version = core.getInput("firefox-version") || LatestVersion.LATEST;
    const platform = getPlatform();
    const language = core.getInput("firefox-language") || "en-US";

    core.info(`Setup firefox ${version} (${language})`);

    const installDir = await installer.install(version, platform, language);

    core.addPath(installDir);
    core.info(`Successfully setup firefox version ${version}`);

    // output the version actually being used
    const firefoxBin = await io.which("firefox");
    const fierfoxVersion = (
      cp.execSync(`${firefoxBin} --version`) || ""
    ).toString();
    core.info(fierfoxVersion);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();