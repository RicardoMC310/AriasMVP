import AbstractSpecification from "../../../../core/domain/specifications/abstract.specification.js";
import UserEntity, { UserState } from "../../../user/domain/entity/user.entity.js";

export default class UserActiveSpecification extends AbstractSpecification<UserEntity> {

    override isSatisfiedBy(entity: UserEntity): boolean {
        return entity.state === UserState.ACTIVE;
    }

}