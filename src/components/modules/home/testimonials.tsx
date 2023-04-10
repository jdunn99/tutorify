import Image from "next/image";

const TESTIMONIALS = [
  {
    name: "Kevin R.",
    text: "Tutorify's math tutor was a game-changer for me. They helped me understand complex concepts and taught me useful study strategies. Thanks to their help, I improved my grades and now have a better understanding of math.",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "Olivia P.",
    text: "I was hesitant to try online tutoring at first, but Tutorify exceeded my expectations. The language arts tutor was friendly, knowledgeable, and helped me improve my writing skills. I'm so glad I gave Tutorify a try!",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    name: "Mark W.",
    text: "I struggled with social studies in school, but Tutorify's tutor made the subject interesting and engaging. They used real-world examples to explain difficult concepts and helped me prepare for exams. I highly recommend their services.",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    name: "Samantha K.",
    text: "Tutorify's science tutor helped me ace my biology exam. They were patient, knowledgeable, and explained concepts in a way that was easy to understand. I'm grateful for their help and would recommend Tutorify to anyone who needs tutoring.",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    name: "Jasmine L.",
    text: "I'm so glad I found Tutorify! The math tutor helped me improve my grades and confidence in the subject. They were patient, kind, and always available to answer my questions. I highly recommend Tutorify to anyone who needs help with math.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    name: "Mike S.",
    text: "Tutorify's online tutoring services are top-notch. The social studies tutor helped me prepare for my history exam and gave me study tips that helped me succeed. I'm impressed with the quality of their services and would recommend them to anyone.",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
  },
];

function Card({
  name,
  text,
  image,
}: {
  name: string;
  text: string;
  image: string;
}) {
  return (
    <div className="relative text-center prose rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10 flex flex-col justify-center items-center">
      <Image
        src={image}
        alt="Image"
        height={72}
        width={72}
        className="rounded-full"
      />
      <h3 className="text-green-600 mt-0">{name}</h3>
      <p className="text-slate-600">{text}</p>
    </div>
  );
}

export default function TestimonialSection() {
  return (
    <section className="bg-slate-50 py-20 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl md:text-center prose">
          <h1 className="text-3xl sm:text-4xl text-slate-900">
            See what our students have to say.
          </h1>
          <p className="text-lg text-slate-600">
            Hear from our satisfied students and discover how Tutorify can help
            you achieve academic success.
          </p>
        </div>
        <ul className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3">
          {TESTIMONIALS.map(({ name, ...rest }, index) => (
            <li key={`${name}-${index}`}>
              <Card name={name} {...rest} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
