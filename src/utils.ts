export type Predicate<T> = (val: T) => boolean;
export type SolverFunction = (val: string) => string[];

export interface SolverDescription {
    readonly name: string;
    readonly description?: string;
    readonly examples?: string[];
    fun: SolverFunction;
    inputValidator: Predicate<string>;
}

export interface Solver {
    (code: string): string[];
    readonly biosName: string;
    readonly examples?: string[];
    readonly description?: string;
    validator(code: string): boolean;
    cleaner(code: string): string;
    keygen(code: string): string[];
}

const keyboardDict: {[key: number]: string} = {
    2: "1",  3: "2",  4: "3",  5: "4",  6: "5",  7: "6",  8: "7",  9: "8",
    10: "9", 11: "0", 16: "q", 17: "w", 18: "e", 19: "r", 20: "t", 21: "y",
    22: "u", 23: "i", 24: "o", 25: "p", 30: "a", 31: "s", 32: "d", 33: "f",
    34: "g", 35: "h", 36: "j", 37: "k", 38: "l", 44: "z", 45: "x", 46: "c",
    47: "v", 48: "b", 49: "n", 50: "m"
};

/* Decode Keyboard code to Ascii symbol */
export function keyboardEncToAscii(inKey: number[]): string {
    let out = "";
    for (let key of inKey) {
        if (key === 0) {
            return out;
        }

        if (key in keyboardDict) {
            out += keyboardDict[key];
        } else {
            return "";
        }
    }
    return out;
}

function cleanSerial(serial: string): string {
    return serial.trim().replace(/-/gi, "");
}

export function makeSolver(description: SolverDescription): Solver {

    let solver: any = (code: string) => {
        let cleanCode = cleanSerial(code);
        if (description.inputValidator(cleanCode)) {
            return description.fun(cleanCode);
        } else {
            return [];
        }
    };

    solver.biosName = description.name;
    solver.validator = description.inputValidator;
    solver.cleaner = cleanSerial;
    solver.keygen = description.fun;

    if (description.examples) {
        solver.examples = description.examples;
    }

    if (description.description) {
        solver.description = description.description;
    }

    return solver as Solver;
}
