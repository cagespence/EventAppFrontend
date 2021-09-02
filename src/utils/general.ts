import { AuthInfo, StorageService } from "src/app/services/storage.service";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { Router } from "@angular/router";

// Checks if the object's keys are not an empty string or null.
export function arePropertiesEmpty(obj) {
  for (var key in obj) {
    if (obj[key] == null || obj[key] == "") return false;
  }
  return true;
}

// Example of ISO 8601 Date format: 1990-02-19T11:02:00+01:00

// Extracts date from ISO 8601 date format
export function extractDate(ISODateFormat: string): string {
  return ISODateFormat.substring(0, 10);
}

// Extracts time from ISO 8601 date format
export function extractTime(ISODateFormat: string): string {
  return ISODateFormat.substring(11, 16);
}

export function getTimeAsNumberOfMinutes(time: any): number {
  var timeParts = time.split(":");

  var timeInMinutes: string = timeParts[0] * 60 + timeParts[1];

  return parseInt(timeInMinutes);
}

export function prettifyTime(time: string): string {
  var timeString = time;
  var H = +timeString.substr(0, 2);
  var h = H % 12 || 12;
  var ampm = H < 12 || H === 24 ? "AM" : "PM";
  if (timeString.substr(2, 3) === ":00") {
    return `${h} ${ampm}`;
  } else {
    return `${h}${timeString.substr(2, 3)} ${ampm}`;
  }
}

export function prettifyDate(date: string): string {
  const splitDate = date.split("-");
  const newDate = new Date(
    parseInt(splitDate[0]),
    parseInt(splitDate[1]) - 1,
    parseInt(splitDate[2])
  );
  const month = newDate.toLocaleString("default", { month: "long" });
  let year = "";

  var currentYear = new Date().getFullYear();

  // if it's not the same year, add on the year to the date.
  if (splitDate[0] !== currentYear.toString()) {
    year = `'${splitDate[0].substring(2, 4)}`; // get last 2 digits of full year
  }

  return `${month.substring(0, 3)} ${splitDate[2]} ${year}`;
}

export function prettifyDateAndTime(dateTime: string): string {
  let date = extractDate(dateTime);
  let time = extractTime(dateTime);
  time = prettifyTime(time);
  date = prettifyDate(date);

  return `${time} ${date}`;
}

export async function isLoggedInUser(id, storage) {
  const authInfo = await storage.getAuthInfo();
  console.log(authInfo.id);
  console.log(id);
  let x = authInfo.id === id;
  console.log(x);
  return authInfo.id === id;
}

export async function goToProfile(id, router, storage) {
  console.log("check logged in");
  if (await isLoggedInUser(id, storage)) {
    console.log("true logged in ");
    router.navigate([`members/tabs/profile`]);
  } else {
    console.log("false logged in ");
    router.navigate([`members/user-profile/${id}`]);
  }
}
