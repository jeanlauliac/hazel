import chalk = require("chalk");

export function log(message: string) {
    console.log(
        `${chalk.dim("[" + new Date().toLocaleTimeString() + "]")} ` +
            `${message}`
    );
}
