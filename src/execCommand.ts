/* eslint-disable n/prefer-global/process */
import { execSync } from "node:child_process";

const execCommand = (command: string) => {
  try {
    const result = execSync(command);
    return result;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    process.exit(0);
  }
};

export default execCommand;
