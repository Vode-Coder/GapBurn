export default function FileUpload({ onFile, uploading }) {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-brand-300 bg-brand-50/50 px-6 py-10 text-center">
      <p className="font-medium text-brand-900">Upload resume or certificate</p>
      <p className="mt-1 text-sm text-stone-500">PDF, PNG, or JPG — demo OCR runs instantly</p>
      <input
        type="file"
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFile(file)
        }}
      />
      {uploading ? <p className="mt-3 text-sm text-brand-700">Extracting skills…</p> : null}
    </label>
  )
}
