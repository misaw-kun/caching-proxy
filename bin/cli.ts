#! /usr/bin/env bun
import { parseArgs } from "util";
import { runProxy } from "../src";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    port: {
      type: "string",
      default: "3000",
    },
    origin: {
      type: "string",
    },
  },
  strict: true,
  allowPositionals: true,
});

const proxyPort = Number(values.port);
const originUrl = values.origin;

if (!originUrl) {
  console.error("Error: Origin URL is required.");
  process.exit(1);
}

runProxy(proxyPort, originUrl);
