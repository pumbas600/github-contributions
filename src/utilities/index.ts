export function toEntries<ObjectType extends object, Keys extends keyof ObjectType>(
    obj: ObjectType,
): [Keys, ObjectType[Keys]][] {
    return Object.entries(obj) as [Keys, ObjectType[Keys]][];
}

export function fromEntries<ObjectType extends object>(
    entries: [keyof ObjectType, ObjectType[keyof ObjectType]][],
): ObjectType {
    return Object.fromEntries(entries) as ObjectType;
}

export function required<T>(value: T | undefined, valueName: string): T {
    if (value === undefined) {
        throw new Error(`${valueName} is required but was undefined`);
    }

    return value;
}
