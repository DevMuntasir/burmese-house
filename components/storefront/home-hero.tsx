"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { banners as fallbackBanners } from "@/lib/mock-data";
import type { Banner } from "@/lib/types";

interface HomeHeroProps {
  banners?: Banner[];
}

export function HomeHero({ banners: initialBanners }: HomeHeroProps) {
  const banners = initialBanners && initialBanners.length > 0 ? initialBanners : fallbackBanners;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const totalSlides = banners.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay functionality
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => clearInterval(interval);
  }, [totalSlides, isPaused, nextSlide]);

  // Touch swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <>
      {/* Mobile Dynamic Banner Carousel */}
      <section
        className="relative bg-white px-3 pb-3 pt-4 sm:hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative min-h-[210px] overflow-hidden rounded-[20px] bg-[#221514] shadow-[0_8px_24px_rgba(0,0,0,.15)]">
          {banners.map((banner, index) => {
            const isActive = index === currentIndex;
            const bannerImg = banner.mobileImage || banner.image || "/images/hero-chutney.png";
            return (
              <div
                key={banner._id || index}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? "z-10 opacity-100" : "z-0 pointer-events-none opacity-0"
                  }`}
              >
                <Image
                  src={bannerImg}
                  alt={banner.title || "Banner"}
                  fill
                  priority={index === 0}
                  sizes="calc(100vw - 24px)"
                  className="object-cover object-[68%_center]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#140a0b]/98 via-[#1f0e11]/88 to-black/25" />
                <div className="relative flex h-full max-w-[74%] flex-col items-start justify-between p-4 xs:p-5 text-white">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold text-[#8b1e2a] shadow-xs backdrop-blur-xs">
                      <Sparkles size={11} className="text-[#ff464b]" />
                      আসল বার্মিজ স্বাদ
                    </span>
                    <h1 className="hero-title-bangla mt-2 text-[18px] xs:text-[20px] font-extrabold leading-[1.3] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                      {banner.title}
                    </h1>
                    {banner.subtitle && (
                      <p className="mt-1.5 line-clamp-2 text-[11.5px] leading-relaxed text-stone-200/90 font-normal">
                        {banner.subtitle}
                      </p>
                    )}
                  </div>
                  <Link
                    href={banner.link || "/products"}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#ff464b] hover:bg-[#e8343a] px-4 py-1.5 text-[12px] font-bold text-white shadow-md active:scale-95 transition-transform"
                  >
                    {banner.buttonText || "অর্ডার করুন"}
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Pagination Dots */}
        {totalSlides > 1 && (
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {banners.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 transition-all duration-300 rounded-full ${idx === currentIndex ? "w-6 bg-[#ff464b]" : "w-2 bg-stone-300"
                  }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Desktop Dynamic Hero Carousel */}
      <section
        className="group relative hidden min-h-[580px] overflow-hidden bg-[#eee4df] sm:block lg:min-h-[620px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {banners.map((banner, index) => {
          const isActive = index === currentIndex;
          const bannerImg = banner.image || banner.mobileImage || "/images/hero-chutney.png";
          return (
            <div
              key={banner._id || index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? "z-10 opacity-100" : "z-0 pointer-events-none opacity-0"
                }`}
            >
              <Image
                src={bannerImg}
                alt={banner.title || "Banner"}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-[65%_center] sm:object-center transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#faf6f3] via-[#faf6f3]/95 via-45% to-[#faf6f3]/10 sm:from-[#faf6f3]/98 sm:via-[#faf6f3]/92 sm:via-52% lg:via-[#faf6f3]/85 lg:via-48% lg:to-transparent" />
              <div className="container-shell relative flex min-h-[520px] items-center py-16 sm:min-h-[580px] lg:min-h-[620px]">
                <div className="max-w-[620px]">
                  {/* <div className="inline-flex items-center gap-2 rounded-full border border-[#eddcd4] bg-white/90 px-3.5 py-1.5 shadow-xs backdrop-blur-xs">
                    <Sparkles size={14} className="text-[#ff464b]" />
                    <span className="text-[12px] font-bold tracking-wider text-[#6f2742] uppercase font-sans">
                      Handmade · Small batch · Authentic
                    </span>
                  </div> */}
                  <h1 className="hero-title-bangla mt-4 text-[34px] sm:text-[42px] md:text-[48px] lg:text-[54px] xl:text-[60px] font-extrabold leading-[1.22] text-[#1c1214] tracking-normal">
                    {banner.title}
                  </h1>
                  {banner.subtitle && (
                    <p className="mt-4 max-w-[500px] text-base leading-relaxed text-stone-700 sm:text-[17px] font-normal">
                      {banner.subtitle}
                    </p>
                  )}
                  <div className="mt-8 flex flex-wrap items-center gap-3.5">
                    <Link href={banner.link || "/products"} className="button-primary inline-flex items-center gap-2 rounded-full px-7 py-3 text-base font-bold shadow-md hover:shadow-lg transition-all">
                      {banner.buttonText || "সব আচার দেখুন"} <ArrowRight size={17} />
                    </Link>
                    <Link href="/category/combo-gift-box" className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-stone-300 bg-white/80 px-6 py-2.5 text-[15px] font-bold text-[#1c1214] backdrop-blur-xs transition-all hover:border-[#ff464b] hover:bg-white hover:text-[#ff464b]">
                      কম্বো প্যাক দেখুন
                    </Link>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-600">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#ff464b]" />
                      শতভাগ খাঁটি উপকরণ
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#ff464b]" />
                      সারাদেশে ক্যাশ অন ডেলিভারি
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#ff464b]" />
                      ঘরোয়া বার্মিজ রেসিপি
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Desktop Carousel Navigation Arrows */}
        {totalSlides > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-stone-800 backdrop-blur-md shadow-md transition-all hover:bg-white hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-stone-800 backdrop-blur-md shadow-md transition-all hover:bg-white hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <ChevronRight size={22} />
            </button>

            {/* Desktop Pagination Indicators */}
            <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 flex items-center gap-2">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2.5 transition-all duration-300 rounded-full ${idx === currentIndex
                      ? "w-8 bg-[#ff464b] shadow-sm"
                      : "w-2.5 bg-stone-400/60 hover:bg-stone-500"
                    }`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Trust & Value Proposition Bar */}
      <section className="hidden border-b border-stone-200 bg-white sm:block">
        <div className="container-shell grid grid-cols-2 divide-x divide-stone-200 py-4 sm:grid-cols-4">
          {[
            [Truck, "সারাদেশে ডেলিভারি", "নিরাপদ প্যাকেজিং"],
            [ShieldCheck, "ঘরে তৈরি", "বাছাই করা উপকরণ"],
            [ArrowRight, "সহজ অর্ডার", "দ্রুত checkout"],
            [ShieldCheck, "নিরাপদ পেমেন্ট", "COD অথবা bKash"],
          ].map(([Icon, title, copy], index) => {
            const IconComponent = Icon as typeof Truck;
            return (
              <div
                key={title as string}
                className={`flex items-center justify-center gap-3 px-2 py-2 ${index > 1 ? "hidden sm:flex" : ""
                  }`}
              >
                <IconComponent size={20} className="text-[#6f2742]" />
                <div>
                  <p className="text-xs font-bold sm:text-sm">{title as string}</p>
                  <p className="text-[10px] text-stone-500 sm:text-xs">{copy as string}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

