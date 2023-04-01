import Image from "next/image";
import { MdBookmark } from "react-icons/md";
import { Badge, IconBadge } from "./badge";
import { Button } from "./button";

export function TutorCard() {
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
          <span className="text-sm font-bold text-green-600">1021</span>{" "}
          sessions
        </p>
      </div>
      <div className="flex-1 space-y-2">
        <h2 className="text-xl font-bold text-slate-800">Jamal Williams</h2>
        <p className="text-green-600 font-semibold ">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam
        </p>
        <p className="text-sm text-slate-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam
        </p>
        <div className="flex gap-1 pt-4">
          <Badge variant="primary">Math</Badge>
          <Badge variant="primary">Science</Badge>
          <Badge variant="primary">Calculus</Badge>
          <Badge variant="primary">Pizza</Badge>
        </div>
      </div>
      <div className="space-y-2">
        <h4>
          <span className="font-bold text-2xl">$60</span>
          /hour.
        </h4>
        <div className="flex gap-2">
          <Button>Book Now</Button>
          <Button variant="open">Profile</Button>
        </div>
      </div>
    </div>
  );
}
