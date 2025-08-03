import { Button } from "@/components/ui/button";
import { categories } from "@/lib/constants/lessons";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <section className="container-x flex-center flex-col min-h-[80dvh]">
                <h1 className="text-4xl font-semibold text-center capitalize mb-12">
                    Lütfen bir kategori seçiniz
                </h1>

                <div className="flex-center w-full gap-8">
                    {/* TODO: isActive değilse link componenti olarak basılmasın */}
                    {categories.map((category) => (
                        <Button
                            size="lg"
                            asChild
                            key={category.id}
                            disabled={category.isActive}
                        >
                            <Link href={category.href}>{category.title}</Link>
                        </Button>
                    ))}
                </div>
            </section>
        </>
    );
}
