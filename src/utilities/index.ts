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
