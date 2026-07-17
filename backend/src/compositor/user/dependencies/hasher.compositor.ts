import ArgonUserHasher from "../../../modules/user/infrastructure/hasher/argon2.infra.js";

export default function userHasherFactory() {
    return new ArgonUserHasher();
}