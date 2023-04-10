import { getInitials } from "@/utils/initials";
import Image from "next/image";
import { MdBookmark } from "react-icons/md";
import { Avatar } from "./avatar";
import { Badge, IconBadge } from "./badge";
import { Button, ButtonLink } from "./button";

interface TutorCardProps {
  id: string;
  headline: string | null;
  biography: string | null;
  hourlyRate: number | null;
  subjects: {
    name: string;
  }[];
  user: {
    id: string;
    name: string | null;
  };
  _count: {
    appointments: number;
  };
  subject: string;
}

export function TutorCard({
  headline,
  biography,
  hourlyRate,
  subjects,
  subject,
  user,
  _count,
}: TutorCardProps) {
  return (
    <div className="flex items-start justify-between gap-4 bg-white border border-slate-200 rounded-lg p-8">
      <div className="flex flex-col mr-2 gap-2">
        <Avatar src={undefined} size="xl">
          {getInitials(user.name)}
        </Avatar>
        <p className="text-xs text-gray-600">
          <span className="text-sm font-bold text-green-600">
            {_count.appointments}
          </span>{" "}
          sessions
        </p>
      </div>
      <div className="flex-1 space-y-2">
        <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
        <p className="text-green-600 font-semibold ">{headline}</p>
        <p
          className="text-sm text-slate-600"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {biography}
        </p>
        <div className="flex gap-1 pt-4">
          {subjects.map(({ name }, index) => (
            <Badge variant="primary" key={index} className="w-[4.25rem] overflow-hidden whitespace-nowrap" >
              {name}
            </Badge>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <h4>
          <span className="font-bold text-2xl">${hourlyRate}</span>
          /hour.
        </h4>
        <div className="flex gap-2 items-center">
          <ButtonLink
            href={`/appointment?tutorId=${user.id}&subject=${subject}`}
          >
            Book 
          </ButtonLink>
          <ButtonLink variant="open" href={`/tutor/${user.id}`}>
            Profile
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
