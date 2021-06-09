type Context<Value> = symbol & { __value: Value };

const contexes = {};

export function create_context<Value>(): Context<Value> {
    const ctx = Symbol("context");
    (contexes as any)[ctx] = [];
    return ctx as Context<Value>;
}

export function enter_context<Value, Return>(
    context: Context<Value>,
    value: Value,
    callback: () => Return
): Return {
    (contexes as any)[context].unshift(value);
    try {
        return callback();
    } finally {
        (contexes as any)[context].shift();
    }
}

// Typed as Value for convenience, but return `undefined` if context hasn't been
// entered. It's expected a crash will happen at some later point.
export function use_context<Value>(context: Context<Value>): Value {
    return (contexes as any)[context][0];
}
