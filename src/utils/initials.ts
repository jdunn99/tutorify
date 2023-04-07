export function getInitials(name: string | null): string {
  if(!name) return ""

  const words = name.split(" ");
  let initials = "";

  // Add the first letter of the first word
  if (words.length > 0) initials += words[0][0].toUpperCase();

  // Add the first letter of the last word
  if (words.length > 1) initials += words[words.length - 1][0].toUpperCase();

  return initials;
}
