// scripts/seed-staff.ts
import bcrypt from "bcryptjs";
import { executeQuery, pool } from "../lib/mysql.js"; // Use relative path for script execution

const SALT_ROUNDS = 10; // Standard salt rounds for bcrypt

async function seedAdminUser() {
  const username = "admin";
  const plainPassword = "password123"; // Use a strong password in production!
  // const role = 'Administrator'; // Column does not exist
  const employeeId = 1; // Using user-provided employee ID
  // const employeeName = 'Admin User'; // Column does not exist

  try {
    console.log(
      `Checking if staff account for employee_id ${employeeId} exists...`,
    );
    const existingAccount = await executeQuery<any[]>(
      "SELECT username FROM StaffAccount WHERE employee_id = ?",
      [employeeId],
    );

    console.log(`Hashing password for user '${username}'...`);
    const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    console.log("Password hashed successfully.");

    if (existingAccount.length > 0) {
      // Account exists for this employee_id, update it
      console.log(
        `Account found for employee_id ${employeeId}. Updating username to '${username}' and setting password...`,
      );
      const updateQuery = `
        UPDATE StaffAccount
        SET username = ?, password = ?
        WHERE employee_id = ?
      `;
      const updateParams = [username, hashedPassword, employeeId];
      const updateResult = await executeQuery<any>(updateQuery, updateParams);

      if (updateResult.affectedRows > 0) {
        console.log(
          `Successfully updated account for employee ID ${employeeId} to username '${username}'.`,
        );
      } else {
        // This might happen if the username was already 'admin' but password needed update,
        // or if the update somehow failed. Let's check if the username 'admin' exists now.
        const checkAdminUser = await executeQuery<any[]>(
          "SELECT username FROM StaffAccount WHERE username = ? AND employee_id = ?",
          [username, employeeId],
        );
        if (checkAdminUser.length > 0) {
          console.log(
            `Account for employee ID ${employeeId} likely already had username '${username}'. Password updated.`,
          );
        } else {
          console.error(
            `Failed to update account for employee ID ${employeeId}.`,
          );
        }
      }
    } else {
      // No account exists for this employee_id, attempt to insert
      // This might still fail if employee_id 1 doesn't exist in the parent Employee table
      console.log(
        `No account found for employee_id ${employeeId}. Attempting to insert new account for username '${username}'...`,
      );
      const insertQuery = `
        INSERT INTO StaffAccount (username, password, employee_id)
        VALUES (?, ?, ?)
      `;
      const insertParams = [username, hashedPassword, employeeId];
      const insertResult = await executeQuery<any>(insertQuery, insertParams);

      if (insertResult.affectedRows > 0) {
        console.log(
          `Successfully inserted user '${username}' with employee ID ${employeeId}.`,
        );
      } else {
        console.error(`Failed to insert user '${username}'.`);
      }
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
    process.exitCode = 1;
  } finally {
    if (pool) {
      await pool.end();
      console.log("Database connection pool closed.");
    }
  }
}

// Run the seeding function
seedAdminUser();
