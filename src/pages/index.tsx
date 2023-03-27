import React from "react";
import Head from "next/head";
import { getSession, signOut } from "next-auth/react";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { prisma } from "@/server/prisma";
import { Button, ButtonLink } from "@/components/button";
import { useAdminMutation, useAdminQuery } from "@/utils/hooks/useAdminData";
import { z } from "zod";
import { Subject } from "@prisma/client";
import { api } from "@/utils/api";
import { Input } from "@/components/input";
import { Search } from "@/components/search";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { MdCheck, MdScience } from "react-icons/md";
import { BiBook, BiMath } from "react-icons/bi";
import { GoGlobe } from "react-icons/go";
import Image from "next/image";
import { Footer } from "@/components/footer";

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

function HeroSection() {
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

function FirstSection() {
  function Item({ heading, text }: CoreSubjectProps) {
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

function CoreSubjectsSection() {
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

function TutorApplicationSection() {
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
function TestimonialSection() {
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

  return (
    <section className="bg-slate-50 py-20 sm:py-32" >
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

function FaqSection() {
  function Faq({ question, answer }: { question: string; answer: string }) {
    return (
      <div className="relative  prose p-2">
        <h3 className="text-green-600 mt-0">{question}</h3>
        <p className="text-slate-600">{answer}</p>
      </div>
    );
  }

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

export default function Home({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-full flex-col">
        <Navbar />
        <main>
          <HeroSection />
          <FirstSection />
          <CoreSubjectsSection />
          <TutorApplicationSection />
          <TestimonialSection />
          <FaqSection />
        </main>
        <Footer />
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  return {
    props: {
      session: session === null ? undefined : session,
    },
  };
}
