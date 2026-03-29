const Footer = () => {
  return (
    <footer className="bg-[#FAF9F6] pt-12 pb-6 border-t border-gray-100">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#7A3E3E]">Imran Dupatta</h2>
          <p className="text-sm text-gray-500">Traditional Pakistani clothing. Quality craftsmanship meets timeless elegance.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Shop</h4>
          <ul className="text-sm text-gray-500 space-y-2">
            <li>Dupatta</li> <li>Shawl</li> <li>Abaya</li> <li>Stollers</li> <li>Kids</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Support</h4>
          <ul className="text-sm text-gray-500 space-y-2">
            <li>Contact Us</li> <li>FAQs</li> <li>Cash on Delivery</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Newsletter</h4>
          <input type="email" placeholder="Your Email" className="w-full p-2 border border-gray-200 text-sm mb-2" />
          <button className="w-full bg-[#7A3E3E] text-white py-2 text-sm">Subscribe</button>
        </div>
      </div>
      <div className="text-center mt-12 text-xs text-gray-400">
        © 2026 Imran Dupatta. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;