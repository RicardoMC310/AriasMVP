import ArgonAuthHasher from "../../../modules/auth/infrastructure/hasher/argon.infra.js";

export default function authArgonHasherFactory() {
    return new ArgonAuthHasher();
}