"use client";

import Image from "next/image";
import Overlay from "./components/overlay/Overlay";
import Carousel from "./components/Carousel";

export default function Home() {
  return (
    <main>
      <Carousel />
      {/* <section className="section hero">
        <div className="hero-img-container">
          <Image
            src="/hero-img-layer-1.jpg"
            alt=""
            fill
            style={{ objectFit: "cover" }}
            priority
          />

          <div className="hero-img-logo">
            <Image
              src="/logo.png"
              alt=""
              width={250}
              height={250}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          <Image
            src="/hero-img-layer-2.png"
            alt=""
            fill
            style={{ objectFit: "cover" }}
            priority
          />

          <div className="hero-img-copy">
            <p>Scroll down to reveal</p>
          </div>
        </div>

        <div className="fade-overlay"></div>

        <Overlay />
      </section> */}

    </main>
  );
}
