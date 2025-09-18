import Footer from './footer.jsx';

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="text-2xl font-bold text-gray-900">BlogHub</span>
          </a>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <a href="#features" className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600">
            Features
          </a>
          <a href="#blogs" className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600">
            Browse Blogs
          </a>
          <a href="#about" className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600">
            About
          </a>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <a href="/login" className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600">
            Log in
          </a>
          <a
            href="/signup"
            className="rounded-md bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            Sign up
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative isolate px-6 pt-8 lg:px-8">
        <div className="mx-auto max-w-2xl py-10 sm:py-10 lg:py-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Share Your Stories with the World
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Join our community of writers and readers. Create, share, and discover amazing content from passionate bloggers around the globe.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/login"
                className="rounded-md bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
              >
                Start Writing
              </a>
              <a href="#blogs" className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600">
                Browse Blogs <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-gray-600">Everything you need</h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              A better way to blog
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our platform provides all the tools you need to create, manage, and share your content with ease.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-5 w-5 flex-none">
                    <div className="h-full w-full rounded bg-gray-900"></div>
                  </div>
                  Easy Writing
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Intuitive editor with formatting tools that make writing and publishing effortless.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-5 w-5 flex-none">
                    <div className="h-full w-full rounded bg-gray-900"></div>
                  </div>
                  Community Driven
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Connect with fellow writers and readers in a supportive, engaging community.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-5 w-5 flex-none">
                    <div className="h-full w-full rounded bg-gray-900"></div>
                  </div>
                  Discover Content
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Explore diverse topics and discover new perspectives from writers worldwide.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Blog Preview Section */}
      <div id="blogs" className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Latest from our community
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Discover the latest insights and stories from our talented writers.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {/* Sample blog previews */}
            <article className="flex max-w-xl flex-col items-start justify-between">
              <div className="flex items-center gap-x-4 text-xs">
                <time className="text-gray-500">Mar 16, 2024</time>
                <span className="relative z-10 rounded-full bg-gray-100 px-3 py-1.5 font-medium text-gray-600">
                  Featured
                </span>
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                  <a href="#blogs">
                    <span className="absolute inset-0" />
                    The Future of Digital Content Creation
                  </a>
                </h3>
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                  Exploring how technology is reshaping the way we create, share, and consume digital content.
                </p>
              </div>
              <div className="relative mt-8 flex items-center gap-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="text-sm leading-6">
                  <p className="font-semibold text-gray-900">Community Writer</p>
                  <p className="text-gray-600">Content Creator</p>
                </div>
              </div>
            </article>
            <article className="flex max-w-xl flex-col items-start justify-between">
              <div className="flex items-center gap-x-4 text-xs">
                <time className="text-gray-500">Mar 14, 2024</time>
                <span className="relative z-10 rounded-full bg-gray-100 px-3 py-1.5 font-medium text-gray-600">
                  Trending
                </span>
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                  <a href="#blogs">
                    <span className="absolute inset-0" />
                    Building Communities Through Storytelling
                  </a>
                </h3>
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                  How powerful narratives bring people together and create lasting connections.
                </p>
              </div>
              <div className="relative mt-8 flex items-center gap-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="text-sm leading-6">
                  <p className="font-semibold text-gray-900">Community Writer</p>
                  <p className="text-gray-600">Storyteller</p>
                </div>
              </div>
            </article>
            <article className="flex max-w-xl flex-col items-start justify-between">
              <div className="flex items-center gap-x-4 text-xs">
                <time className="text-gray-500">Mar 12, 2024</time>
                <span className="relative z-10 rounded-full bg-gray-100 px-3 py-1.5 font-medium text-gray-600">
                  Popular
                </span>
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                  <a href="/blogs">
                    <span className="absolute inset-0" />
                    Tips for New Bloggers
                  </a>
                </h3>
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                  Essential advice for starting your blogging journey and building an engaged audience.
                </p>
              </div>
              <div className="relative mt-8 flex items-center gap-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="text-sm leading-6">
                  <p className="font-semibold text-gray-900">Community Writer</p>
                  <p className="text-gray-600">Mentor</p>
                </div>
              </div>
            </article>
          </div>
          <div className="mt-10 flex items-center justify-center">
            <a
              href="/blogs"
              className="rounded-md bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            >
              View All Blogs
            </a>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Ready to start your blogging journey?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Join thousands of writers who have already started sharing their stories. Create your account today.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/signup"
                className="rounded-md bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
              >
                Create Account
              </a>
              <a href="/login" className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600">
                Already have an account? <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
        <Footer />
    </div>
  )
}