"use client";

import React, { useState, JSX } from "react";
import {
    ChevronDown,
    ChevronRight,
    BookOpen,
    Target,
    Book,
    Hash,
} from "lucide-react";

// Tip tanımlamaları - Felsefe yapısı için
interface Aciklama {
    [key: string]: string;
}

interface FeKazanim {
    baslik: string;
    aciklama: Aciklama;
}

interface FeKonu {
    [kazanimKey: string]: FeKazanim;
}

interface FeSinif {
    [konuKey: string]: FeKonu;
}

interface FeDers {
    [sinifKey: string]: FeSinif;
}

// Tip tanımlamaları - Kimya yapısı için
interface KiKazanim {
    baslik: string;
    aciklama?: Aciklama;
    anahtar_kavramlar?: string;
    alt?: any;
}

interface KiKonu {
    baslik: string;
    anahtar_kavramlar?: string;
    alt: {
        [key: string]: KiKazanim | KiAltKonu;
    };
}

interface KiAltKonu {
    baslik: string;
    anahtar_kavramlar?: string;
    alt?: {
        [key: string]: KiKazanim | KiAltKonu;
    };
}

interface KiSinif {
    alt: {
        [key: string]: KiKonu;
    };
}

interface KiDers {
    [sinifKey: string]: KiSinif;
}

// Genel yapı
interface YKSData {
    yks: {
        [dersKey: string]: FeDers | KiDers;
    };
}

// Ders listesi
const YKS_DERSLERI = [
    {
        name: "matematik",
        displayName: "Matematik",
        file: "/kazanimlar/kazanimlar_matematik.json",
    },
    {
        name: "felsefe",
        displayName: "Felsefe",
        file: "/kazanimlar/kazanimlar_felsefe.json",
    },
    {
        name: "biyoloji",
        displayName: "Biyoloji",
        file: "/kazanimlar/kazanimlar_biyoloji.json",
    },
    {
        name: "cografya",
        displayName: "Coğrafya",
        file: "/kazanimlar/kazanimlar_cografya.json",
    },
    {
        name: "din_kulturu",
        displayName: "Din Kültürü",
        file: "/kazanimlar/kazanimlar_din_kulturu.json",
    },
    {
        name: "fizik",
        displayName: "Fizik",
        file: "/kazanimlar/kazanimlar_fizik.json",
    },
    {
        name: "inkilap",
        displayName: "İnkılap Tarihi",
        file: "/kazanimlar/kazanimlar_inkilap_ve_ataturkculuk.json",
    },
    {
        name: "kimya",
        displayName: "Kimya",
        file: "/kazanimlar/kazanimlar_kimya.json",
    },
    {
        name: "tarih",
        displayName: "Tarih",
        file: "/kazanimlar/kazanimlar_tarih.json",
    },
    {
        name: "turk_dili_ve_edebiyatı",
        displayName: "Türk Dili ve Edebiyatı",
        file: "/kazanimlar/kazanimlar_turk_dili_ve_edebiyati.json",
    },
];

interface SelectedItem {
    ders: string;
    sinif?: string;
    konu?: string;
    kazanim?: string;
    aciklama?: string;
    path?: string;
}

const YKSKazanimlar: React.FC = () => {
    const [selectedDers, setSelectedDers] = useState<string>("");
    const [dersData, setDersData] = useState<YKSData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

    // JSON dosyasını yükle
    const loadDersData = async (dersName: string) => {
        setLoading(true);
        setError("");
        try {
            const ders = YKS_DERSLERI.find((d) => d.name === dersName);
            if (!ders) {
                throw new Error("Ders bulunamadı");
            }

            const response = await fetch(ders.file);
            if (!response.ok) {
                throw new Error("Veri yüklenemedi");
            }

            const data: YKSData = await response.json();
            setDersData(data);
        } catch (err) {
            setError("Veri yüklenirken hata oluştu");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Ders yapısını kontrol et (Felsefe mi Kimya tipi mi)
    const isDersKimyaType = (dersData: any, dersName: string): boolean => {
        if (!dersData?.yks?.[dersName]) return false;
        const firstSinif = Object.values(dersData.yks[dersName])[0] as any;
        return (
            firstSinif && typeof firstSinif === "object" && "alt" in firstSinif
        );
    };

    // Ders seçildiğinde
    const handleDersSelect = (dersName: string) => {
        setSelectedDers(dersName);
        setSelectedItem(null);
        setExpandedItems(new Set());
        loadDersData(dersName);
    };

    // Genişletme/daraltma
    const toggleExpanded = (key: string) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(key)) {
            newExpanded.delete(key);
        } else {
            newExpanded.add(key);
        }
        setExpandedItems(newExpanded);
    };

    // Öğe seçimi
    const handleSelect = (selection: SelectedItem) => {
        setSelectedItem(selection);
    };

    // Felsefe tipi için render fonksiyonları
    const renderFeAciklama = (aciklama: Aciklama, parentKey: string) => {
        return (
            <div className="ml-6 space-y-2">
                {Object.entries(aciklama).map(([key, value]) => (
                    <div
                        key={`${parentKey}-${key}`}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedItem?.aciklama === key &&
                            selectedItem?.kazanim === parentKey
                                ? "bg-blue-100 border-blue-300"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                        onClick={() =>
                            handleSelect({
                                ders: selectedDers,
                                aciklama: key,
                                kazanim: parentKey,
                                path: `${parentKey}-${key}`,
                            })
                        }
                    >
                        <div className="flex items-start gap-2">
                            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                {key}
                            </span>
                            <p className="text-sm text-gray-700 flex-1">
                                {value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderFeKazanim = (
        kazanim: FeKazanim,
        kazanimKey: string,
        parentKey: string,
    ) => {
        const fullKey = `${parentKey}-${kazanimKey}`;
        const isExpanded = expandedItems.has(fullKey);

        return (
            <div key={kazanimKey} className="ml-4">
                <div
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedItem?.kazanim === kazanimKey &&
                        !selectedItem?.aciklama
                            ? "bg-green-100 border-green-300"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                >
                    <div
                        className="flex items-center gap-2"
                        onClick={() => {
                            toggleExpanded(fullKey);
                            handleSelect({
                                ders: selectedDers,
                                kazanim: kazanimKey,
                                path: fullKey,
                            });
                        }}
                    >
                        {isExpanded ? (
                            <ChevronDown size={16} />
                        ) : (
                            <ChevronRight size={16} />
                        )}
                        <Target size={16} className="text-green-600" />
                        <span className="font-medium text-green-700">
                            {kazanimKey}
                        </span>
                        <span className="text-sm text-gray-600">
                            - {kazanim.baslik}
                        </span>
                    </div>
                </div>

                {isExpanded &&
                    kazanim.aciklama &&
                    renderFeAciklama(kazanim.aciklama, kazanimKey)}
            </div>
        );
    };

    const renderFeKonu = (konu: FeKonu, konuKey: string, parentKey: string) => {
        const fullKey = `${parentKey}-${konuKey}`;
        const isExpanded = expandedItems.has(fullKey);

        return (
            <div key={konuKey} className="ml-2">
                <div
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedItem?.konu === konuKey && !selectedItem?.kazanim
                            ? "bg-purple-100 border-purple-300"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                        toggleExpanded(fullKey);
                        handleSelect({
                            ders: selectedDers,
                            konu: konuKey,
                            path: fullKey,
                        });
                    }}
                >
                    <div className="flex items-center gap-2">
                        {isExpanded ? (
                            <ChevronDown size={18} />
                        ) : (
                            <ChevronRight size={18} />
                        )}
                        <Book size={18} className="text-purple-600" />
                        <span className="font-semibold text-purple-700">
                            {konuKey}
                        </span>
                    </div>
                </div>

                {isExpanded && (
                    <div className="mt-2 space-y-2">
                        {Object.entries(konu).map(([kazanimKey, kazanim]) =>
                            renderFeKazanim(kazanim, kazanimKey, fullKey),
                        )}
                    </div>
                )}
            </div>
        );
    };

    // Kimya tipi için render fonksiyonları
    const renderKiItem = (
        item: any,
        itemKey: string,
        parentKey: string,
        level: number = 0,
    ): JSX.Element => {
        const fullKey = `${parentKey}-${itemKey}`;
        const isExpanded = expandedItems.has(fullKey);
        const hasChildren = item.alt && Object.keys(item.alt).length > 0;

        const getColorByLevel = (level: number) => {
            const colors = [
                {
                    bg: "bg-blue-100",
                    border: "border-blue-300",
                    text: "text-blue-700",
                    icon: "text-blue-600",
                },
                {
                    bg: "bg-purple-100",
                    border: "border-purple-300",
                    text: "text-purple-700",
                    icon: "text-purple-600",
                },
                {
                    bg: "bg-green-100",
                    border: "border-green-300",
                    text: "text-green-700",
                    icon: "text-green-600",
                },
                {
                    bg: "bg-orange-100",
                    border: "border-orange-300",
                    text: "text-orange-700",
                    icon: "text-orange-600",
                },
                {
                    bg: "bg-pink-100",
                    border: "border-pink-300",
                    text: "text-pink-700",
                    icon: "text-pink-600",
                },
            ];
            return colors[level % colors.length];
        };

        const colors = getColorByLevel(level);
        const isSelected = selectedItem?.path === fullKey;

        return (
            <div key={itemKey} style={{ marginLeft: `${level * 16}px` }}>
                <div
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        isSelected
                            ? `${colors.bg} ${colors.border}`
                            : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                        if (hasChildren) {
                            toggleExpanded(fullKey);
                        }
                        handleSelect({
                            ders: selectedDers,
                            path: fullKey,
                            kazanim: itemKey,
                        });
                    }}
                >
                    <div className="flex items-start gap-2">
                        {hasChildren &&
                            (isExpanded ? (
                                <ChevronDown size={16} />
                            ) : (
                                <ChevronRight size={16} />
                            ))}
                        {!hasChildren && <div className="w-4" />}
                        <Hash size={16} className={colors.icon} />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`font-medium ${colors.text}`}>
                                    {itemKey}
                                </span>
                                <span className="text-sm text-gray-600">
                                    - {item.baslik}
                                </span>
                            </div>

                            {item.anahtar_kavramlar && (
                                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mt-1">
                                    <strong>Anahtar Kavramlar:</strong>{" "}
                                    {item.anahtar_kavramlar}
                                </div>
                            )}

                            {item.aciklama &&
                                Object.keys(item.aciklama).length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {Object.entries(item.aciklama).map(
                                            ([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="text-xs text-gray-600 bg-gray-50 p-2 rounded"
                                                >
                                                    <strong>{key}:</strong>{" "}
                                                    {value as string}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                        </div>
                    </div>
                </div>

                {isExpanded && hasChildren && (
                    <div className="mt-2 space-y-2">
                        {Object.entries(item.alt).map(([subKey, subItem]) =>
                            renderKiItem(subItem, subKey, fullKey, level + 1),
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderKiSinif = (sinif: KiSinif, sinifKey: string) => {
        const isExpanded = expandedItems.has(sinifKey);

        return (
            <div key={sinifKey} className="mb-4">
                <div
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedItem?.sinif === sinifKey && !selectedItem?.path
                            ? "bg-blue-100 border-blue-300"
                            : "bg-white border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                        toggleExpanded(sinifKey);
                        handleSelect({
                            ders: selectedDers,
                            sinif: sinifKey,
                        });
                    }}
                >
                    <div className="flex items-center gap-3">
                        {isExpanded ? (
                            <ChevronDown size={20} />
                        ) : (
                            <ChevronRight size={20} />
                        )}
                        <BookOpen size={20} className="text-blue-600" />
                        <span className="text-lg font-bold text-blue-700">
                            {sinifKey}. Sınıf
                        </span>
                    </div>
                </div>

                {isExpanded && sinif.alt && (
                    <div className="mt-3 space-y-3">
                        {Object.entries(sinif.alt).map(([konuKey, konu]) =>
                            renderKiItem(konu, konuKey, sinifKey, 0),
                        )}
                    </div>
                )}
            </div>
        );
    };

    // Felsefe tipi için sınıf render
    const renderFeSinif = (sinif: FeSinif, sinifKey: string) => {
        const isExpanded = expandedItems.has(sinifKey);

        return (
            <div key={sinifKey} className="mb-4">
                <div
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedItem?.sinif === sinifKey && !selectedItem?.konu
                            ? "bg-blue-100 border-blue-300"
                            : "bg-white border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                        toggleExpanded(sinifKey);
                        handleSelect({
                            ders: selectedDers,
                            sinif: sinifKey,
                        });
                    }}
                >
                    <div className="flex items-center gap-3">
                        {isExpanded ? (
                            <ChevronDown size={20} />
                        ) : (
                            <ChevronRight size={20} />
                        )}
                        <BookOpen size={20} className="text-blue-600" />
                        <span className="text-lg font-bold text-blue-700">
                            {sinifKey}. Sınıf
                        </span>
                    </div>
                </div>

                {isExpanded && (
                    <div className="mt-3 space-y-3">
                        {Object.entries(sinif).map(([konuKey, konu]) =>
                            renderFeKonu(konu, konuKey, sinifKey),
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    YKS Dersleri ve Kazanımları
                </h1>
                <p className="text-gray-600">
                    Ders seçerek kazanımları detaylı şekilde inceleyebilirsiniz.
                </p>
            </div>

            {/* Ders Seçim Butonları */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    Ders Seçin:
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {YKS_DERSLERI.map((ders) => (
                        <button
                            key={ders.name}
                            onClick={() => handleDersSelect(ders.name)}
                            className={`p-3 rounded-lg border transition-all ${
                                selectedDers === ders.name
                                    ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                                    : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                            }`}
                        >
                            <div className="text-sm font-medium">
                                {ders.displayName}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Yükleme Durumu */}
            {loading && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                        Kazanımlar yükleniyor...
                    </p>
                </div>
            )}

            {/* Hata Durumu */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Seçilen Öğe Bilgisi */}
            {selectedItem && (
                <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow">
                    <h3 className="font-semibold text-gray-800 mb-2">
                        Seçilen:
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                        <div>
                            <strong>Ders:</strong>{" "}
                            {
                                YKS_DERSLERI.find(
                                    (d) => d.name === selectedItem.ders,
                                )?.displayName
                            }
                        </div>
                        {selectedItem.sinif && (
                            <div>
                                <strong>Sınıf:</strong> {selectedItem.sinif}
                            </div>
                        )}
                        {selectedItem.konu && (
                            <div>
                                <strong>Konu:</strong> {selectedItem.konu}
                            </div>
                        )}
                        {selectedItem.kazanim && (
                            <div>
                                <strong>Kazanım:</strong> {selectedItem.kazanim}
                            </div>
                        )}
                        {selectedItem.aciklama && (
                            <div>
                                <strong>Açıklama:</strong>{" "}
                                {selectedItem.aciklama}
                            </div>
                        )}
                        {selectedItem.path && (
                            <div>
                                <strong>Yol:</strong> {selectedItem.path}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Kazanımlar */}
            {dersData && selectedDers && dersData.yks[selectedDers] && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        {
                            YKS_DERSLERI.find((d) => d.name === selectedDers)
                                ?.displayName
                        }{" "}
                        Kazanımları
                    </h2>

                    {isDersKimyaType(dersData, selectedDers)
                        ? // Kimya tipi yapı
                          Object.entries(
                              dersData.yks[selectedDers] as KiDers,
                          ).map(([sinifKey, sinif]) =>
                              renderKiSinif(sinif, sinifKey),
                          )
                        : // Felsefe tipi yapı
                          Object.entries(
                              dersData.yks[selectedDers] as FeDers,
                          ).map(([sinifKey, sinif]) =>
                              renderFeSinif(sinif, sinifKey),
                          )}
                </div>
            )}

            {/* Ders seçilmediğinde */}
            {!selectedDers && (
                <div className="text-center py-12">
                    <BookOpen
                        size={48}
                        className="mx-auto text-gray-400 mb-4"
                    />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        Ders Seçin
                    </h3>
                    <p className="text-gray-500">
                        Kazanımları görüntülemek için yukarıdan bir ders seçin.
                    </p>
                </div>
            )}
        </div>
    );
};

export default YKSKazanimlar;
