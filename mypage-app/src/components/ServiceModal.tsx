import React from "react";
import "../assets/tailwind.css";

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ServiceModal({ isOpen, onClose }: ServiceModalProps) {
    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ease-in-out
                  ${isOpen ? "opacity-100 visible bg-[rgba(0,0,0,0.5)]" : "opacity-0 invisible"}`}>

            <div className={`bg-white rounded-[12px] shadow-xl p-[24px] w-[360px] text-center transform transition-all duration-300 ease-in-out
                    ${isOpen ? "scale-100" : "scale-95"}`}>

                <h2 className="text-[20px] font-[700] mb-[12px] text-gray-900">
                    서비스 준비 중
                </h2>

                <p className="text-[15px] text-gray-600 mb-[20px] leading-relaxed">
                    해당 기능은 현재 준비 중입니다. <br />
                    곧 만나보실 수 있어요 😊
                </p>

                <button onClick={onClose} className="px-[20px] py-[10px] bg-[rgb(59,130,246)] text-white rounded-[6px]
                     hover:bg-[rgb(37,99,235)] transition-colors duration-200">
                    닫기
                </button>

            </div>
        </div>
    );
}