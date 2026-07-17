export default interface Policy<T> {
    can(subject: T): boolean;
}