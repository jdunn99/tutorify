import { ButtonLink } from "@/components/button";

export default function TutorApplicationSection() {
  return (
    <section className="relative overflow-hidden bg-green-600 py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative">
        <div className="prose mx-auto max-w-lg text-center">
          <h3 className="text-white">Interested in becoming a tutor?</h3>
          <h3 className="text-3xl tracking-tight text-white sm:text-4xl">
            Apply now to start making a difference.
          </h3>
          <p className="text-white text-lg mb-12">
            Whether you&apos;re an experienced educator or a subject matter expert,
            we welcome your application to become a part of our community of
            dedicated tutors..
          </p>
          <ButtonLink href="/auth/tutor" variant="open" size="lg">
            Apply now!
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
