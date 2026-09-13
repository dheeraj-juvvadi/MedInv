"use server";

// This function will be called from client components to log SQL commands
export async function logSQLCommand(command: {
  command: string;
  table: string;
  status: "success" | "error";
  error?: string;
}) {
  // In a real app, you might want to log these to a database table
  console.log(`SQL Command: ${command.command}`);
  return command;
}
