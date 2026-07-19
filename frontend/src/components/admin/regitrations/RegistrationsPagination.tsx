type RegistrationsPaginationProps = {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    currentItemCount: number;
    loading: boolean;
    onPageChange: (page: number) => void;
};

export function RegistrationsPagination({
                                            page,
                                            pageSize,
                                            totalItems,
                                            totalPages,
                                            currentItemCount,
                                            loading,
                                            onPageChange,
                                        }: RegistrationsPaginationProps) {
    const firstVisibleItem =
        totalItems === 0
            ? 0
            : page * pageSize + 1;

    const lastVisibleItem = Math.min(
        totalItems,
        page * pageSize + currentItemCount,
    );

    return (
        <footer className="registrations-pagination">
            <p>
                Showing {firstVisibleItem}–{lastVisibleItem} of{" "}
    {totalItems}
    </p>

    <div>
    <button
        type="button"
    disabled={loading || page === 0}
    onClick={() =>
    onPageChange(
        Math.max(0, page - 1),
    )
}
>
    Previous
    </button>

    <span>
    Page {totalPages === 0 ? 0 : page + 1} of{" "}
    {totalPages}
    </span>

    <button
    type="button"
    disabled={
            loading ||
        page + 1 >= totalPages
}
    onClick={() =>
    onPageChange(page + 1)
}
>
    Next
    </button>
    </div>
    </footer>
);
}