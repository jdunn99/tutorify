import { ConversationWithParticipants } from "@/pages/profile/messages";
import { api } from "@/utils/api";
import { WithSession } from "@/utils/auth";
import { useForm } from "@/utils/hooks/useFormReducer";
import { getInitials } from "@/utils/initials";
import { Role } from "@prisma/client";
import React from "react";
import { z } from "zod";
import { Avatar } from "../avatar";
import { Button, ButtonLink } from "../button";
import { TextArea } from "../input";
import { Spinner } from "../loading";

export function MessageHeader({
  name,
  id,
  isTutor,
}: {
  name: string | null;
  id: string;
  isTutor?: boolean;
}) {
  return (
    <div className="w-full border-b items-center flex px-6 py-4 justify-between">
      <h1 className="text-lg text-green-600 font-bold">{name}</h1>
      {!isTutor ? (
        <ButtonLink variant="open" href={`/tutor/${id}`}>
          View Profile
        </ButtonLink>
      ) : null}
    </div>
  );
}

export function MessageItem({
  id,
  sentBy,
  message,
  createdAt,
  student,
  tutor,
  userId,
}: Conversation & { userId: string }) {
  const isSelf = React.useMemo(
    () =>
      (userId === student.id && sentBy === "STUDENT") ||
      (userId === tutor.user.id && sentBy === "TUTOR"),
    [sentBy, student.id, tutor.user.id, userId]
  );

  const avatar = React.useMemo(
    () => ({
      src: sentBy === "STUDENT" ? student.image : tutor.user.image,
      fallback: getInitials(
        sentBy === "STUDENT" ? student.name : tutor.user.name
      ),
    }),
    [sentBy, student, tutor.user]
  );

  return (
    <div
      key={id}
      className={`flex flex-col ${isSelf ? "items-end" : "items-start"} gap-2`}
    >
      <div
        className={`flex items-start gap-2 ${
          isSelf ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <Avatar src={avatar.src}>{avatar.fallback}</Avatar>
        <p className="text-sm font-medium bg-green-200 p-2 rounded-lg text-green-800 max-w-xl">
          {message}
        </p>
      </div>
      <p className="text-xs font-medium text-slate-600">
        {createdAt.toLocaleString()}
      </p>
    </div>
  );
}

const schema = z.object({ message: z.string().min(1).max(255) });

export function MessageInput({ conversationId }: { conversationId: string }) {
  const { state, onChange, validate, reset } = useForm(schema);

  const ctx = api.useContext();
  const { mutateAsync: sendMessage } = api.messages.sendMessage.useMutation({
    onSuccess() {
      void ctx.messages.getMessagesForConversation.invalidate({
        conversationId,
      });
      void ctx.conversation.getConversationsForUser.invalidate();
    },
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { result } = validate();
    if (typeof result === "undefined") return;

    await sendMessage({ message: result.message, conversationId });

    reset();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit(event as any);
    } else if (event.key === "Enter" && event.shiftKey) {
      const textArea = event.target as HTMLTextAreaElement;
      const start = textArea.selectionStart!;
      const end = textArea.selectionEnd!;
      const value = textArea.value;

      textArea.value = value.substring(0, start) + "\n" + value.substring(end);
      textArea.selectionStart = textArea.selectionEnd = start + 1;
      event.preventDefault();
    }
  }

  return (
    <form className="w-full p-8 overflow-hidden rounded-lg" onSubmit={onSubmit}>
      <div className="rounded-lg border overflow-hidden p-1">
        <TextArea
          className="w-full h-[10vh] resize-none !border-none outline-none border-b"
          value={state.message.value as string}
          name={state.message.config.label}
          onChange={onChange}
          onKeyDown={handleKeyDown}
        />
        <div className="flex w-full px-2 pb-2 justify-end">
          <Button size="sm" variant="secondary" type="submit">
            Send now
          </Button>
        </div>
      </div>
    </form>
  );
}

export function MessageContainer({
  conversation,
  session,
}: {
  conversation: ConversationWithParticipants;
} & WithSession) {
  const [partner] = conversation.participants;
  const { id, name } = partner.user;

  const { data: messages, isLoading } =
    api.messages.getMessagesForConversation.useQuery({
      conversationId: conversation.id,
    });

  if (isLoading)
    return (
      <div className="grid h-full place-items-center">
        <Spinner />
      </div>
    );

  return (
    <React.Fragment>
      <div className="w-full border-b items-center flex px-6 py-4 justify-between">
        <h1 className="text-lg text-green-600 font-bold">{name}</h1>
        {session.user.role === "USER" ? (
          <ButtonLink variant="open" href={`/tutor/${id}`}>
            View Profile
          </ButtonLink>
        ) : null}
      </div>

      <div className="overflow-auto max-h-full px-6 py-4 flex gap-4 flex-col-reverse">
        {typeof messages !== "undefined" ? (
          messages.length > 0 ? (
            <div>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col ${
                    session.user.id === message.sentById
                      ? "items-end"
                      : "items-start"
                  } gap-2`}
                >
                  <div
                    className={`flex items-start gap-2 ${
                      session.user.id === message.sentById
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >
                    <Avatar src={message.sentBy.image}>
                      {getInitials(message.sentBy.name)}
                    </Avatar>
                    <p className="text-sm font-medium bg-green-200 p-2 rounded-lg text-green-800 max-w-xl">
                      {message.message}
                    </p>
                  </div>
                  <p className="text-xs font-medium text-slate-600">
                    {message.createdAt.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : null
        ) : null}
      </div>
      <MessageInput conversationId={conversation.id} />
    </React.Fragment>
  );
}
