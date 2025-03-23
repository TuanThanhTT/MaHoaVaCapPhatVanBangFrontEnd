import { tv } from "tailwind-variants";
import * as React from "react";
import 'animate.css';

// Định nghĩa styles cho Card và Button
const card = tv({
    base: "bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row items-center transition-all ease-in-out duration-500",
});

const cardContent = tv({
    base: "p-6 flex-1",
});

const button = tv({
    base: "px-4 py-2 text-white font-semibold rounded-lg transition duration-300",
    variants: {
        variant: {
            outline: "border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
            solid: "bg-blue-500 hover:bg-blue-600",
        },
    },
    defaultVariants: {
        variant: "solid",
    },
});

// Dữ liệu các tính năng
const features = [
    {
        title: "Bảo mật cao với thuật toán RSA",
        content:
            "Hệ thống sử dụng thuật toán mã hóa RSA để bảo vệ dữ liệu văn bằng, đảm bảo thông tin không thể bị giả mạo hay chỉnh sửa trái phép.",
        image: "baomatcao.png",
        animation: "animate__fadeInUp", // Effect riêng cho phần tử này
    },
    {
        title: "Xác thực tự động, không cần tra cứu thủ công",
        content:
            "Người dùng có thể kiểm tra tính hợp lệ của văn bằng bằng cách tải lên ảnh văn bằng. Hệ thống sẽ tự động xác thực.",
        image: "xacthuctudong.png",
        animation: "animate__fadeInLeft", // Effect riêng cho phần tử này
    },
    {
        title: "Xử lý nhanh chóng và chính xác",
        content:
            "Nhờ vào thuật toán mã hóa và quy trình kiểm tra tối ưu, hệ thống có thể xử lý số lượng lớn yêu cầu xác thực nhanh chóng.",
        image: "xulynhanhchonhchinhxac.png",
        animation: "animate__fadeInRight", // Effect riêng cho phần tử này
    },
    {
        title: "Giao diện thân thiện, dễ sử dụng",
        content:
            "Hệ thống được thiết kế với giao diện đơn giản, trực quan, phù hợp với nhiều đối tượng người dùng.",
        image: "giaodienthanthiendesudung.png",
        animation: "animate__fadeInUp", // Effect riêng cho phần tử này
    },
    {
        title: "Tăng cường độ tin cậy và minh bạch",
        content:
            "Việc áp dụng công nghệ mã hóa giúp đảm bảo rằng chỉ có các văn bằng hợp lệ mới được xác thực.",
        image: "tincayvaminhbach.png",
        animation: "animate__fadeInDown", // Effect riêng cho phần tử này
    },
];

export default function FeaturesSection() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-16">
            <h2 className="text-4xl font-serif font-bold text-center mb-8">
                Những điểm nổi bật của CertiCrypt
            </h2>
            <div className="flex flex-col gap-8">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className={`flex flex-col my-10 md:flex-row items-center bg-white shadow-lg rounded-lg overflow-hidden animate__animated ${feature.animation} animate__delay-${index * 0.2}s ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                    >
                        <div className="w-full md:w-1/2 h-96 bg-gray-200 overflow-hidden relative">
                            <img
                                src={feature.image}
                                alt={feature.title}
                                className="w-full h-full object-cover transform transition-all duration-500 ease-in-out hover:scale-105"
                            />
                        </div>
                        <div className="p-6 flex-1">
                            <h3 className="text-2xl font-sans font-bold mb-4">{feature.title}</h3>
                            <p className="text-gray-700 mb-4">{feature.content}</p>
                            <button className={button({ variant: "outline" })}>Tìm hiểu thêm</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
