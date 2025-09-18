export default function Footer() {
    return (
        
        <>
      <footer className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#about" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">About</span>
              About
            </a>
            <a href="#blogs" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Blogs</span>
              Blogs
            </a>
            <a href="#contact" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Contact</span>
              Contact
            </a>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500">
              &copy; 2025 BlogHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      </>
    );
}