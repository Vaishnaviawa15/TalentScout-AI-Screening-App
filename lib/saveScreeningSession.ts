import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "screening_sessions.json");

export function saveScreeningSession(sessionData: any) {
  const fileData = fs.readFileSync(filePath, "utf-8");
  const sessions = JSON.parse(fileData);

  sessions.push(sessionData);

  fs.writeFileSync(filePath, JSON.stringify(sessions, null, 2));
}
