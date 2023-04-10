import { NavLink } from "@/components/links";
import { Spinner } from "@/components/loading";
import { ConversationContainer } from "@/components/profile/conversation";
import { MessageContainer } from "@/components/profile/message";
import { UserNameImage } from "@/server/api/routers/user";
import { getServerAuthSession } from "@/server/auth";
import { prisma } from "@/server/prisma";
import { api } from "@/utils/api";
import withAuthHOC, { WithSession } from "@/utils/auth";
import { Conversation } from "@prisma/client";
import Link from "next/link";

import React from "react";
import { ProfileLayout } from ".";

export type ParsedParticipant = { user: UserNameImage };
export type ConversationWithParticipants = Conversation & {
  participants: ParsedParticipant[];
  latestMessage: {
    message: string;
    createdAt: Date;
  } | null;
};
function Messages({ session }: WithSession) {
  const { data: conversations, isLoading } =
    api.conversation.getConversationsForUser.useQuery();

  const [selectedConversation, setSelectedConversation] =
    React.useState<ConversationWithParticipants>();

  const conversationFilteredParticipants = React.useMemo(() => {
    if (typeof conversations === "undefined") return undefined;
    return conversations.map((conversation) => {
      conversation.participants = conversation.participants.filter(
        (participant) => participant.user.id !== session.user.id
      );

      return conversation;
    });
  }, [conversations, session.user.id]);

  return (
    <ProfileLayout session={session} padding={false} footer={false}>
      <div className="flex">
        <div className="h-[calc(100vh-73px)] flex-[0.35] overflow-y-auto bg-slate-200  border-r">
          {typeof conversationFilteredParticipants !== "undefined" ? (
            conversationFilteredParticipants.length > 0 ? (
              conversationFilteredParticipants.map((conversation) => (
                <Link
                  key={conversation.id}
                  href={`/profile/messages?conversation=${conversation.id}`}
                  shallow
                >
                  <ConversationContainer
                    conversation={conversation}
                    onClick={setSelectedConversation}
                    isActive={
                      typeof selectedConversation !== "undefined" &&
                      selectedConversation.id === conversation.id
                    }
                  />
                </Link>
              ))
            ) : (
              <div className="text-center text-slate-600 h-full justify-center flex flex-col p-4">
                <div>
                  No conversations found. To get started, you can find a tutor
                  and book an appointment{" "}
                  <span>
                    <NavLink href="/search" variant="green">
                      here
                    </NavLink>
                  </span>
                </div>
              </div>
            )
          ) : isLoading ? (
            <div className="h-full grid place-items-center">
              <Spinner />
            </div>
          ) : null}
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
