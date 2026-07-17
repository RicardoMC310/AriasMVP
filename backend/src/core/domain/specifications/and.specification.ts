import Specification from "./specification.specification.js";

export default class AndSpecification<T> implements Specification<T> {

    constructor(
        private readonly left: Specification<T>,
        private readonly right: Specification<T>
    ) {}

    isSatisfiedBy(entity: T): boolean {
        return (
            this.left.isSatisfiedBy(entity)
            &&
            this.right.isSatisfiedBy(entity)
        );
    }

}