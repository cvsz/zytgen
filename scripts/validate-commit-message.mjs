const args = process.argv.slice(2);

if (args[0] === "--") {
  args.shift();
}

const message = args.join(" ").trim();

if (!message) {
  console.error("Usage: pnpm commitlint -- \"type(scope): subject\"");
  process.exit(2);
}

const conventionalCommit =
  /^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\([a-z0-9._/-]+\))?!?: [a-z0-9].{0,71}$/;

if (!conventionalCommit.test(message)) {
  console.error(`Invalid conventional commit or PR title: ${message}`);
  console.error("Expected: type(optional-scope): lowercase subject (maximum 72 characters)");
  process.exit(1);
}

console.info(`Valid conventional title: ${message}`);
