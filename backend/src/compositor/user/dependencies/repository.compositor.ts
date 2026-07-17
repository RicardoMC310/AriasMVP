import { Kysely } from "kysely";
import { DB } from "../../../platform/database/db.js";
import KyselyUserRepository from "../../../modules/user/infrastructure/database/kysely.infra.js";

export default function kyselyUserRespositoryFactory(db: Kysely<DB>) {
    return new KyselyUserRepository(db);
}