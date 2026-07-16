import Specification from "../../../../core/domain/specifications/specification.specification.js";
import UserEntity, { UserState } from "../../../user/domain/entity/user.entity.js";

export default class UserActiveSpecification implements Specification<UserEntity> {

    isSatisfiedBy(entity: UserEntity): boolean {
        return entity.state === UserState.ACTIVE;
    }

}