// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'email_verification.repository.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(emailVerificationRepository)
final emailVerificationRepositoryProvider =
    EmailVerificationRepositoryProvider._();

final class EmailVerificationRepositoryProvider
    extends
        $FunctionalProvider<
          AsyncValue<EmailVerificationRepository>,
          EmailVerificationRepository,
          FutureOr<EmailVerificationRepository>
        >
    with
        $FutureModifier<EmailVerificationRepository>,
        $FutureProvider<EmailVerificationRepository> {
  EmailVerificationRepositoryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'emailVerificationRepositoryProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$emailVerificationRepositoryHash();

  @$internal
  @override
  $FutureProviderElement<EmailVerificationRepository> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<EmailVerificationRepository> create(Ref ref) {
    return emailVerificationRepository(ref);
  }
}

String _$emailVerificationRepositoryHash() =>
    r'4dd981af3a2002ab8bfa6da483d76fefcf89d3ca';
