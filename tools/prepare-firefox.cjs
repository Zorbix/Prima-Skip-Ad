#!/usr/bin/env node
const { cpSync, existsSync, mkdirSync, readFileSync, rmSync } = require("fs");
const { execFileSync } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(readFileSync(path.join(root, "firefox/manifest.json"), "utf8"));
const stage = path.join(root, ".firefox-build");
const output = path.join(root, "store/firefox", `prímový-skip-ad-${manifest.version}.xpi`);

rmSync(stage, { recursive: true, force: true });
mkdirSync(stage, { recursive: true });
for (const file of ["ad-skip.js", "popup.html", "popup.css"]) {
  cpSync(path.join(root, file), path.join(stage, file));
}
cpSync(path.join(root, "firefox/popup.js"), path.join(stage, "popup.js"));
mkdirSync(path.join(stage, "firefox"), { recursive: true });
cpSync(path.join(root, "firefox/bridge.js"), path.join(stage, "firefox/bridge.js"));
cpSync(path.join(root, "icons"), path.join(stage, "icons"), { recursive: true });
cpSync(path.join(root, "firefox/manifest.json"), path.join(stage, "manifest.json"));
mkdirSync(path.dirname(output), { recursive: true });
if (existsSync(output)) rmSync(output);
execFileSync("zip", ["-qr", output, ".", "-x", "*/.DS_Store"], { cwd: stage });
rmSync(stage, { recursive: true, force: true });
console.log(output);
