import { Spinner } from "@/components/loading";
import { ConversationContainer } from "@/components/profile/conversation";
import {
  MessageHeader,
  MessageInput,
  MessageItem,
} from "@/components/profile/message";
import { Conversation } from "@/server/api/routers/messages";
import { api } from "@/utils/api";
import withAuthHOC, { WithSession } from "@/utils/auth";
import React from "react";
import { ProfileLayout } from ".";

function MessageContainer({
  session,
  conversation,
}: {
  conversation: Conversation;
} & WithSession) {
  const isTutor = React.useMemo(
    () => session.user.role !== "USER",
    [session.user.role]
  );
  const { data: messages, isLoading } =
    api.messages.getMessagesForConversation.useQuery({
      partner: isTutor ? conversation.student.id : conversation.tutor.id,
    });

  return (
    <React.Fragment>
      <MessageHeader
        id={conversation.id}
        isTutor={isTutor}
        name={
          isTutor ? conversation.student.name : conversation.tutor.user.name
        }
      />
      <div className="overflow-auto max-h-full px-6 py-4 flex gap-4 flex-col-reverse">
        {messages ? (
          messages.map((message) => (
            <MessageItem
              {...message}
              key={message.id}
              userId={session.user.id}
            />
          ))
        ) : (
          <div className="grid place-items-center h-full">
            {isLoading ? (
              <Spinner />
            ) : (
              <p>
                No messages for this conversation. Get started by sending a
                message below
              </p>
            )}
          </div>
        )}
      </div>
      <MessageInput
        partner={isTutor ? conversation.student.id : conversation.tutor.user.id}
      />
    </React.Fragment>
  );
}

function Messages({ session }: WithSession) {
  const [selectedConversation, setSelectedConversation] =
    React.useState<Conversation>();
  const { data: conversations, isLoading } =
    api.messages.getConversations.useQuery({});

  const isTutor = React.useMemo(
    () => session.user.role !== "USER",
    [session.user.role]
  );

  return (
    <ProfileLayout session={session} padding={false} footer={false}>
      <div className="flex">
        <div className="h-[calc(100vh-73px)] flex-[0.35] overflow-y-auto bg-slate-200  border-r">
          {typeof conversations !== "undefined" ? (
            conversations.map((conversation) => (
              <ConversationContainer
                key={conversation.id}
                conversation={conversation}
                onClick={setSelectedConversation}
                isActive={selectedConversation?.id === conversation.id}
                isTutor={isTutor}
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
          {typeof selectedConversation !== "undefined" ? (
            <MessageContainer
              conversation={selectedConversation}
              session={session}
            />
          ) : null}
        </div>
      </div>
    </ProfileLayout>
  );
}

export default withAuthHOC(Messages);
