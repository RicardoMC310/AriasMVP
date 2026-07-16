import AndSpecification from "./and.specification.js";
import NotSpecification from "./not.specification.js";
import OrSpecification from "./or.specification.js";
import Specification from "./specification.specification.js";

export default abstract class AbstractSpecification<T> implements Specification<T> {

    abstract isSatisfiedBy(entity: T): boolean;

    and(other: Specification<T>): Specification<T> {
        return new AndSpecification(this, other);
    }


    or(other: Specification<T>): Specification<T> {
        return new OrSpecification(this, other);
    }


    not(): Specification<T> {
        return new NotSpecification(this);
    }

}