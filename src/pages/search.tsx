import { Button } from "@/components/button";
import { Dropdown, DropdownContent, DropdownItem } from "@/components/dropdown";
import { Footer } from "@/components/footer";
import { Spinner } from "@/components/loading";
import { Navbar } from "@/components/navbar";
import { Search } from "@/components/search";
import { api } from "@/utils/api";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

interface TutorCardProps {
  id: string;
  hourlyRate: number;
  profile: {
    name: string;
    biography: string;
  };
  _count: {
    appointments: number;
  };
}

const STATIC_DATA = [
  {
    id: "clfli4orj0000ij62lfcii7jo",
    hourlyRate: 12,
    profile: {
      name: "Jenny Chen",
      biography: "I am a freelance designer with 5 years of experience",
    },
    _count: {
      appointments: 3,
    },
  },
  {
    id: "clfli4orj0000ij62lfcii7jo",
    hourlyRate: 25,
    profile: {
      name: "Bob Smith",
      biography: "I am a software engineer with a passion for machine learning",
    },
    _count: {
      appointments: 7,
    },
  },
  {
    id: "clfli4orj0000ij62lfcii7jo",
    hourlyRate: 30,
    profile: {
      name: "Sara Williams",
      biography: "I am a writer with a focus on fiction and poetry",
    },
    _count: {
      appointments: 2,
    },
  },
  {
    id: "clfli4orj0000ij62lfcii7jo",
    hourlyRate: 50,
    profile: {
      name: "John Doe",
      biography: "I am a business consultant with 10 years of experience",
    },
    _count: {
      appointments: 5,
    },
  },
  {
    id: "clfli4orj0000ij62lfcii7jo",
    hourlyRate: 20,
    profile: {
      name: "Alex Kim",
      biography:
        "I am a graphic designer specializing in branding and UI design",
    },
    _count: {
      appointments: 0,
    },
  },
  {
    id: "clfli4orj0000ij62lfcii7jo",
    hourlyRate: 15,
    profile: {
      name: "Jane Smith",
      biography:
        "I am a social media marketer with a passion for organic growth",
    },
    _count: {
      appointments: 2,
    },
  },
  {
    id: "clfli4orj0000ij62lfcii7jo",
    hourlyRate: 40,
    profile: {
      name: "Peter Johnson",
      biography:
        "I am a software developer with experience in full-stack web development",
    },
    _count: {
      appointments: 1,
    },
  },
  {
    id: "clfli4orj0000ij62lfcii7jo",
    hourlyRate: 60,
    profile: {
      name: "Emily Lee",
      biography:
        "I am a UX designer with a background in psychology and human-computer interaction",
    },
    _count: {
      appointments: 4,
    },
  },
  {
    id: "clfli4orj0000ij62lfcii7jo",
    hourlyRate: 35,
    profile: {
      name: "Mark Johnson",
      biography:
        "I am a freelance photographer with experience in editorial and commercial photography",
    },
    _count: {
      appointments: 0,
    },
  },
];

function TutorCard(tutor: TutorCardProps) {
  return (
    <div
      className="flex items-center justify-between gap-4 bg-white rounded-lg shadow p-4"
      key={tutor.id}
    >
      <Image
        alt="Profile Image"
        className="rounded-full flex self-start"
        src="https://randomuser.me/api/portraits/men/6.jpg"
        height={64}
        width={64}
      />
      <div className="flex-1 space-y-2">
        <h2 className="text-xl font-semibold text-green-600">
          {tutor.profile.name}
        </h2>
        <p>{tutor._count.appointments} sessions taught</p>
        <p className="text-sm text-slate-600">
          {tutor.profile.biography} Lorem ipsum dolor sit amet, consectetur
          adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam
        </p>
      </div>
      <div className="flex-[0.5] space-y-2">
        <h4>
          <span className="font-bold text-2xl">${tutor.hourlyRate}</span>
          /hour.
        </h4>
        <div className="flex gap-2 ">
          <Button>Book Now</Button>
          <Button variant="open">Profile</Button>
        </div>
      </div>
    </div>
  );
}

interface SortMenuProps {
  onClick(name: string): void;
  active: string;
}

function SortMenu({ active, onClick }: SortMenuProps) {
  return (
    <Dropdown heading={active} variant="base" size="base">
      <DropdownContent align="end" sideOffset={4}>
        <DropdownItem onClick={() => onClick("Suggested")}>
          Suggested
        </DropdownItem>
        <DropdownItem onClick={() => onClick("Rating")}>Rating</DropdownItem>
        <DropdownItem onClick={() => onClick("Lowest Price")}>
          Lowest Price
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}

export default function SearchPage() {
  const router = useRouter();
  const { query: searchQuery } = router;
  const { query } = searchQuery || "";
  const [active, setActive] = React.useState<string>("Suggested");

  const { data: searchResult, isLoading } = api.tutor.getByQuery.useQuery(
    {
      query: query as string,
    },
    { enabled: typeof query === "string" && query.length > 2 }
  );

  return (
    <div className="h-screen overflow-y-hidden bg-slate-50">
      <div className="flex  h-full overflow-y-auto flex-col">
        <Navbar />
        <main>
          <section className="mx-auto items-start flex  max-w-3xl px-4 sm:px-6 lg:px-8 py-24 gap-8">
            <div className="flex-1">
              <span className="text-sm font-semibold ">Subject</span>
              <Search />

              {isLoading ? (
                <div className="grid place-items-center p-8">
                  <Spinner />
                </div>
              ) : typeof searchResult !== "undefined" &&
                typeof query !== "undefined" ? (
                <div className="space-y-8 mt-8">
                  <div className="flex items-center justify-between">
                    <h2 className="font-medium text-slate-800 text-2xl">
                      {searchResult.length}{" "}
                      <span className="text-green-600">{query}</span>{" "}
                      {searchResult.length === 1 ? "tutor" : "tutors"} found.
                    </h2>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-600">
                        Sort:{" "}
                      </p>
                      <SortMenu active={active} onClick={setActive} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {STATIC_DATA.map((tutor) => (
                      <TutorCard {...tutor} key={tutor.id} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
