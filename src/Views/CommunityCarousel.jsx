// src/components/CommunityCarousel.jsx

import React from 'react';
import Slider from 'react-slick';
import bodega from '../images/bodega.webp';
import office from '../images/office.webp';
import worker from '../images/worker.webp';

export default function CommunityCarousel() {
    const images = [bodega, office, worker];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            { breakpoint: 768, settings: { slidesToShow: 1 } },
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
        ],
    };

    return (
        <div className="mx-auto max-w-5xl py-12">
            <Slider {...settings}>
                {images.map((src, idx) => (
                    <div key={idx} className="px-2">
                        <img
                            src={src}
                            alt={`Community ${idx + 1}`}
                            className="w-full h-48 object-cover rounded-lg shadow-lg"
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
}
