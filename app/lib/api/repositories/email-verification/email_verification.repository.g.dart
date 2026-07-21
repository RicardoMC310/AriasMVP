// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'email_verification.repository.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(userRepository)
final userRepositoryProvider = UserRepositoryProvider._();

final class UserRepositoryProvider
    extends
        $FunctionalProvider<
          AsyncValue<EmailVerificationRepository>,
          EmailVerificationRepository,
          FutureOr<EmailVerificationRepository>
        >
    with
        $FutureModifier<EmailVerificationRepository>,
        $FutureProvider<EmailVerificationRepository> {
  UserRepositoryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'userRepositoryProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$userRepositoryHash();

  @$internal
  @override
  $FutureProviderElement<EmailVerificationRepository> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<EmailVerificationRepository> create(Ref ref) {
    return userRepository(ref);
  }
}

String _$userRepositoryHash() => r'dbac5ff295ddb5ba948cd9408335660ce6d50803';
