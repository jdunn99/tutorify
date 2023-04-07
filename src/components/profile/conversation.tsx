import { Conversation } from "@/server/api/routers/messages";
import { getInitials } from "@/utils/initials";
import React from "react";
import { Avatar } from "../avatar";

export function ConversationContent({
  message,
  tutor,
  student,
  createdAt,
  isTutor,
}: Conversation & { isTutor?: boolean }) {
  const { src, name } = React.useMemo(
    () => ({
      src: isTutor ? student.image : tutor.user.image,
      name: isTutor ? student.name : tutor.user.name,
    }),
    [isTutor, student, tutor]
  );

  return (
    <React.Fragment>
      <Avatar src={src} className="rounded-lg">
        {getInitials(name)}
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center flex-wrap justify-between w-full">
          <h4 className="text-slate-800 font-semibold text-lg">{name}</h4>
          <p className="text-green-600 font-medium text-xs">
            {createdAt.toLocaleString()}
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
    </React.Fragment>
  );
}

const CONVERSATION_CONTAINER_CX =
  "bg-white flex items-center gap-4 p-4 cursor-pointer  border-y hover:border-y hover:border-green-400 hover:bg-green-50";
interface ConversationContainerProps {
  conversation: Conversation;
  onClick(conversation: Conversation): void;
  isActive: boolean;
  isTutor?: boolean;
}
export function ConversationContainer({
  onClick,
  isActive,
  conversation,
  ...rest
}: ConversationContainerProps) {
  return (
    <div
      onClick={() => onClick(conversation)}
      className={`${CONVERSATION_CONTAINER_CX} ${
        isActive ? "border-green-400 !bg-green-50" : "border-slate-200"
      }`}
    >
      <ConversationContent {...conversation} {...rest} />
    </div>
  );
}
