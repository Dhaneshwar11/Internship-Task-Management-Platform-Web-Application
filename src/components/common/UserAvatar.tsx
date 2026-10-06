import React from 'react';

interface UserAvatarProps {
  name: string;
  role?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-7 h-7 text-[11px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
  xl: 'w-14 h-14 text-lg',
};

const getRoleColors = (role?: string) => {
  switch (role) {
    case 'super_admin':
      return 'bg-gradient-to-tr from-rose-900/80 to-slate-900 text-rose-300 border-rose-500/40 ring-1 ring-rose-500/20';
    case 'hr_admin':
      return 'bg-gradient-to-tr from-purple-900/80 to-slate-900 text-purple-300 border-purple-500/40 ring-1 ring-purple-500/20';
    case 'mentor':
      return 'bg-gradient-to-tr from-emerald-900/80 to-slate-900 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/20';
    case 'intern':
    case 'candidate':
      return 'bg-black text-white border-slate-700 ring-1 ring-black/20';
    default:
      return 'bg-gradient-to-tr from-slate-800 to-slate-900 text-slate-200 border-slate-700 ring-1 ring-slate-700/50';
  }
};

const getInitials = (fullName: string): string => {
  if (!fullName) return 'U';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  role,
  size = 'md',
  className = '',
}) => {
  const initials = getInitials(name);
  const colorStyle = getRoleColors(role);

  return (
    <div
      aria-label={name}
      className={`inline-flex items-center justify-center font-bold font-mono rounded-lg border select-none shrink-0 ${sizeClasses[size]} ${colorStyle} ${className}`}
    >
      {initials}
    </div>
  );
};
