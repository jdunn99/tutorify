import { Search } from "@/components/search";

export default function HeroSection() {
  return (
    <section className="mx-auto prose max-w-5xl px-4 sm:px-6 lg:px-8 py-24 text-center">
      <h1 className="mx-auto text-6xl max-w-4xl">
        Get expert <span className="text-green-500">online tutoring</span> in
        any subject
      </h1>
      <p className="text-slate-600 mx-auto max-w-2xl">
        Experience the power of personalized learning with our online tutoring
        services, which are designed to provide you with the tools, resources,
        and support you need to achieve your academic and personal goals.
      </p>
      <div className="mt-10 flex flex-col text-left justify-center gap-2 max-w-lg mx-auto">
        <span className="text-sm text-green-600">
          What do you want to learn?
        </span>
        <Search />
      </div>
      <div className="mt-36 lg:mt-44"></div>
    </section>
  );
}
