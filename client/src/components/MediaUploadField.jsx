import { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { uploadMedia } from '../lib/upload';

export default function MediaUploadField({
  label,
  hint,
  value,
  onChange,
  getNextData,
  accept = 'image/*',
  kind = 'image',
}) {
  const { save } = useSite();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [savedNote, setSavedNote] = useState('');

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setSavedNote('');
    try {
      const url = await uploadMedia(file);
      onChange(url);

      if (getNextData) {
        await save(getNextData(url));
        setSavedNote('Saved to homepage.');
      }
    } catch (err) {
      setError(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div className="mb-5 last:mb-0">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>

      {value && kind === 'image' && (
        <img
          src={value}
          alt=""
          className="w-full max-h-48 object-cover rounded-lg mb-3 border border-gray-200"
        />
      )}
      {value && kind === 'video' && (
        <video
          src={value}
          className="w-full max-h-48 rounded-lg mb-3 border border-gray-200 bg-black"
          controls
          muted
          playsInline
        />
      )}

      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="https://..."
        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A3A28] transition-colors"
      />

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <label className={`cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-[#1A3A28] border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
          {uploading ? 'Uploading...' : 'Upload file'}
          <input
            type="file"
            accept={accept}
            onChange={handleFile}
            className="hidden"
            disabled={uploading}
          />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-red-500 hover:text-red-600"
          >
            Remove
          </button>
        )}
      </div>

      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {savedNote && <p className="text-xs text-[#1A3A28] mt-1">{savedNote}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
