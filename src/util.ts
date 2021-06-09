export function assert(cond: boolean): asserts cond {
    if (!cond) throw new AssertFailedError("assert failed");
}

class AssertFailedError extends Error {}

export function exhaustive(cond: never): any {
    throw new Error("failed exhaustive condition: " + JSON.stringify(cond));
}

export function get<T>(obj: { [key: string]: T }, key: string): T | undefined {
    if (!obj.hasOwnProperty(key)) return undefined;
    return obj[key];
}
