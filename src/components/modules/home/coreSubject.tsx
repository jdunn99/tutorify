import { BiBook, BiMath } from "react-icons/bi";
import { GoGlobe } from "react-icons/go";
import { MdScience } from "react-icons/md";

interface CoreSubjectProps {
  name?: string;
  heading: string;
  text: string;
  icon?: React.ReactNode;
}

function CoreSubject({ name, heading, text, icon }: CoreSubjectProps) {
  return (
    <div className="relative">
      <div className="text-white p-2 bg-green-500 inline-block text-2xl rounded-lg">
        {icon}
      </div>
      <h3 className="text-sm font-medium text-green-600 mt-2">{name}</h3>
      <p className="text-xl text-slate-900">{heading}</p>
      <p className="text-sm text-slate-600">{text}</p>
    </div>
  );
}

export default function CoreSubjectsSection() {
  return (
    <section className="pt-20 pb-14 sm:pb-20 sm:pt-32 lg:pb-32" id="subjects">
      <div className="prose mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl md:text-center">
          <h1 className="font-semibold">Master the core subjects.</h1>
          <p>
            From building a strong foundation to tackling complex concepts, our
            expert tutors provide personalized support to help you master the
            core subjects.
          </p>
        </div>
        <div className="lg:mt-20 lg:block">
          <div className="grid place-items-center grid-cols-1 sm:grid-cols-2 text-center sm:text-left lg:grid-cols-4 gap-x-8">
            <CoreSubject
              name="Math"
              heading="Math Tutoring for Algebra, Geometry, Calculus, and More."
              text="We cover a wide range of math subjects, including algebra,
                      geometry, calculus, and more."
              icon={<BiMath />}
            />
            <CoreSubject
              name="Science"
              heading="Expert Science Tutoring for Biology, Chemistry, and More."
              text="We provide personalized support for a variety of science subjects, including biology, chemistry, and physics."
              icon={<MdScience />}
            />
            <CoreSubject
              name="Language Arts"
              heading="Personalized Tutoring for Reading, Writing, and More."
              text="Our expert tutors provide support for a variety of language arts subjects, including reading comprehension, writing, grammar, and more."
              icon={<BiBook />}
            />

            <CoreSubject
              name="Social Studies"
              heading="Expert Social Studies Tutoring for History, Geography, and More"
              text="We provide personalized support for a variety of social studies subjects, including history, geography, and government."
              icon={<GoGlobe />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
