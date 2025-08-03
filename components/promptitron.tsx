import Link from "next/link";
import { Button } from "./ui/button";

export default function PromptiTron() {
    return (
        <Button asChild>
            <Link
                href="/ai-chat"
                className="flex-center fixed right-4 bottom-4"
            >
                AI Asistan ile sohbete başla
            </Link>
        </Button>
    );
}
