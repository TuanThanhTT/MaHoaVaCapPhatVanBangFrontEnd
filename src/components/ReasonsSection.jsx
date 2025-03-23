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

// Dữ liệu các lý do chọn đề tài
const reasons = [
    {
        title: "Đảm bảo tính bảo mật cao cho thông tin văn bằng",
        src_img: "about-baomatdulieu.png",
        content:
            "Việc sử dụng thuật toán mã hóa RSA giúp bảo vệ tính toàn vẹn của văn bằng, ngăn ngừa việc làm giả hay thay đổi thông tin văn bằng.",
        animation: "animate__fadeInUp",
    },
    {
        title: "Tiện lợi cho việc cấp phát và tra cứu văn bằng",
        src_img: "about-tracuutienloi.png",
        content:
            "Hệ thống giúp sinh viên và các tổ chức dễ dàng tra cứu và kiểm tra tính hợp lệ của văn bằng chỉ với một bức ảnh tải lên.",
        animation: "animate__fadeInLeft",
    },
    {
        title: "Giảm thiểu rủi ro và sai sót trong quy trình cấp phát",
        src_img: "about-giamthieuruiro.png",
        content:
            "Quy trình cấp phát văn bằng trực tuyến giúp giảm thiểu sai sót và thời gian chờ đợi so với phương thức truyền thống.",
        animation: "animate__fadeInRight",
    },
    {
        title: "Tăng cường khả năng quản lý và giám sát",
        src_img: "about-dedangquanly.png",
        content:
            "Việc quản lý văn bằng trực tuyến giúp các cơ quan giáo dục dễ dàng theo dõi, giám sát và kiểm tra tính hợp lệ của văn bằng.",
        animation: "animate__fadeInUp",
    },
    {
        title: "Hỗ trợ quá trình chuyển đổi số trong giáo dục",
        src_img: "about-chuyendoiso.png",
        content:
            "Đề tài này giúp thúc đẩy quá trình chuyển đổi số trong giáo dục, tạo ra một hệ thống quản lý văn bằng hiện đại và tiện ích hơn.",
        animation: "animate__fadeInDown",
    },
    {
        title: "Phát triển ứng dụng phần mềm thực tiễn",
        src_img: "about-ungdungphanmenthuctien.png",
        content:
            "Đề tài này mang đến cơ hội nghiên cứu và phát triển một ứng dụng thực tế có thể ứng dụng ngay trong việc cấp phát và xác thực văn bằng cho các cơ sở giáo dục.",
        animation: "animate__fadeInLeft",
    },
];

// Dữ liệu mục tiêu
const objectives = [
    {
        title: "Cung cấp hệ thống cấp phát văn bằng trực tuyến",
        content:
            "Xây dựng một hệ thống cho phép cấp phát và xác thực văn bằng một cách tự động và chính xác, sử dụng thuật toán mã hóa RSA để bảo mật thông tin.",
    },
    {
        title: "Đảm bảo tính bảo mật và an toàn",
        content:
            "Đảm bảo rằng chỉ những văn bằng hợp lệ được cấp phát và xác thực, đảm báo dữ liệu tra cứu được bảo mật.",
    },
    {
        title: "Cải tiến quy trình cấp phát văn bằng",
        content:
            "Giảm thiểu thời gian xử lý và đảm bảo tính chính xác trong việc cấp phát và kiểm tra tính hợp lệ của văn bằng qua hệ thống tự động.",
    },
    {
        title: "Hỗ trợ chuyển đổi số trong giáo dục",
        content:
            "Ứng dụng hệ thống trực tuyến giúp các cơ sở giáo dục chuyển đổi số một cách dễ dàng, tối ưu hóa quy trình cấp phát văn bằng và tăng cường tính minh bạch.",
    },
];

export default function ReasonsAndObjectivesSection() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-16">
            <h2 className="text-3xl uppercase sm:text-4xl md:text-5xl font-sans font-bold text-left mb-8 border-b-4 border-blue-500 pb-2">
                Lý do chọn đề tài
            </h2>


            <div className="flex flex-col gap-8">
                {reasons.map((reason, index) => (
                    <div
                        key={index}
                        className={`flex flex-col my-10 md:flex-row items-center bg-white shadow-lg rounded-lg overflow-hidden animate__animated ${reason.animation} animate__delay-${index * 0.2}s ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                    >
                        <div className="w-full md:w-1/2 h-96 bg-white overflow-hidden relative">
                            <div className="w-full h-full bg-white flex items-center justify-center">
                                <img src={reason.src_img} className="w-full h-auto object-cover" />
                            </div>
                        </div>
                        <div className="p-6 flex-1">
                            <h3 className="text-2xl font-sans font-bold mb-4">{reason.title}</h3>
                            <p className="text-gray-700 mb-4">{reason.content}</p>
                            <button className={button({ variant: "outline" })}>Tìm hiểu thêm</button>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="text-3xl uppercase sm:text-4xl md:text-5xl font-sans font-bold text-left mb-8 border-b-4 border-blue-500 pb-2">
                Mục tiêu đề tài
            </h2>


            <div className="flex flex-col gap-8">
                {objectives.map((objective, index) => (
                    <div key={index} className="flex flex-col my-10 md:flex-row items-center bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="p-6 flex-1">
                            <h3 className="text-2xl font-sans font-bold mb-4">{objective.title}</h3>
                            <p className="text-gray-700 mb-4">{objective.content}</p>
                            <button className={button({ variant: "outline" })}>Tìm hiểu thêm</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
