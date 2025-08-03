import {
    CircleQuestionMark,
    NotebookPen,
    NotebookText,
    Video,
} from "lucide-react";

export const categories = [
    {
        id: "lgs",
        title: "LGS",
        href: "/lgs",
        isActive: false,
    },
    {
        id: "yks",
        title: "YKS",
        href: "/yks",
        isActive: true,
    },
    {
        id: "university",
        title: "Üniversite ve Sonrası",
        href: "/universite-ve-sonrasi",
        isActive: false,
    },
];

export const MODULES = [
    { name: "Soru Üret", icon: CircleQuestionMark },
    { name: "Plan Oluştur", icon: NotebookPen },
    { name: "Video Özeti Çıkar", icon: Video },
    { name: "Konu Özeti", icon: NotebookText },
];
