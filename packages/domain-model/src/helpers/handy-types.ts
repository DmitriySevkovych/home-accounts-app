type UnionToIntersection<U> = (
    U extends any ? (_k: U) => void : never
) extends (_k: infer I) => void
    ? I
    : never
export type PickAndFlatten<T, K extends keyof T> = UnionToIntersection<T[K]>

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<T>

export type FileWithPath = File & { path?: string }
