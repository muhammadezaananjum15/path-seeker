import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the career quiz work?',
      a: 'Our Interest Quiz evaluates your core skills, work preferences, and personal values across 5 sections to generate a percentage-based match against 1000+ global career roadmaps.',
    },
    {
      q: 'Is the career guidance free?',
      a: 'Yes! PathSeeker offers free access to our Career Bank, Interest Quiz, Multimedia Center, and downloadable PDF resource guides.',
    },
    {
      q: 'Can I download the resources?',
      a: 'Absolutely! You can download PDF roadmaps, resume templates, and cheat sheets directly to your device.',
    },
    {
      q: 'How often is the content updated?',
      a: 'Our editorial team and AI intelligence update career salary benchmarks and industry trends continuously.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen py-10 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Banner */}
        <div className="space-y-2">
          <span className="px-3.5 py-1.5 rounded-full bg-purple-100 text-[#4F20C9] text-xs font-bold uppercase tracking-wider">
            GET IN TOUCH
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Contact <span className="text-[#4F20C9]">Us</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
            We're here to help! Reach out to us for any queries, feedback, or support. Our team will get back to you as soon as possible.
          </p>
        </div>

        {/* 3 Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#4F20C9] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#07031A]">Email Us</h4>
            <p className="text-xs font-semibold text-[#4F20C9]">support@pathseeker.com</p>
            <p className="text-[11px] text-slate-400">We reply within 24 hours</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#4F20C9] flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#07031A]">Call Us</h4>
            <p className="text-xs font-semibold text-[#4F20C9]">+92 300 1234567</p>
            <p className="text-[11px] text-slate-400">Mon - Fri | 9:00 AM - 6:00 PM</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#4F20C9] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#07031A]">Our Office</h4>
            <p className="text-xs font-semibold text-[#4F20C9]">Lahore, Punjab, Pakistan</p>
            <p className="text-[11px] text-slate-400">Visit us anytime</p>
          </div>
        </div>

        {/* Grid: Send Message Form + FAQ Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Send Message Form */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
            <h3 className="text-xl font-bold text-[#07031A]">Send Us a Message</h3>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-700 text-center space-y-2">
                <h4 className="font-bold text-lg">Message Sent!</h4>
                <p className="text-xs">Thank you for reaching out. We will get back to you shortly.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 px-6 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs shadow"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ayaan Khan"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ayaan@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Career Quiz Inquiry"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Message</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
                >
                  <span>Send Message</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* FAQs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
              <h3 className="text-xl font-bold text-[#07031A]">Frequently Asked Questions</h3>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 cursor-pointer"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-[#07031A]">{faq.q}</h4>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                    </div>
                    {openFaq === idx && (
                      <p className="text-[11px] text-slate-500 leading-relaxed pt-1 border-t border-slate-200">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback Card */}
            <div className="p-6 rounded-3xl bg-purple-50 border border-purple-100 space-y-3">
              <h4 className="font-bold text-sm text-[#4F20C9]">We Value Your Feedback</h4>
              <p className="text-xs text-purple-900">
                Your feedback helps us improve PathSeeker and serve you better.
              </p>
              <Link
                to="/feedback"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#4F20C9] text-white font-bold text-xs shadow uppercase tracking-wider"
              >
                <span>Give Feedback</span>
                <Send className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
