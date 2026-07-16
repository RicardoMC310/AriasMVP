export default interface Specification<T> {
    isSatisfiedBy(entity: T): boolean;
}