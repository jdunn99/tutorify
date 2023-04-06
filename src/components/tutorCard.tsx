import Image from "next/image";
import { MdBookmark } from "react-icons/md";
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
        <Image
          alt="Profile Image"
          className="rounded-xl flex self-start"
          src="https://randomuser.me/api/portraits/men/6.jpg"
          height={84}
          width={84}
        />
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
        <p className="text-sm text-slate-600">{biography}</p>
        <div className="flex gap-1 pt-4">
          {subjects.map(({ name }, index) => (
            <Badge variant="primary" key={index}>
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
        <div className="flex gap-2">
          <ButtonLink href={`/appointment?tutorId=${user.id}&subject=${subject}`}>Book Now</ButtonLink>
          <ButtonLink variant="open" href={`/tutor/${user.id}`}>Profile</ButtonLink>
        </div>
      </div>
    </div>
  );
}
