import withAuthHOC, { WithSession } from "@/utils/auth";
import Image from "next/image";
import React from "react";
import { ProfileLayout } from ".";

interface Message {
  id: string;
  name: string;
  message: string;
  day: Date;
  isActive: boolean;
  onClick: React.Dispatch<React.SetStateAction<string>>;
}

const PREVIEW_STYLE =
  "bg-white flex items-center gap-4 p-4 cursor-pointer hover:shadow-lg  border-y hover:border-y hover:border-green-400 border-r";

export function PreviewMessage({
  id,
  name,
  message,
  day,
  isActive,
  onClick,
}: Message) {
  return (
    <div
      onClick={() => onClick(id)}
      className={`${PREVIEW_STYLE} ${
        isActive ? "border-green-400 shadow-lg bg-green-50" : "border-slate-200"
      }`}
    >
      <Image
        alt="Profile Image"
        className="rounded-lg flex self-start"
        src="https://randomuser.me/api/portraits/men/6.jpg"
        height={64}
        width={64}
      />
      <div>
        <div className="flex items-center flex-wrap justify-between">
          <h4 className="text-slate-800 font-semibold text-lg">{name}</h4>
          <p className="text-green-600 font-medium text-xs">
            {day.toLocaleDateString()}
          </p>
        </div>
        <p
          className="text-slate-500 block font-medium text-xs"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}

function Messages({ session }: WithSession) {
  const [activeMessage, setActiveMessage] = React.useState<string>("");

  return (
    <ProfileLayout session={session} padding={false}>
      <div className="flex">
        <div className="h-[calc(100vh-73px)] flex-[0.35] overflow-y-auto bg-slate-200">
          <PreviewMessage
            isActive={activeMessage === "1"}
            id="1"
            onClick={setActiveMessage}
            name="John Jones"
            message="Welcome to my applicaiton. I have waited for 30 years to get you in."
            day={new Date()}
          />
        </div>
        <div className="flex-1 bg-white border-l"></div>
      </div>
    </ProfileLayout>
  );
}

export default withAuthHOC(Messages);
