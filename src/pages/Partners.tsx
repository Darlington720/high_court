import { Building2, GraduationCap, Gavel, Globe, ArrowRight, CheckCircle2, Users, Handshake } from 'lucide-react';
import { Button } from '../components/ui/Button';

const partners = {
  academic: [
    {
      name: 'Makerere University School of Law',
      logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=200&h=200',
      description: 'Premier law school in East Africa, providing legal education excellence since 1924.',
      website: '#'
    },
    {
      name: 'Uganda Christian University',
      logo: 'https://images.unsplash.com/photo-1592494804071-faea15d93a8a?auto=format&fit=crop&q=80&w=200&h=200',
      description: 'Leading private university with a strong focus on legal studies and research.',
      website: '#'
    }
  ],
  legal: [
    {
      name: 'Uganda Law Society',
      logo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=200&h=200',
      description: 'Professional association of lawyers promoting excellence in legal practice.',
      website: '#'
    },
    {
      name: 'East African Law Society',
      logo: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&q=80&w=200&h=200',
      description: 'Regional bar association promoting cross-border legal cooperation.',
      website: '#'
    }
  ],
  government: [
    {
      name: 'Ministry of Justice and Constitutional Affairs',
      logo: 'https://images.unsplash.com/photo-1604079628040-94301bb21b91?auto=format&fit=crop&q=80&w=200&h=200',
      description: 'Government ministry overseeing legal and constitutional matters.',
      website: '#'
    },
    {
      name: 'Uganda Registration Services Bureau',
      logo: 'https://images.unsplash.com/photo-1577415124269-fc1140a69e91?auto=format&fit=crop&q=80&w=200&h=200',
      description: 'Official registrar of companies and intellectual property.',
      website: '#'
    }
  ]
};

const testimonials = [
  {
    quote: "Educite has revolutionized how we access and utilize legal resources. It's an invaluable tool for our institution.",
    author: "Dr. Sarah Namuli",
    title: "Dean, Faculty of Law",
    organization: "Makerere University"
  },
  {
    quote: "The partnership with Educite has significantly enhanced our members' access to crucial legal documents and research materials.",
    author: "Hon. Bernard Oundo",
    title: "President",
    organization: "Uganda Law Society"
  }
];

const benefits = [
  {
    title: "Enhanced Access",
    description: "Get priority access to our comprehensive legal database and resources."
  },
  {
    title: "Custom Solutions",
    description: "Tailored solutions to meet your organization's specific needs."
  },
  {
    title: "Technical Support",
    description: "Dedicated technical support and training for your team."
  },
  {
    title: "Research Tools",
    description: "Advanced research tools and analytics capabilities."
  }
];

export default function Partners() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-blue-900 py-24">
        <div 
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&q=80")',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Our Partners
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Collaborating with leading institutions to advance legal knowledge and access to justice
            </p>
          </div>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        {/* Academic Partners */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-12">
            <div className="rounded-lg bg-blue-100 p-3">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Academic Partners
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {partners.academic.map((partner) => (
              <PartnerCard key={partner.name} partner={partner} />
            ))}
          </div>
        </div>

        {/* Legal Partners */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-12">
            <div className="rounded-lg bg-purple-100 p-3">
              <Gavel className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Legal Partners
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {partners.legal.map((partner) => (
              <PartnerCard key={partner.name} partner={partner} />
            ))}
          </div>
        </div>

        {/* Government Partners */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-12">
            <div className="rounded-lg bg-green-100 p-3">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Government Partners
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {partners.government.map((partner) => (
              <PartnerCard key={partner.name} partner={partner} />
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="rounded-lg bg-yellow-100 p-3">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Partner Testimonials
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-2xl bg-gray-50 p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <blockquote className="text-gray-700">"{testimonial.quote}"</blockquote>
                <div className="mt-6">
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.title}</p>
                  <p className="text-sm text-gray-600">{testimonial.organization}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partnership Benefits */}
      <div className="bg-blue-900 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="rounded-lg bg-blue-800 p-3">
              <Handshake className="h-6 w-6 text-blue-100" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Partnership Benefits
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="rounded-xl bg-blue-800/50 p-8 backdrop-blur-sm"
              >
                <CheckCircle2 className="h-8 w-8 text-blue-300 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-blue-100">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Become a Partner CTA */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Become a Partner
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Join our network of prestigious institutions and organizations. Let's work together to advance legal education and access to justice.
            </p>
            <div className="mt-10">
              <Button
                variant="primary"
                className="text-lg px-8 py-3"
                onClick={() => window.location.href = '/contact'}
              >
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PartnerCard({ partner }: { partner: typeof partners.academic[0] }) {
  return (
    <div className="flex flex-col rounded-2xl bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-6">
        <img
          src={partner.logo}
          alt={partner.name}
          className="h-16 w-16 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">{partner.name}</h3>
          <p className="mt-2 text-gray-600">{partner.description}</p>
          <a
            href={partner.website}
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-500"
          >
            Visit Website
            <Globe className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}