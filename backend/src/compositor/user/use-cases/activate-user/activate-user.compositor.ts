import { Kysely } from "kysely";
import { DB } from "../../../../platform/database/db.js";
import ActivateUserUseCase from "../../../../modules/user/application/use-cases/activete-user/activate-user.use-case.js";
import kyselyUserRespositoryFactory from "../../dependencies/repository.compositor.js";

export default function activateUserUseCaseFactory(db: Kysely<DB>) {
    const useCase = new ActivateUserUseCase(
        kyselyUserRespositoryFactory(db)
    );

    return useCase;
}