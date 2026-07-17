import Specification from "./specification.specification.js";

export default class NotSpecification<T> implements Specification<T> {

    constructor(
        private readonly specification: Specification<T>
    ) {}

    isSatisfiedBy(entity: T): boolean {
        return !this.specification.isSatisfiedBy(entity);
    }

}