import { Avatar } from "@/components/avatar";
import { Button, ButtonLink } from "@/components/button";
import { TextArea } from "@/components/input";
import { Spinner } from "@/components/loading";
import { api } from "@/utils/api";
import withAuthHOC, { WithSession } from "@/utils/auth";
import { Message } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { ProfileLayout } from ".";

const PREVIEW_STYLE =
  "bg-white flex items-center gap-4 p-4 cursor-pointer  border-y hover:border-y hover:border-green-400 hover:bg-green-50";

export type Conversation = Message & {
  tutor: { id: string; user: { name: string; image: string } };
};
interface ConversationContentProps {
  conversation: Conversation;
}
export function ConversationContent({
  conversation,
}: ConversationContentProps) {
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

interface ConversationProps {
  conversation: Conversation;
  onClick(conversation: Conversation): void;
  isActive: boolean;
}
export function Conversation({
  conversation,
  onClick,
  isActive,
}: ConversationProps) {
  return (
    <div
      onClick={() => onClick(conversation)}
      className={`${PREVIEW_STYLE} ${
        isActive ? "border-green-400 !bg-green-50" : "border-slate-200"
      }`}
    >
      <ConversationContent conversation={conversation} />
    </div>
  );
}

function Messages({ session }: WithSession) {
  const [conversation, setConversation] = React.useState<Conversation>();
  const [messageContent, setMessageContent] = React.useState<string>("");
  const { data: previewMessages, isLoading } =
    api.messages.getConversations.useQuery({});
  const ctx = api.useContext();
  const { mutateAsync: sendMessage } = api.messages.sendMessage.useMutation({
    onSuccess() {
      void ctx.messages.getMessagesForConversation.invalidate({
        partner: conversation!.id,
      });
      void ctx.messages.getConversations.invalidate();
    },
  });

  const { data: messages } = api.messages.getMessagesForConversation.useQuery(
    { partner: conversation ? conversation.tutor.id : "" },
    { enabled: typeof conversation !== "undefined" }
  );

  async function onMessageSent() {
    await sendMessage({
      partner: conversation!.tutor.id,
      message: messageContent,
    });
    setMessageContent("");
  }

  const isSelf = React.useCallback(
    (message: Message) => {
      return (
        (session.user.id === message.studentId &&
          message.sentBy === "STUDENT") ||
        (session.user.id === message.tutorId && message.sentBy === "TUTOR")
      );
    },
    [session.user.id]
  );

  return (
    <ProfileLayout session={session} padding={false} footer={false}>
      <div className="flex">
        <div className="h-[calc(100vh-73px)] flex-[0.35] overflow-y-auto bg-slate-200  border-r">
          {typeof previewMessages !== "undefined" ? (
            previewMessages.map((_conversation) => (
              <Conversation
                key={_conversation.id}
                conversation={_conversation as Conversation}
                onClick={setConversation}
                isActive={conversation?.id === _conversation.id}
              />
            ))
          ) : isLoading ? (
            <Spinner />
          ) : (
            <p className="text-sm">No messages.</p>
          )}
        </div>
        <div
          className="flex-1 grid overflow-hidden h-[calc(100vh-73px)] bg-white"
          style={{ gridTemplateRows: "auto 1fr auto" }}
        >
          {typeof messages !== "undefined" &&
          typeof conversation !== "undefined" ? (
            <React.Fragment>
              <div className="w-full border-b items-center flex px-6 py-4 justify-between">
                <h1 className="text-lg text-green-600 font-bold">
                  {conversation.tutor.user.name}
                </h1>
                {session.user.role === "USER" ? (
                  <ButtonLink
                    variant="open"
                    href={`/tutor/${conversation.tutor.id}`}
                  >
                    View Profile
                  </ButtonLink>
                ) : null}
              </div>
              <div className="overflow-auto max-h-full px-6 py-4 flex gap-4 flex-col-reverse">
                {messages.map((message) => {
                  const self = isSelf(message);
                  return (
                    <div
                      key={message.id}
                      className={`flex flex-col ${
                        self ? "items-end" : ""
                      } gap-2`}
                    >
                      <div
                        className={`flex items-start gap-2 ${
                          self ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <Avatar session={session} />
                        <p className="text-sm font-medium bg-green-200 p-2 rounded-lg text-green-800 max-w-xl">
                          {message.message}
                        </p>
                      </div>
                      <p className="text-xs font-medium text-slate-600">
                        {message.createdAt.toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="px-6 w-full pb-4">
                <TextArea
                  className="w-full py-2 h-[12vh]"
                  onChange={(e) => setMessageContent(e.target.value)}
                  value={messageContent}
                >
                  This is atest
                </TextArea>
                <Button onClick={onMessageSent}>Test</Button>
              </div>
            </React.Fragment>
          ) : null}
          <div className="w-full border-b flex"></div>
        </div>
      </div>
    </ProfileLayout>
  );
}

export default withAuthHOC(Messages);
