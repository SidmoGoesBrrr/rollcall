"use client";
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

export default function Hero() {
  const settings = {
    dots: false,
    infinite: true,
    fade: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const images = [
    { src: "/images/image1.png", alt: "Background image 1" },
    { src: "/images/image2.png", alt: "Background image 2" },
    { src: "/images/image3.png", alt: "Background image 3" },
  ];

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index}>
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-screen object-cover"
              />
            </div>
          ))}
        </Slider>
        {/* Optional dark gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
      </div>

      {/* Text Container with semi-transparent background */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="bg-black bg-opacity-60 p-8 rounded-md text-center max-w-lg mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white">
            Stunite
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-200">
            Connect. Bond. Thrive.
          </p>
          <p className="mt-6 text-lg text-gray-300">
            Everyone on campus complains about how hard it is to make genuine
            connections. Stunite transforms the way you meet people by offering a
            TikTok-style feed where you can explore short profiles, share fun
            answers, and discover friends who truly get you.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold transition"
            >
              Get Started
            </a>
            <a
              href="#"
              className="px-8 py-3 border border-white text-white rounded-full font-semibold hover:bg-white hover:text-black transition"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}