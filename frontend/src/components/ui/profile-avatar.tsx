import { cn } from '@/lib/utils';

interface ProfileAvatarProps {
  profileImage?: string | null;
  name?: string | null;
  className?: string;
}

export function ProfileAvatar({
  profileImage,
  name,
  className,
}: ProfileAvatarProps) {
  return profileImage ? (
    <img
      src={profileImage}
      alt={name || 'profile-img'}
      className={cn(
        'aspect-square w-full rounded-lg bg-accent object-cover',
        className
      )}
    />
  ) : (
    <div
      className={cn('aspect-square w-full rounded-lg bg-accent', className)}
    ></div>
  );
}
