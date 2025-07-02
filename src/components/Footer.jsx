import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black-500 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Section */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Contact</h3>
            <div className="space-y-3">
              <p><strong>Health Coach/Support Email:</strong> support@nutriplanner.com</p>
              <p><strong>Phone:</strong> (+84) 0836622500</p>
              <p><strong>Physical Center Address:</strong> 123 LÊ THỊ RIÊNG, 12 District, HCMC</p>
            </div>
          </div>
          {/* Google Map Section */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Our Location</h3>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1234567890123!2d106.6297!3d10.8231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ5JzIzLjEiTiAxMDbCsDM3JzQ2LjkiRQ!5e0!3m2!1sen!2s!4v1234567890123"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="NutriPlanner Physical Center Location"
              ></iframe>
            </div>
          </div>
          {/* Privacy Policy Section */}
          <div className="text-right">
            <h3 className="text-2xl font-bold mb-6">Privacy Policy</h3>
            <div className="space-y-3 text-right">
              <Link to="/terms-of-use" className="block hover:underline">Terms of Use</Link>
              <Link to="/privacy-policy" className="block hover:underline">Privacy Policy</Link>
              <Link to="/cookie-policy" className="block hover:underline">Cookie Policy</Link>
              <Link to="/privacy-rights" className="block hover:underline">Privacy Rights</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-purple-700 mt-8 pt-8 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} NutriPlanner. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 