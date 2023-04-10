const FAQS = [
  {
    question: "What subjects do you offer tutoring services for?",
    answer:
      "We offer tutoring services for a variety of subjects including math, science, language arts, and social studies.",
  },
  {
    question: "How are your tutors qualified?",
    answer:
      "All of our tutors are highly qualified and have years of experience in their respective fields. We carefully vet and screen each tutor before they are allowed to join our platform.",
  },
  {
    question: "How do I schedule a tutoring session?",
    answer:
      "Scheduling a tutoring session is easy! Simply log in to your account, select the subject you need help with, and choose a tutor that fits your needs. You can then schedule a session directly with the tutor.",
  },
  {
    question: "How do I pay for tutoring services?",
    answer:
      "We accept payment via credit card or PayPal. You can securely store your payment information on our platform for easy access.",
  },
  {
    question: "Can I choose my own tutor?",
    answer:
      "Yes! We want you to feel comfortable with your tutor, so you can choose the tutor that best fits your needs based on their qualifications, availability, and user reviews.",
  },
  {
    question: "How long are tutoring sessions?",
    answer:
      "Tutoring sessions can be as short as 30 minutes or as long as 2 hours, depending on your needs and the tutor's availability. You can work with your tutor to determine the best session length for you.",
  },
  {
    question: "Can I cancel a tutoring session?",
    answer:
      "Yes, you can cancel a tutoring session up to 24 hours before the scheduled start time. If you cancel within 24 hours, you may be charged a cancellation fee.",
  },
  {
    question: "Do you offer group tutoring sessions?",
    answer:
      "Yes, we offer group tutoring sessions for up to 4 students. This can be a cost-effective way to get tutoring help for a group of friends or classmates.",
  },
  {
    question: "How do I access the online tutoring platform?",
    answer:
      "Our online tutoring platform can be accessed through any web browser on your computer or mobile device. Simply log in to your account to start a tutoring session.",
  },
];

function Faq({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="relative  prose p-2">
      <h3 className="text-green-600 mt-0">{question}</h3>
      <p className="text-slate-600">{answer}</p>
    </div>
  );
}

export default function FaqSection() {
  return (
    <section className="bg-slate-50 py-20 ">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className=" max-w-2xl  prose">
          <h1 className="text-3xl sm:text-4xl text-slate-900">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-600">
            If you can&apos;t find what you&apos;re looking for, email our
            support team and we&apos;ll be glad to get back to you.
          </p>
        </div>
        <ul className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-4 sm:gap-6 lg:mt-20 lg:max-w-none md:grid-cols-2 lg:grid-cols-3">
          {FAQS.map((faq, index) => (
            <li key={index}>
              <Faq {...faq} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
