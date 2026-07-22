// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'email_verification_state.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(EmailVerificationNotifier)
final emailVerificationProvider = EmailVerificationNotifierProvider._();

final class EmailVerificationNotifierProvider
    extends
        $NotifierProvider<EmailVerificationNotifier, EmailVerificationData?> {
  EmailVerificationNotifierProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'emailVerificationProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$emailVerificationNotifierHash();

  @$internal
  @override
  EmailVerificationNotifier create() => EmailVerificationNotifier();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(EmailVerificationData? value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<EmailVerificationData?>(value),
    );
  }
}

String _$emailVerificationNotifierHash() =>
    r'0e59334c60e4e1e4e105ec1ade6e0700727c5282';

abstract class _$EmailVerificationNotifier
    extends $Notifier<EmailVerificationData?> {
  EmailVerificationData? build();
  @$mustCallSuper
  @override
  WhenComplete runBuild() {
    final ref =
        this.ref as $Ref<EmailVerificationData?, EmailVerificationData?>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<EmailVerificationData?, EmailVerificationData?>,
              EmailVerificationData?,
              Object?,
              Object?
            >;
    return element.handleCreate(ref, build);
  }
}
