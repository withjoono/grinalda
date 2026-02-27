'use client';

import { Separator } from '@/components/ui/separator';
import { ProfileForm } from './_components/profile-form';
import { useMyTermsAgreement } from '@/apis/hooks/use-users';
import { useMyProfile } from '@/apis/hooks/use-users';
import { ErrorSection } from '@/components/status/error-section';
import { LoadingSection } from '@/components/status/loading-section';

export default function SettingsProfilePage() {
  const {
    data: profile,
    isPending: isProfilePending,
    isError: isProfileError,
    refetch: refetchProfile,
  } = useMyProfile();
  const {
    data: termsAgreement,
    isPending: isTermsAgreementPending,
    isError: isTermsAgreementError,
    refetch: refetchTermsAgreement,
  } = useMyTermsAgreement();

  if (isProfilePending) return <LoadingSection />;
  if (isProfileError) return <ErrorSection onRetry={refetchProfile} />;

  if (isTermsAgreementPending) return <LoadingSection />;
  if (isTermsAgreementError)
    return <ErrorSection onRetry={refetchTermsAgreement} />;

  return (
    <div className='space-y-6 lg:max-w-3xl'>
      <div>
        <h3 className='text-lg font-medium'>프로필 관리</h3>
        <p className='text-sm text-muted-foreground'>
          학생 프로필을 관리합니다.
        </p>
      </div>
      <Separator />
      <ProfileForm profile={profile} termsAgreement={termsAgreement} />
    </div>
  );
}
