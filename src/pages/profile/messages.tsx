import { Button } from "@/components/button";
import { TextArea } from "@/components/input";
import { Spinner } from "@/components/loading";
import { api } from "@/utils/api";
import withAuthHOC, { WithSession } from "@/utils/auth";
import { Message } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { ProfileLayout } from ".";

interface MessageProps {
  id: string;
  name: string;
  message: string;
  day: Date;
  isActive: boolean;
  onClick: React.Dispatch<React.SetStateAction<string>>;
}

const PREVIEW_STYLE =
  "bg-white flex items-center gap-4 p-4 cursor-pointer  border-y hover:border-y hover:border-green-400 hover:bg-green-50";

interface ConversationProps {
  conversation: Message & {
    tutor: { id: string; user: { name: string; image: string } };
  };
}
export function ConversationContent({ conversation }: ConversationProps) {
  console.log(conversation);
  return (
    <React.Fragment>
      <Image
        alt="Profile Image"
        className="rounded-lg flex self-start"
        src="https://randomuser.me/api/portraits/men/6.jpg"
        height={64}
        width={64}
      />
      <div className="flex-1">
        <div className="flex items-center flex-wrap justify-between w-full">
          <h4 className="text-slate-800 font-semibold text-lg">
            {conversation.tutor.user.name}
          </h4>
          <p className="text-green-600 font-medium text-xs">
            {conversation.createdAt.toLocaleString()}
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
          {conversation.message}
        </p>
      </div>
    </React.Fragment>
  );
}

export function PreviewMessage({
  id,
  name,
  message,
  day,
  isActive,
  onClick,
}: MessageProps) {
  return (
    <div
      onClick={() => onClick(id)}
      className={`${PREVIEW_STYLE} ${
        isActive ? "border-green-400 !bg-green-50" : "border-slate-200"
      }`}
    >
      <Image
        alt="Profile Image"
        className="rounded-lg flex self-start"
        src="https://randomuser.me/api/portraits/men/6.jpg"
        height={64}
        width={64}
      />
      <div className="flex-1">
        <div className="flex items-center flex-wrap justify-between w-full">
          <h4 className="text-slate-800 font-semibold text-lg">{name}</h4>
          <p className="text-green-600 font-medium text-xs">
            {day.toLocaleString()}
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
  const [messageContent, setMessageContent] = React.useState<string>("");
  const { data: previewMessages, isLoading } =
    api.messages.getConversations.useQuery({});
  const ctx = api.useContext();
  const { mutateAsync: sendMessage } = api.messages.sendMessage.useMutation({
    onSuccess() {
      void ctx.messages.getMessagesForConversation.invalidate({
        partner: activeMessage,
      });
      void ctx.messages.getConversations.invalidate();
    },
  });

  const { data: messages } = api.messages.getMessagesForConversation.useQuery(
    { partner: activeMessage },
    { enabled: activeMessage !== "" }
  );

  async function onMessageSent() {
    await sendMessage({ partner: activeMessage, message: messageContent });
    setMessageContent("");
  }

  return (
    <ProfileLayout session={session} padding={false}>
      <div className="flex">
        <div className="h-[calc(100vh-73px)] flex-[0.35] overflow-y-auto bg-slate-200">
          {typeof previewMessages !== "undefined" ? (
            previewMessages.map(({ id, message, tutor, createdAt }) => (
              <PreviewMessage
                key={id}
                isActive={activeMessage === tutor.id}
                id={tutor!.id}
                onClick={setActiveMessage}
                name={tutor!.user.name || ""}
                message={message}
                day={createdAt}
              />
            ))
          ) : isLoading ? (
            <Spinner />
          ) : (
            <p className="text-sm">No messages.</p>
          )}
        </div>
        <div className="flex-1 bg-white border-l">
          {JSON.stringify(messages)}
          <TextArea
            onChange={(e) => setMessageContent(e.target.value)}
            value={messageContent}
          />
          <Button onClick={onMessageSent}>Send</Button>
        </div>
      </div>
    </ProfileLayout>
  );
}

export default withAuthHOC(Messages);
