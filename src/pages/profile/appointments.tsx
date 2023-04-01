import Calendar from "@/components/calendar";
import withAuthHOC, { WithSession } from "@/utils/auth";
import { ProfileLayout } from ".";

function Dashboard({ session }: WithSession) {
  return (
    <ProfileLayout session={session}>
      <Calendar month={4} year={2023} events={[]}/>
    </ProfileLayout>
  );
}

export default withAuthHOC(Dashboard);
