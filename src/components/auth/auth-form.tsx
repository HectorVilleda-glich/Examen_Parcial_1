export function AuthDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[#dde3ea]" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-3 text-[#6b7280]">o</span>
      </div>
    </div>
  );
}

export function AuthInput({
  id,
  label,
  type = "text",
  name,
  required = true,
  minLength,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  name: string;
  required?: boolean;
  minLength?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-[#374151]"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        className="w-full rounded-md border border-[#dde3ea] px-3 py-2.5 text-sm text-[#1f2937] outline-none transition placeholder:text-[#6b7280] focus:border-[#007bd2] focus:ring-2 focus:ring-[#007bd2]/20"
      />
    </div>
  );
}

export function AuthSubmitButton({
  children,
  loading,
  loadingText,
}: {
  children: React.ReactNode;
  loading: boolean;
  loadingText: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-md bg-[#007bd2] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0066b3] disabled:opacity-60"
    >
      {loading ? loadingText : children}
    </button>
  );
}

export function AuthError({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {message}
    </div>
  );
}
