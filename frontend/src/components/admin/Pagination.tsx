import {Button} from "../ui/Button.tsx"

type Props = {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function Pagination({page, totalPages, onPageChange}: Props) {
    if (totalPages <= 1) return null

    return (
        <div className="flex items-center gap-1 justify-center flex-wrap">
            <Button variant="secondary" disabled={page === 0} onClick={() => onPageChange(page - 1)}>
                ‹
            </Button>
            {Array.from({length: totalPages}, (_, i) => (
                <Button
                    key={i}
                    variant={i === page ? "primary" : "secondary"}
                    onClick={() => onPageChange(i)}
                    className="w-9"
                >
                    {i + 1}
                </Button>
            ))}
            <Button variant="secondary" disabled={page === totalPages - 1} onClick={() => onPageChange(page + 1)}>
                ›
            </Button>
        </div>
    )
}
