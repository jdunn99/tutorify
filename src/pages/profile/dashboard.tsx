import { Navbar } from "@/components/navbar";
import { GetServerSidePropsContext } from "next";

export default function Dashboard() {
  return (
    <div className="h-screen overflow-y-hidden bg-slate-50">
      <div className="flex  h-full overflow-y-auto flex-col">
        <Navbar />
        <main>
          <section className="mx-auto items-start flex  max-w-5xl px-4 sm:px-6 lg:px-8 py-24 gap-8">
            <p>Test</p>
          </section>
        </main>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return { props: {} };
}
