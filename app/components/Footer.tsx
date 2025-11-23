const Footer = () => {
  return (
    <footer className="bg-neutral-950 border-t border-white/5 py-12">
      <div className="container mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-2 font-bold text-2xl tracking-tighter mb-8 text-white">
          <div className="bg-gradient-to-bl from-pink-500  to-orange-500 px-3 py-1 rounded-lg text-white font-bold">
            F
          </div>

          <h1 className="text-2xl font-bold">
            FixIt <span className="text-white/60">Hub</span>
          </h1>
        </div>
        <div className="flex justify-center gap-8 text-neutral-500 text-sm mb-8">
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Contact Support
          </a>
        </div>
        <p className="text-neutral-600 text-sm">
          © 2025 FixIt Community. Design inspired by{" "}
          <span className="text-orange-500">Paraphol.</span>
        </p>
      </div>
    </footer>
  );
};
export default Footer;
