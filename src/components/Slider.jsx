import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const images = [
    "slider1.png",
    "giaodienthanthiendesudung.png",
    "khanangxacthuctincay.png",
];

export default function Slider() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full mx-auto overflow-hidden rounded-2xl shadow-lg my-2">
            <div className="relative w-full h-[60vh] sm:h-[80vh] md:h-[90vh]">
                {images.map((img, i) => (
                    <motion.img
                        key={i}
                        src={img}
                        alt={`Slide ${i}`}
                        className="absolute w-full h-full object-contain object-center"
                        animate={{ opacity: i === index ? 1 : 0 }}
                        initial={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                    />
                ))}
                {/* Lớp phủ tối dần */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                {/* Tiêu đề website */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center text-white drop-shadow-lg px-4 sm:px-8 md:px-16">
                    <h1 className="text-4xl sm:text-5xl md:text-[100px] font-bold font-serif my-6">CertiCrypt</h1>
                    <p className="text-lg sm:text-xl md:text-3xl font-light font-mono">Hệ thống mã hóa và xác thực văn bằng</p>
                </div>
            </div>
        </div>
    );
}
