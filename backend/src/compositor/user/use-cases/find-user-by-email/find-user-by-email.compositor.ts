import { Kysely } from "kysely";
import { DB } from "../../../../platform/database/db.js";
import FindUserByEmailUseCase from "../../../../modules/user/application/use-cases/find-by-email/find-by-email.use-case.js";
import kyselyUserRespositoryFactory from "../../dependencies/repository.compositor.js";

export default function findUserByEmailUseCaseFactory(db: Kysely<DB>) {
    return new FindUserByEmailUseCase(
        kyselyUserRespositoryFactory(db)
    )
}