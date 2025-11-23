const Navbar = () => {
  return (
    <div className="container mx-auto px-6 py-10 flex justify-between items-center p-5">
      {/* logo */}
      <div className="flex items-center gap-1">
        <div className="bg-gradient-to-bl from-pink-500  to-orange-500 px-3 py-1 rounded-lg text-white font-bold">
          F
        </div>

        <h1 className="text-2xl font-bold">
          FixIt <span className="text-white/60">Hub</span>
        </h1>
      </div>

      {/* nav */}
      <nav>
        <ul className="flex items-center space-x-10">
          <li className="text-white/60 font-semibold hover:text-white cursor-pointer transition duration-300 ">Home</li>
          <li className="text-white/60 font-semibold hover:text-white cursor-pointer transition duration-300 ">About</li>
          <li className="text-white/60 font-semibold hover:text-white cursor-pointer transition duration-300 ">Insights</li>
          <li className="text-white/60 font-semibold hover:text-white cursor-pointer transition duration-300 ">Contact</li>
        </ul>
      </nav>

      {/* button */}
      <div>
        <button className="text-black font-bold bg-white px-4 py-1.5 rounded-2xl cursor-pointer">Get Started</button>
      </div>
    </div>
  );
};
export default Navbar;
