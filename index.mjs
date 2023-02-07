import { configReader } from "./configReader.mjs";
import buildFirefox from "./builder.mjs";
import loginFactorial from "./login.mjs";
import getOpenShift from "./getOpenShift.mjs";
import fileShift from "./fileShift.mjs";
import notification from "./notification.mjs";
import path from "path";
import vacations from "./vacations.mjs";

async function execute(headless, basePath, sleepMS, clock_type) {
  await sleep(sleepMS);
  if (sleepMS > 0) notification(`Action ${clock_type} continues`, "The process is going to resume");

  const user = configReader(path.resolve(basePath, "data.json"));
  const webdriver = await buildFirefox(headless);
  await loginFactorial(webdriver, user);
  const basicData = await getOpenShift(webdriver);
  const hasStartedDay = Object.keys(basicData).length === 0 ? false : true;

  if (clock_type != "clock_in" && !hasStartedDay) {
    console.log(`Can not ${clock_type} if shift has not started`)
    return `Can not ${clock_type} if shift has not started`;
  } else {
    const response = await fileShift(webdriver, clock_type);
    await webdriver.quit();

    console.log(`${clock_type} => ${JSON.stringify(response)}`)
    return `${clock_type} => ${JSON.stringify(response)}`;
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const onVacation = await vacations();
if (onVacation) {
  console.log("Vacation, nothing will be done today");
  notification("Vacation", "Nothing will be done today");
} else {
  let clock_type = "";
  let count = 0;
  if (process.argv.includes("-break_start")) {
    clock_type = "break_start";
    count++;
  } else if (process.argv.includes("-break_end")) {
    clock_type = "break_end";
    count++;
  } else if (process.argv.includes("-clock_in")) {
    clock_type = "clock_in";
    count++;
  } else if (process.argv.includes("-clock_out")) {
    clock_type = "clock_out";
    count++;
  } 

  if (count == 1) {
    notification(`Action ${clock_type}`, "Process has started");

    let executionPath = process.argv[1];
    let time = 0;

    if (process.argv.includes("-p")) {
      const max = 7;
      const min = 3;
      const msToMinMUltiplier = 60000;

      time = Math.floor(Math.random() * (max - min + 1)) + min;

      notification(`Action ${clock_type} random wait`, `The process is going to wait ${time} minutes to start`);

      time *= msToMinMUltiplier;
    }

    const currentDirectory = executionPath.includes(".js")
      ? path.dirname(process.argv[1])
      : executionPath;

    const headless = process.argv.includes("-h");

    execute(headless, currentDirectory, time, clock_type).then((res) => notification(`Action ${clock_type} done`, res));
  } else {
    console.error("Argument error: Please fix the arguments provided");
    console.error("   Usage:");
    console.error("       -break_start, -break_end, -clock_in, -clock_out");
    console.error("           Start/end a break/shift");
    console.error("       -h");
    console.error("           Headless mode");
    console.error("       -p");
    console.error("           Wait a random amount of time between 3 and 7 minutes");
  }
}

