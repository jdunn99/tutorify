import Image from "next/image";

export const AVATAR_SIZES = {
  xs: { width: 24, height: 24 },
  sm: { width: 32, height: 32 },
  base: { width: 40, height: 40 },
  lg: { width: 48, height: 48 },
  xl: { width: 56, height: 56 },
  profile: { width: 96, height: 96 },
};

interface AvatarProps {
  size?: keyof typeof AVATAR_SIZES;
  src?: string | null;
  children?: React.ReactNode;
  className?: string;
}

export function Avatar({
  size = "base",
  src,
  children,
  className = "",
}: AvatarProps) {
  if (src)
    return (
      <Image
        {...AVATAR_SIZES[size]}
        alt="Profile image"
        src={src}
        className={className}
      />
    );

  return (
    <div
      className={`rounded-md bg-green-600 text-center grid place-items-center text-lg font-bold text-white ${className}`}
      style={AVATAR_SIZES[size]}
    >
      {children}
    </div>
  );
}
