import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";
import "dotenv/config";
import { log } from "../utils/console.js";

const getSheetsInstance = () => {
  const auth = new GoogleAuth({
    keyFile: "credentials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
};

export const verify = (emailToVerify, discordUserId) => {
  return new Promise((resolve) => {
    const sheets = getSheetsInstance();

    sheets.spreadsheets.values.get(
      {
        spreadsheetId: process.env.SHEET_ID,
        range:
          process.env.SHEET_NAME + "!" + process.env.SHEET_VERIFICATION_RANGE,
      },
      (err, res) => {
        if (err) {
          log("The API returned an error: " + err);
          resolve(false);
        }
        const rows = res.data.values;
        if (rows.length) {
          // Print columns A and E, which correspond to indices 0 and 4.
          let members = [];
          rows.map((row, i) => {
            // log(`${row[0]}, ${row[1]}`);
            members.push({ email: row[0], discord: row[1], index: i + 1 });
          });

          // members.forEach(member=>log(member));

          log(
            `[Verify] Searching ${members.length} members for ${emailToVerify}...`
          );
          const searchResult = members.find(
            (member) => member.email.toLowerCase() === emailToVerify.toLowerCase()
          );
          log(`[Verify] ${!!searchResult ? "Found" : "Not Found"}`);
          if (!searchResult) resolve(false);

          else if (searchResult.discord === undefined) {
            //Discord tag needs updated
            log("[Verify] Updating sheet...");
            sheets.spreadsheets.values
              .update({
                spreadsheetId: process.env.SHEET_ID,
                valueInputOption: "USER_ENTERED",
                range: `${process.env.SHEET_NAME}!${process.env.SHEET_DISCORD_COLUMN}:${process.env.SHEET_DISCORD_COLUMN}${searchResult.index}`,
                resource: {
                  values: [[discordUserId]],
                },
              })
              .then(() => resolve(true));
          } else {
            log("[Verify] Entry already exists.");
            resolve("EXISTS");
          }
        } else {
          log("[Verify] No data found.");
          resolve(false);
        }
      }
    );
  });
};
