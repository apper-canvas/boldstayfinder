import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { toast } from "react-toastify";

const Help = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const faqData = [
    {
      question: "How do I book a property?",
      answer: "To book a property, search for your destination, select your dates and number of guests, browse available properties, and click 'Reserve' on your chosen listing. You'll need to create an account to complete your booking."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. Your payment information is securely encrypted and protected."
    },
    {
      question: "Can I cancel my booking?",
      answer: "Cancellation policies vary by property. You can view the specific cancellation policy on each listing page. Most hosts offer flexible or moderate cancellation policies."
    },
    {
      question: "How do I contact my host?",
      answer: "Once your booking is confirmed, you'll receive the host's contact information. You can also message them through our platform's secure messaging system."
    },
    {
      question: "What if I have issues during my stay?",
      answer: "Our 24/7 customer support team is always available to help. You can contact us through the app, website, or by phone for immediate assistance."
    },
    {
      question: "How do I save properties to my wishlist?",
      answer: "Click the heart icon on any property listing to save it to your wishlist. You can view all your saved properties in the 'Saved' section of your account."
    }
  ];

  const supportCategories = [
    {
      icon: "Home",
      title: "Booking Support",
      description: "Help with reservations, payments, and booking modifications"
    },
    {
      icon: "MapPin",
      title: "Travel Questions",
      description: "Destination advice, local recommendations, and travel tips"
    },
    {
      icon: "Shield",
      title: "Safety & Security",
      description: "Account security, safety guidelines, and trust issues"
    },
    {
      icon: "CreditCard",
      title: "Payment Help",
      description: "Payment methods, refunds, and billing questions"
    },
    {
      icon: "Settings",
      title: "Account Management",
      description: "Profile settings, notifications, and account preferences"
    },
    {
      icon: "MessageCircle",
      title: "Host Communication",
      description: "Messaging hosts and resolving communication issues"
    }
  ];

  const handleFormChange = (field, value) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    toast.success("Your message has been sent! We'll get back to you soon.");
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How can we help you?
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get support, find answers to common questions, or contact our team directly
            </p>
            <div className="max-w-lg mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help..."
                  className="w-full px-6 py-4 pr-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-primary">
                  <ApperIcon name="Search" size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Support Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Browse by category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-all transform hover:-translate-y-1 cursor-pointer group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                  <ApperIcon name={category.icon} size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-card overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <ApperIcon
                      name="ChevronDown"
                      size={20}
                      className={`text-gray-500 transition-transform ${
                        expandedFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Still need help?
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Can't find what you're looking for? Our support team is here to help. 
                Send us a message and we'll get back to you as soon as possible.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="MessageCircle" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Live Chat</h3>
                    <p className="text-gray-600 text-sm">Available 24/7 for immediate assistance</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Mail" size={24} className="text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Support</h3>
                    <p className="text-gray-600 text-sm">support@stayfinder.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Phone" size={24} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone Support</h3>
                    <p className="text-gray-600 text-sm">1-800-STAYFINDER</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Name"
                    value={contactForm.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="Subject"
                  value={contactForm.subject}
                  onChange={(e) => handleFormChange("subject", e.target.value)}
                  required
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    value={contactForm.message}
                    onChange={(e) => handleFormChange("message", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Help;