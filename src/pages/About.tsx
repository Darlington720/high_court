import { Book, Scale, Users, Globe, Lightbulb, GraduationCap, BookOpen, Library } from 'lucide-react';
import { Button } from '../components/ui/Button';

const features = [
  {
    icon: Book,
    title: 'Comprehensive Collection',
    description: 'Access to a vast library of legal documents, including judgments, legislations, and learning materials.'
  },
  {
    icon: Scale,
    title: 'Legal Excellence',
    description: 'Supporting legal professionals with up-to-date resources and research tools.'
  },
  {
    icon: Users,
    title: 'Inclusive Access',
    description: 'Serving judges, advocates, students, researchers, and academics across Uganda and beyond.'
  },
  {
    icon: Globe,
    title: 'Digital Innovation',
    description: 'Leveraging ICT-based tools to provide remote access to legal content in real-time.'
  }
];

const objectives = [
  {
    icon: Lightbulb,
    title: 'Knowledge Enhancement',
    description: 'Strengthening legal education through comprehensive digital resources.'
  },
  {
    icon: GraduationCap,
    title: 'Research Support',
    description: 'Facilitating in-depth legal research with advanced tools and databases.'
  },
  {
    icon: BookOpen,
    title: 'Content Accessibility',
    description: 'Making legal information readily available through affordable subscription plans.'
  },
  {
    icon: Library,
    title: 'Digital Transformation',
    description: 'Modernizing legal resource access through virtual library solutions.'
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-blue-900 py-24">
        <div 
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80")',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              About Educite Virtual Library
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Empowering legal professionals and researchers with comprehensive digital access to legal resources
            </p>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="relative isolate overflow-hidden bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Mission
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Educite Virtual Library's primary purpose is to reinforce learning and acquisition of legal knowledge by providing a more solid basis for legal education and research. We enhance the quality of life by drawing on digitally available content using ICT-based tools.
            </p>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What We Offer
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our comprehensive virtual library provides remote access to a variety of local and foreign legal content
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="relative pl-16">
                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold leading-8 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-base leading-7 text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Significance Section */}
      <div className="relative isolate overflow-hidden bg-blue-900 py-24 sm:py-32">
        <div 
          className="absolute inset-0 -z-10 opacity-10"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80")',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Our Significance
            </h2>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Educite Virtual Library aims to play a crucial role in democratizing access to legal information, empowering legal professionals, researchers, students, and the general public to engage with the law more effectively. By harnessing the power of technology to aggregate, organize, and disseminate legal knowledge, we aim to contribute to the efficiency, accuracy, and accessibility of legal research and practice in the digital age.
            </p>
          </div>
        </div>
      </div>

      {/* Objectives */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Objectives
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Promoting collaboration, innovation, and the exchange of ideas within the legal community
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
              {objectives.map((objective) => {
                const Icon = objective.icon;
                return (
                  <div 
                    key={objective.title}
                    className="flex flex-col rounded-2xl bg-gray-50 p-8 hover:bg-gray-100 transition-colors"
                  >
                    <div className="mb-4">
                      <div className="rounded-lg bg-blue-100 p-3 w-fit">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {objective.title}
                    </h3>
                    <p className="mt-2 text-gray-600 flex-grow">
                      {objective.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start Your Legal Research Journey
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Join our community of legal professionals and researchers. Access comprehensive legal resources and advanced research tools.
            </p>
            <div className="mt-10 flex items-center justify-center gap-6">
              <Button
                variant="primary"
                className="bg-white text-gray-900 hover:bg-gray-100"
                onClick={() => window.location.href = '/register'}
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white/10"
                onClick={() => window.location.href = '/contact'}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}