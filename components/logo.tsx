import Link from "next/link";

export default function Logo() {
    return (
        <Link href="/" className="text-primary text-2xl font-bold">
            Prompti<span className="text-secondary">Tron</span>
        </Link>
    );
}
