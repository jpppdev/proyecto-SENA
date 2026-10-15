export default function TextArea({
    label,
    error,
    htmlFor,
    maxLength,
    value = "",
    onChange,
    rows = 4,
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={htmlFor}
                    className={`block font-semibold mb-1 text-sm ${
                        error ? "text-red-800" : "text-[var(--color-text-secondary)]"
                    }`}
                >
                    {label}
                </label>
            )}
            <div className="relative flex flex-col">
                <textarea
                    id={htmlFor}
                    value={value}
                    onChange={onChange}
                    maxLength={maxLength}
                    rows={rows}
                    className={`
                        w-full rounded-md border px-4 py-3 text-[var(--semantic-font-size-body)] resize-none
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-[var(--color-focus-border)]
                        bg-[var(--color-background-input)] text-[var(--color-text-primary)]
                        ${error ? "border-red-800" : "border-[var(--color-border-strong)]"}
                    `}
                    {...props}
                />
                {maxLength && (
                    <span className="self-end text-xs text-[var(--color-text-muted)] mt-1 font-medium">
                        {value.length}/{maxLength}
                    </span>
                )}
            </div>
            {error && (
                <p className="text-[var(--semantic-font-size-caption)] text-red-800 place-self-start mt-1">
                    {error}
                </p>
            )}
        </div>
    );
}