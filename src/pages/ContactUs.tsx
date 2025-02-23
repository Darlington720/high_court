import { useState } from "react";
import { LocateFixedIcon, Phone, Timer } from "lucide-react";

const features = [
  {
    icon: LocateFixedIcon,
    title: "Find Us Here",
    description:
      "Location: Plot 77-79, Namuwongo Rd, Makindye Division, Kampala.",
  },
  {
    icon: Phone,
    title: "Get In Touch",
    description: `Tel: +256742053490 | +256781248720\nEmail: admin@educitevl.edu.ug`,
  },
  {
    icon: Timer,
    title: "Working Hours",
    description: "Mon-Fri: 9am - 8pm | Sat: 10am - 4pm",
  },
];

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.message) newErrors.message = "Message cannot be empty";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert("Message sent successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-blue-900 py-20 text-center">
        <h1 className="text-4xl font-bold text-white">Contact Us</h1>
        <p className="mt-3 text-lg text-blue-100">
          We would love to hear from you!
        </p>
      </div>

      {/* Contact Details */}
      <div className="bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 px-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="relative p-6 rounded-lg shadow-md bg-white"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                </div>
                <p className="mt-3 text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white py-12">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: "name", type: "text", placeholder: "Your Name" },
              { name: "email", type: "email", placeholder: "Your Email" },
              { name: "phone_no", type: "text", placeholder: "Phone Number" },
            ].map((field) => (
              <div key={field.name}>
                <input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 shadow-sm transition duration-300"
                  value={formData[field.name]}
                  onChange={handleChange}
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}

            <div>
              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 shadow-sm transition duration-300"
                value={formData.message}
                onChange={handleChange}
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full transform rounded-lg bg-blue-500 py-3 text-lg font-semibold text-white transition duration-300 hover:bg-blue-600 hover:shadow-md"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
