export type Filter<T, P extends keyof T> = {
  where?: Where<T> | Or<T> | And<T>;
  sort?: Sort<T>;
  limit?: Limit<T, P>;
};

export type And<T> = {
  $and: (Where<T> | Or<T>)[];
};
export type Or<T> = {
  $or: (Where<T> | And<T>)[];
};

export type Where<T> = {
  [K in keyof T]?: Matchers<T[K]>;
};

export type Sort<T> = {
  key: ValidSortKey<T>,
  order: 'asc'|'desc'
};

export type ValidSortKey<T> = {
  [K in keyof T]: T[K] extends ValidSortKeyType ? K : never;
}[keyof T]
export type ValidSortKeyType = number | string | Date | boolean | null | undefined;

export type Limit<T, P extends keyof T> = {
  from?: T[P];
  skip?: number;
  take?: number;
}

export type Matchers<T> = T extends string
  ? StringMatchers<T>
  : T extends number
  ? NumberMatchers<T>
  : T extends (infer R)[]
  ? ArrayMatchers<R>
  : T extends Date
  ? DateMatchers<T>
  : T extends {}
  ? ObjectMatchers<T>
  : GenericMatchers<T>;

export type GenericMatchers<T> = EqMatcher<T> | InMatcher<T>;

export type EqMatcher<T> = T | { $equals: T };
export type InMatcher<T> = { $in: T[] };

export type StringMatchers<T extends string> =
  | GtMatcher<T>
  | GteMatcher<T>
  | LtMatcher<T>
  | LteMatcher<T>
  | BetweenMatcher<T>
  | GenericMatchers<T>;

export type NumberMatchers<T extends number> =
  | GtMatcher<T>
  | GteMatcher<T>
  | LtMatcher<T>
  | LteMatcher<T>
  | BetweenMatcher<T>
  | GenericMatchers<T>;

export type GtMatcher<T> = { $gt: T };
export type GteMatcher<T> = { $gte: T };
export type LtMatcher<T> = { $lt: T };
export type LteMatcher<T> = { $lte: T };
export type BetweenMatcher<T> = { $between: [T, T] };

export type ArrayMatchers<T> = ContainsMatcher<T> | GenericMatchers<T[]>;

export type ContainsMatcher<T> = { $contains: T };

export type ObjectMatchers<T> = SubWhere<T> | GenericMatchers<T>;

export type SubWhere<T> = {
  [K in keyof T]: Matchers<T[K]>;
};

export type DateMatchers<T> =
  | GtMatcher<T>
  | GteMatcher<T>
  | LtMatcher<T>
  | LteMatcher<T>
  | BetweenMatcher<T>
  | GenericMatchers<T>;
