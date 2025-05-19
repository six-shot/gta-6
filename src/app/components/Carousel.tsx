"use client";

import { useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import slides from "../data/slides";
import styles from "./Carousel.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Carousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const activeSlideIndexRef = useRef(0);
  const previousProgressRef = useRef(0);
  const isAnimatingSlideRef = useRef(false);
  const triggerDestroyedRef = useRef(false);

  useEffect(() => {
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const initialSlide = carouselRef.current?.querySelector(`.${styles.slide}`);
    if (initialSlide) {
      gsap.set(initialSlide, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      });
      gsap.set(initialSlide.querySelector(`.${styles.slideImg} img`), {
        y: "0%",
      });
      initMarqueeAnimation(
        initialSlide.querySelector(`.${styles.marqueeContainer} h1`)
      );
    }

    function updateProgressBars(progress: number) {
      const progressBars = document.querySelectorAll(`.${styles.progressBar}`);
      progressBars.forEach((bar, index) => {
        const barProgress = Math.min(Math.max(progress * 5 - index, 0), 1);
        (bar as HTMLElement).style.setProperty(
          "--progress",
          barProgress.toString()
        );
      });
    }

    function initMarqueeAnimation(h1Element: HTMLElement | null) {
      if (!h1Element) return;
      const text = h1Element.textContent;
      if (text) {
        h1Element.textContent = text + " " + text + " " + text;
        gsap.to(h1Element, {
          x: "-33.33%",
          duration: 10,
          ease: "linear",
          repeat: -1,
          rotation: 0.01,
        });
      }
    }

    function createAndAnimateSlide(index: number, isScrollingForward: boolean) {
      const carousel = carouselRef.current;
      if (!carousel) return;

      const currentSlide = carousel.querySelector(`.${styles.slide}`);
      if (!currentSlide) {
        isAnimatingSlideRef.current = false;
        return;
      }

      const slideData = slides[index];

      const newSlide = document.createElement("div");
      newSlide.className = styles.slide;
      newSlide.innerHTML = `
        <div class="${styles.slideImg}">
          <img src="${slideData.image}" alt="${slideData.marquee}" />
        </div>
        <div class="${styles.slideCopy}">
          <div class="${styles.slideMarquee}">
            <div class="${styles.marqueeContainer}">
              <h1>${slideData.marquee}</h1>
            </div>
          </div>
        </div>
      `;

      initMarqueeAnimation(
        newSlide.querySelector(`.${styles.marqueeContainer} h1`)
      );

      const currentSlideImg = currentSlide.querySelector(`.${styles.slideImg}`);
      const currentSlideCopy = currentSlide.querySelector(
        `.${styles.slideCopy}`
      );

      if (!currentSlideImg || !currentSlideCopy) {
        isAnimatingSlideRef.current = false;
        return;
      }

      gsap.killTweensOf(currentSlide);
      gsap.killTweensOf(currentSlideImg);
      gsap.killTweensOf(
        currentSlideCopy.querySelector(`.${styles.slideMarquee}`)
      );

      if (isScrollingForward) {
        const newSlideImg = newSlide.querySelector(`.${styles.slideImg} img`);
        const newSlideCopy = newSlide.querySelector(`.${styles.slideCopy}`);

        gsap.set(newSlide, {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        });
        gsap.set(newSlideImg, { y: "25%" });
        gsap.set(newSlideCopy, { y: "100%" });

        carousel.appendChild(newSlide);

        gsap.to(newSlide, {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
          duration: 1,
          ease: "power4.inOut",
        });

        gsap.to([newSlideCopy, newSlideImg], {
          y: "0%",
          duration: 1,
          ease: "power4.inOut",
        });

        gsap.to(currentSlide, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1,
          ease: "power4.inOut",
          onStart: () => {
            gsap.to(currentSlideImg, {
              y: "-25%",
              duration: 1,
              ease: "power4.inOut",
            });
            gsap.to(currentSlideCopy, {
              y: "-100%",
              duration: 1,
              ease: "power4.inOut",
            });
          },
          onComplete: () => {
            if (currentSlide.parentNode) {
              currentSlide.remove();
            }
            isAnimatingSlideRef.current = false;
          },
          onInterrupt: () => {
            isAnimatingSlideRef.current = false;
          },
        });
      } else {
        const newSlideImg = newSlide.querySelector(`.${styles.slideImg} img`);
        const newSlideCopy = newSlide.querySelector(`.${styles.slideCopy}`);

        gsap.set(newSlide, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        });
        gsap.set(newSlideImg, { y: "-25%" });
        gsap.set(newSlideCopy, { y: "-100%" });

        carousel.insertBefore(newSlide, currentSlide);

        gsap.to(newSlide, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1,
          ease: "power4.inOut",
        });

        gsap.to([newSlideImg, newSlideCopy], {
          y: "0%",
          duration: 1,
          ease: "power4.inOut",
        });

        gsap.to(currentSlide, {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          duration: 1,
          ease: "power4.inOut",
          onStart: () => {
            gsap.to(currentSlideImg, {
              y: "25%",
              duration: 1,
              ease: "power4.inOut",
            });
            gsap.to(currentSlideCopy, {
              y: "100%",
              duration: 1,
              ease: "power4.inOut",
            });
          },
          onComplete: () => {
            if (currentSlide.parentNode) {
              currentSlide.remove();
            }
            isAnimatingSlideRef.current = false;
          },
          onInterrupt: () => {
            isAnimatingSlideRef.current = false;
          },
        });
      }
    }

    const scrollTrigger = ScrollTrigger.create({
      trigger: `.${styles.carousel}`,
      start: "top top",
      end: `+=${window.innerHeight * 5}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        if (triggerDestroyedRef.current) return;

        const progress = self.progress;
        updateProgressBars(progress);

        if (isAnimatingSlideRef.current) {
          previousProgressRef.current = progress;
          return;
        }

        const isScrollingForward = progress > previousProgressRef.current;
        const targetSlideIndex = Math.min(Math.floor(progress * 5), 4);

        if (targetSlideIndex !== activeSlideIndexRef.current) {
          isAnimatingSlideRef.current = true;

          try {
            createAndAnimateSlide(targetSlideIndex, isScrollingForward);
            activeSlideIndexRef.current = targetSlideIndex;
          } catch {
            isAnimatingSlideRef.current = false;
          }
        }

        previousProgressRef.current = progress;
      },
      onKill: () => {
        triggerDestroyedRef.current = true;
      },
    });

    return () => {
      scrollTrigger.kill();
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <section className={styles.carousel} ref={carouselRef}>
        <div className={styles.slide}>
          <div className={styles.slideImg}>
            <img
              src={slides[0].image}
              alt={slides[0].marquee}
              style={{ objectFit: "cover", transform: "scale(1.25)" }}
            />
          </div>
          <div className={styles.slideCopy}>
            <div className={styles.slideMarquee}>
              <div className={styles.marqueeContainer}>
                <h1>{slides[0].marquee}</h1>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.carouselProgress}>
          {[...Array(5)].map((_, index) => (
            <div key={index} className={styles.progressBar} />
          ))}
        </div>
      </section>
    </>
  );
}
