import { authOptions } from "@/server/auth";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

export default function TutorRegister() {
  return <></>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  return {
    props: {},
  };
}
