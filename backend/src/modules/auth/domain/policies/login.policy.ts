import Policy from "../../../../core/domain/policies/policy.policy.js";
import UserEntity from "../../../user/domain/entity/user.entity.js";
import UserActiveSpecification from "../specifications/user-verified.specification.js";

export default class LoginPolicy implements Policy<UserEntity> {

    constructor(
        private readonly userActiveSpecification: UserActiveSpecification
    ) {}

    can(subject: UserEntity): boolean {
        return this.userActiveSpecification.isSatisfiedBy(subject);
    }

}