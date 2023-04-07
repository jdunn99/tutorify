import { WithSession } from "@/utils/auth";
import Image from "next/image";

interface AvatarProps {
  width?: number;
  height?: number;
  className?: string;
}

function getInitials(name: string): string {
  const words = name.split(" ");
  let initials = "";

  // Add the first letter of the first word
  if (words.length > 0) initials += words[0][0].toUpperCase();

  // Add the first letter of the last word
  if (words.length > 1) initials += words[words.length - 1][0].toUpperCase();

  return initials;
}

export function Avatar({ className, session }: AvatarProps & WithSession) {
  if (typeof session.user.image === "undefined" || session.user.image === null)
    return (
      <div
        className={`rounded-md bg-green-600 p-1 text-lg font-bold text-white ${className}`}
      >
        {typeof session.user.name === "undefined" ||
        session.user.name === null ? null : (
          <h1>{getInitials(session.user.name)}</h1>
        )}
      </div>
    );

  return <Image height={32} width={32} src={session.user.image} alt="Avatar" />;
}
