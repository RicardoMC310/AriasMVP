import DomainException, { CategoryError } from "../../../../core/domain/exception/domain.exception.js"
import { UserState } from "../entity/user.entity.js";

export default class UserCannotTransitionStateException extends DomainException {

    constructor(current: UserState, from: UserState) {
        super(
            "User cannot transition state from " + current as string + " to " + from as string,
            CategoryError.AUTHORIZATION,
            "INVALID_TRANSITION_STATE"
        );
    }

}