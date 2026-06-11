export function AuthDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-workana-gray-200" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-3 text-workana-gray-500">o</span>
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
        className="mb-1.5 block text-sm font-medium text-workana-gray-700"
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
        className="w-full rounded-md border border-workana-gray-200 px-3 py-2.5 text-sm text-workana-gray-900 outline-none transition placeholder:text-workana-gray-500 focus:border-workana-blue focus:ring-2 focus:ring-workana-blue/20"
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
      className="w-full rounded-md bg-workana-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-workana-blue-dark disabled:opacity-60"
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
