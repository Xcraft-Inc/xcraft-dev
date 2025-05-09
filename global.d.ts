type falsy = false | 0 | '' | null | undefined | 0n;

type Truthy<T> = Exclude<T, falsy>;

interface Array<T> {
  filter(predicate: BooleanConstructor, thisArg?: any): Truthy<T>[];
}

interface ReadonlyArray<T> {
  filter(predicate: BooleanConstructor, thisArg?: any): Truthy<T>[];
}

interface String {
  startsWith<T extends string>(searchString: T, position?: number): this is `${T}${string}`;
}
