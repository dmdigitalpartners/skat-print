import { spawn } from "child_process";

const server = spawn("npm", ["run", "dev"], {
  stdio: "inherit",
  shell: true,
});

server.on("error", (err) => {
  console.error("Failed to start dev server:", err);
  process.exit(1);
});

process.on("SIGINT", () => {
  server.kill();
  process.exit(0);
});
