import Specification from "./specification.specification.js";

export default class OrSpecification<T> implements Specification<T> {

    constructor(
        private readonly left: Specification<T>,
        private readonly right: Specification<T>
    ) {}

    isSatisfiedBy(entity: T): boolean {
        return (
            this.left.isSatisfiedBy(entity)
            ||
            this.right.isSatisfiedBy(entity)
        );
    }

}
