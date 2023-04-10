import { MdCheck } from "react-icons/md";

function Item({ heading, text }: { heading: string; text: string }) {
  return (
    <div className="flex items-center gap-4 p-2">
      <h2 className="m-0 p-0 text-green-500">
        <MdCheck />
      </h2>
      <div>
        <h3 className="text-green-600">{heading}</h3>
        <p className="text-sm text-gray-600">{text}</p>
      </div>
    </div>
  );
}

export default function FirstSection() {
  return (
    <section className="pt-20 pb-14 sm:pb-20 sm:pt-32 lg:pb-32">
      <div className="prose mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl md:text-center">
          <h1 className="font-semibold max-w-2xl  mx-auto text-5xl">
            Online Lessons That Deliver Real-World Results.
          </h1>
          <p className="mt-6 text-lg tracking-tight text-gray-600">
            Learn anytime, anywhere, and achieve your goals with our online
            tutoring services.
          </p>
          <div className="mt-16 md:mt-20 flex items-center lg:pt-0">
            <div className="flex flex-col text-left">
              <Item
                heading="Personalized One-On-One Tutoring"
                text="Get the individualized attention you need to improve yourskills and achieve your goals, no matter where you are in the world."
              />
              <Item
                heading="Flexibile and Convenient Scheduling"
                text="Schedule online tutoring sessions at a time that works for
                    you, whether it's early in the morning or late at night."
              />
              <Item
                heading="Proven Results"
                text=" Our expert tutors have helped countless students achieve
                    their academic goals and succeed in the real world."
              />
            </div>
            <div className="flex-1">HI</div>
          </div>
        </div>
      </div>
    </section>
  );
}
