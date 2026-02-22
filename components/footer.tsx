import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="https://image-tc.galaxy.tf/wisvg-cdprptjd6y51ekf7yn1bbwxd7/corporate-logo-white.svg?width=600"
                alt="Warwick Hotel"
                width={150}
                height={400}
                priority
              />
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Experience the finest culinary journey in Saudi Arabia. Our dishes
              blend traditional flavors with modern techniques.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                Bakjushi, King Fahd Road, Al Baha, Saudi Arabia
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" />
                +966 11 123 4567
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" />
                info@warwick.sa
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold mb-4">Opening Hours</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                <span>Sat - Thu: 05:00 AM - 11:59 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                <span>Friday: 1:00 PM - 11:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Map</h4>
            <div className="w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d992.0815989845785!2d41.57335640180272!3d19.869146468652943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2ssa!4v1771762173638!5m2!1sen!2ssa"
                width="100%"
                height="120"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-2 pt-2 text-center text-sm text-primary-foreground/60">
          <p>
            © 2026 Warwick Restaurant. All rights reserved. Develop by{" "}
            <a href="https://www.facebook.com/devs.sayeed" target="_blank">
              Abu Sayeed
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
