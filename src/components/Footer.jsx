import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterest } from "react-icons/fa";
import { Input, Button } from "@mui/material";

const Footer = () => {
    return (
        <footer className="bg-[#0b1220] text-gray-300 pt-12 pb-6">

            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">

                {/* Logo + Info */}
                <div>
                    <h2 className="text-2xl font-bold text-pink-500 mb-3">🛒 EKART</h2>
                    <p className="text-sm mb-4">
                        Powering your world with the best in electronics.
                    </p>

                    <p className="text-sm">123 Electronics St, Style City</p>
                    <p className="text-sm">Email: support@ekart.com</p>
                    <p className="text-sm">Phone: (123) 456-7890</p>
                </div>

                {/* Customer Service */}
                <div>
                    <h3 className="text-white font-semibold mb-3">Customer Service</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/contact" className="hover:text-pink-400">Contact Us</Link></li>
                        <li><Link to="/returns" className="hover:text-pink-400">Shipping & Returns</Link></li>
                        <li><Link to="/faqs" className="hover:text-pink-400">FAQs</Link></li>
                        <li><Link to="/tracking" className="hover:text-pink-400">Order Tracking</Link></li>
                        <li><Link to="/size-guide" className="hover:text-pink-400">Size Guide</Link></li>
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h3 className="text-white font-semibold mb-3">Follow Us</h3>
                    <div className="flex gap-4 text-lg">
                        <a href="#" className="hover:text-pink-400"><FaFacebookF /></a>
                        <a href="#" className="hover:text-pink-400"><FaInstagram /></a>
                        <a href="#" className="hover:text-pink-400"><FaTwitter /></a>
                        <a href="#" className="hover:text-pink-400"><FaPinterest /></a>
                    </div>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="text-white font-semibold mb-3">Stay in the Loop</h3>
                    <p className="text-sm mb-4">
                        Subscribe to get special offers, free giveaways, and more.
                    </p>

                    <div className="flex ">
                        <Input
                            type="email"
                            placeholder="Your email address"
                            disableUnderline
                            sx={{
                                px: 2,
                                py: 1,
                                width: "100%",
                                backgroundColor: "white",
                                borderRadius: "6px 0 0 6px"
                            }}
                        />
                        <Button
                            variant="contained"
                            sx={{
                                py: 1,
                                px: 4,
                                backgroundColor: "#db2777",
                                color: "white",
                                "&:hover": {
                                    backgroundColor: "#be185d"
                                }
                            }}
                        >
                            Subscribe
                        </Button>
                    </div>
                </div>

            </div>

            {/* Bottom Line */}
            <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
                © 2025 <span className="text-pink-500 font-semibold">EKART</span>. All rights reserved.
            </div>

        </footer>
    );
};

export default Footer;