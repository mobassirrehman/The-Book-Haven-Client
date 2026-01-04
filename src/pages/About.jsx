import { useEffect, useRef } from "react";
import { Link } from "react-router";
import useTitle from "../hooks/useTitle";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  IoBookSharp,
  IoHeart,
  IoPeople,
  IoShield,
  IoSparkles,
} from "react-icons/io5";
import { FaBookReader, FaGlobe, FaLightbulb } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useTitle("About Us");

  const heroRef = useRef(null);
  const missionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });

      gsap.from(missionRef.current, {
        scrollTrigger: {
          trigger: missionRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  const values = [
    {
      icon: <IoHeart className="text-2xl" />,
      title: "Passion for Reading",
      description:
        "We believe in the transformative power of books and are dedicated to fostering a love of reading in everyone.",
    },
    {
      icon: <IoPeople className="text-2xl" />,
      title: "Community First",
      description:
        "Our platform is built around connecting readers, sharing discoveries, and building meaningful relationships.",
    },
    {
      icon: <IoSparkles className="text-2xl" />,
      title: "Quality Content",
      description:
        "We curate and maintain a high-quality collection that spans genres, cultures, and perspectives.",
    },
    {
      icon: <IoShield className="text-2xl" />,
      title: "Trust & Privacy",
      description:
        "Your data and reading habits are yours. We prioritize security and never share your information.",
    },
    {
      icon: <FaLightbulb className="text-2xl" />,
      title: "Innovation",
      description:
        "We continuously improve our platform with new features to enhance your reading experience.",
    },
    {
      icon: <FaGlobe className="text-2xl" />,
      title: "Accessibility",
      description:
        "Books should be accessible to everyone. We're committed to making reading inclusive for all.",
    },
  ];

  const team = [
    {
      name: "Sarah Mitchell",
      role: "Founder & CEO",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      bio: "Former librarian with a vision to digitize the reading experience.",
    },
    {
      name: "James Parker",
      role: "Head of Technology",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "Tech enthusiast building the future of digital libraries.",
    },
    {
      name: "Emily Chen",
      role: "Community Manager",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      bio: "Connecting readers and fostering meaningful discussions.",
    },
    {
      name: "Michael Rodriguez",
      role: "Content Curator",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      bio: "Discovering hidden literary gems for our community.",
    },
  ];

  const milestones = [
    { number: "2023", label: "Founded" },
    { number: "5000+", label: "Books" },
    { number: "2500+", label: "Members" },
    { number: "12000+", label: "Reviews" },
  ];

  return (
    <div className="overflow-x-hidden">
      <section className="section section-dark py-20 md:py-28">
        <div className="container-custom">
          <div ref={heroRef} className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--color-accent)" }}
              >
                <IoBookSharp
                  className="text-4xl"
                  style={{ color: "var(--color-secondary)" }}
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              About The Book Haven
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              We're on a mission to create the world's most welcoming digital
              library, where every reader can discover, share, and celebrate the
              joy of books.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-custom">
          <div
            ref={missionRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2
                className="text-3xl md:text-4xl font-bold mb-6"
                style={{ color: "var(--color-text-primary)" }}
              >
                Our Mission
              </h2>
              <p
                className="text-lg mb-6 leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                The Book Haven was born from a simple belief: that everyone
                deserves access to a world of stories, knowledge, and
                imagination. In an age of digital distraction, we're creating a
                sanctuary for readers.
              </p>
              <p
                className="text-lg mb-8 leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Our platform combines the warmth of a traditional library with
                the convenience of modern technology, making it easier than ever
                to track your reading journey, discover new favorites, and
                connect with fellow book lovers.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="text-center p-4 rounded-xl"
                    style={{ background: "var(--color-bg-secondary)" }}
                  >
                    <div
                      className="text-3xl md:text-4xl font-bold mb-1"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {milestone.number}
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {milestone.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img
                src="https://i.ibb.co.com/tMJjcTGN/happy-reader.avif"
                alt="Reading community"
                className="rounded-2xl shadow-xl w-full object-cover h-[500px]"
              />
              <div
                className="absolute -bottom-6 -left-6 p-6 rounded-xl shadow-lg"
                style={{
                  background: "var(--color-bg-card)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "var(--color-primary)" }}
                  >
                    <FaBookReader className="text-xl text-white" />
                  </div>
                  <div>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      98%
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Reader Satisfaction
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container-custom">
          <h2 className="section-title">Our Values</h2>
          <p className="section-subtitle">
            The principles that guide everything we do
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: "var(--color-bg-card)",
                  borderColor: "var(--color-border)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(44, 120, 115, 0.1)" }}
                >
                  <span style={{ color: "var(--color-primary)" }}>
                    {value.icon}
                  </span>
                </div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {value.title}
                </h3>
                <p style={{ color: "var(--color-text-secondary)" }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-custom">
          <h2 className="section-title">Meet Our Team</h2>
          <p className="section-subtitle">
            The passionate people behind The Book Haven
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl border hover:shadow-lg transition-all duration-300"
                style={{
                  background: "var(--color-bg-card)",
                  borderColor: "var(--color-border)",
                }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  style={{
                    borderWidth: "4px",
                    borderStyle: "solid",
                    borderColor: "var(--color-bg-secondary)",
                  }}
                />
                <h3
                  className="text-lg font-bold mb-1"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {member.name}
                </h3>
                <p
                  className="text-sm font-medium mb-3"
                  style={{ color: "var(--color-primary)" }}
                >
                  {member.role}
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-gradient">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Our Reading Community
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Become part of a growing community of book lovers. Start your
            reading journey with us today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <button className="btn-banner flex items-center gap-2">
                Get Started Free <BsArrowRight />
              </button>
            </Link>
            <Link to="/all-books">
              <button className="btn-banner-outline">Explore Books</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
