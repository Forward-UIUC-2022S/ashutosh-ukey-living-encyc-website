/* This file gets example sentence from Whoosh index of arxiv cs papers */
const { spawn } = require("child_process");
const { chunksToLinesAsync, chomp } = require("@rauschma/stringio");

const SCRIPT_PATH = `${process.env["MODULES_DIR"]}/naifu-zheng-example-sentence-extraction/start_gen_proc.sh`;

const whooshProc = spawn(
  `stdbuf`,
  ["-oL", "bash", SCRIPT_PATH, process.env["MODULES_DIR"]],
  {
    stdio: ["pipe", "pipe", process.stderr],
  }
);

async function* stdoutBuf(readable) {
  for await (const line of chunksToLinesAsync(readable)) {
    yield chomp(line);
  }
}

exports.proc = whooshProc;
exports.outBuf = () => stdoutBuf(whooshProc.stdout);
