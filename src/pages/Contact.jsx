import { useState, useEffect, useRef } from "react";
import useTitle from "../hooks/useTitle";
import toast from "react-hot-toast";
import gsap from "gsap";
import {
  IoLocationSharp,
  IoMail,
  IoCall,
  IoTime,
  IoSend,
  IoLogoTwitter,
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoLinkedin,
} from "react-icons/io5";
import {
  FaQuestionCircle,
  FaBug,
  FaHandshake,
  FaComments,
} from "react-icons/fa";

const Contact = () => {
  useTitle("Contact Us");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const heroRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });

      gsap.from(formRef.current, {
        x: -50,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "power3.out",
      });

      gsap.from(infoRef.current, {
        x: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: <IoMail />,
      title: "Email Us",
      content: "info@bookhaven.com",
      subtext: "We reply within 24 hours",
    },
    {
      icon: <IoCall />,
      title: "Call Us",
      content: "+0 (160) 170-0902",
      subtext: "Mon-Fri, 9am-6pm EST",
    },
    {
      icon: <IoLocationSharp />,
      title: "Visit Us",
      content: "123 Book Street",
      subtext: "Philadelphia, PA 19103",
    },
    {
      icon: <IoTime />,
      title: "Business Hours",
      content: "Mon - Fri: 9am - 6pm",
      subtext: "Sat: 10am - 4pm",
    },
  ];

  const categories = [
    { value: "general", label: "General Inquiry", icon: <FaQuestionCircle /> },
    { value: "support", label: "Technical Support", icon: <FaBug /> },
    { value: "partnership", label: "Partnership", icon: <FaHandshake /> },
    { value: "feedback", label: "Feedback", icon: <FaComments /> },
  ];

  const socialLinks = [
    { icon: <IoLogoTwitter />, url: "#", name: "Twitter" },
    { icon: <IoLogoFacebook />, url: "#", name: "Facebook" },
    { icon: <IoLogoInstagram />, url: "#", name: "Instagram" },
    { icon: <IoLogoLinkedin />, url: "#", name: "LinkedIn" },
  ];

  return (
    <div className="overflow-x-hidden">
      <section className="section section-dark py-20 md:py-28">
        <div className="container-custom">
          <div ref={heroRef} className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              Have questions, suggestions, or just want to say hello? We'd love
              to hear from you. Our team is here to help.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            <div ref={formRef} className="lg:col-span-3">
              <div className="bg-[var(--color-bg-card)] rounded-2xl p-8 border border-[var(--color-border)] shadow-lg">
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                  Send Us a Message
                </h2>
                <p className="text-[var(--color-text-secondary)] mb-8">
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label className="form-label">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="select-input"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Your Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      className="textarea-input"
                      rows="5"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-submit flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <IoSend />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div ref={infoRef} className="lg:col-span-2 space-y-6">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-5 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl text-[var(--color-primary)]">
                      {info.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                      {info.title}
                    </h3>
                    <p className="text-[var(--color-text-primary)]">
                      {info.content}
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {info.subtext}
                    </p>
                  </div>
                </div>
              ))}

              <div className="p-6 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all"
                      title={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white">
                <h3 className="font-semibold mb-2">
                  Looking for quick answers?
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  Check out our FAQ section for commonly asked questions.
                </p>
                <a
                  href="/#faq"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent-light)] hover:underline"
                >
                  Visit FAQ Section
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt py-12">
        <div className="container-custom">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-[var(--color-border)]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3058.517430033547!2d-75.1652215!3d39.9525839!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6c62f36b4e2b5%3A0x4b39a0c8a9b1f7e8!2sPhiladelphia%2C%20PA!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="The Book Haven Location"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
