import { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { saveSiteData } from '../api';

const SECTIONS = [
  { key: 'dashboard', label: 'Dashboard', icon: '▣' },
  { key: 'hero', label: 'Hero (Video)', icon: '▶' },
  { key: 'about', label: 'About', icon: '✎' },
  { key: 'services', label: 'Services', icon: '✨' },
  { key: 'membership', label: 'Membership', icon: '★' },
  { key: 'beforeafter', label: 'Before & After', icon: '⚒' },
  { key: 'testimonials', label: 'Testimonials', icon: '💬' },
  { key: 'gallery', label: 'Gallery', icon: '🖼' },
  { key: 'faq', label: 'FAQ', icon: '❓' },
  { key: 'contact', label: 'Contact', icon: '📍' },
];

export default function AdminPage() {
  const { data, loading, setData } = useSite();
  const [active, setActive] = useState('dashboard');
  const [toast, setToast] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading || !data) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading...</div>;
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  async function handleSave() {
    try {
      await saveSiteData(data);
      showToast('Saved successfully!');
    } catch {
      showToast('Error saving. Try again.');
    }
  }

  function updateField(section, key, value) {
    setData(prev => ({
      ...prev,
      [section]: Array.isArray(prev[section])
        ? value
        : { ...prev[section], [key]: value }
    }));
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile toggle */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-[60] bg-[#1A3A28] text-white w-10 h-10 rounded-lg
          flex items-center justify-center text-xl">
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`w-64 bg-[#1A3A28] text-white fixed top-0 left-0 bottom-0 z-50
        transition-transform md:translate-x-0 overflow-y-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 pt-6 pb-2 text-lg font-bold">Forest Day Spa</div>
        <div className="px-6 pb-6 text-[0.72rem] text-white/40">Admin Panel</div>
        <nav>
          {SECTIONS.map(s => (
            <button key={s.key}
              onClick={() => { setActive(s.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium text-left
                transition-colors border-l-[3px]
                ${active === s.key
                  ? 'text-white bg-white/10 border-[#C9A96E]'
                  : 'text-white/50 border-transparent hover:text-white hover:bg-white/5'}`}>
              <span className="w-5 text-center">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </nav>
        <div className="p-6">
          <a href="/" target="_blank"
            className="block text-center text-xs text-white/40 hover:text-white/70 border border-white/10 rounded py-2">
            View Live Site →
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-64 p-6 md:p-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8 ml-12 md:ml-0">
          <h1 className="text-2xl font-bold">{SECTIONS.find(s => s.key === active)?.label}</h1>
          <button onClick={handleSave}
            className="bg-[#1A3A28] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2D5A3D] transition-colors">
            💾 Save All
          </button>
        </div>

        {/* Panels */}
        {active === 'dashboard' && <DashboardPanel data={data} />}
        {active === 'hero' && <HeroPanel data={data} updateField={updateField} />}
        {active === 'about' && <AboutPanel data={data} updateField={updateField} />}
        {active === 'services' && <ServicesPanel data={data} setData={setData} />}
        {active === 'membership' && <MembershipPanel data={data} updateField={updateField} />}
        {active === 'beforeafter' && <BAPanel data={data} setData={setData} />}
        {active === 'testimonials' && <TestimonialsPanel data={data} setData={setData} />}
        {active === 'gallery' && <GalleryPanel data={data} setData={setData} />}
        {active === 'faq' && <FAQPanel data={data} setData={setData} />}
        {active === 'contact' && <ContactPanel data={data} updateField={updateField} />}
      </main>

      {/* Toast */}
      <div className={`fixed bottom-6 right-6 bg-[#1A3A28] text-white px-6 py-3 rounded-lg shadow-xl
        text-sm font-medium transition-all duration-300 z-[100]
        ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        {toast}
      </div>
    </div>
  );
}

/* ═══ SHARED UI ═══ */
function Card({ title, badge, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-7 mb-6">
      {title && (
        <h3 className="text-sm font-bold mb-5 flex items-center gap-2">
          {title}
          {badge && <span className="text-[0.65rem] font-semibold bg-[#1A3A28] text-white px-2 py-0.5 rounded uppercase">{badge}</span>}
        </h3>
      )}
      {children}
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="mb-5 last:mb-0">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function Input({ value, onChange, ...props }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)}
      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A3A28] transition-colors"
      {...props} />
  );
}

function Textarea({ value, onChange, ...props }) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)}
      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A3A28] transition-colors resize-y min-h-[80px]"
      {...props} />
  );
}

/* ═══ PANELS ═══ */
function DashboardPanel({ data }) {
  const stats = [
    { label: 'Sections', value: '10' },
    { label: 'Services', value: data.services?.length || 0 },
    { label: 'Testimonials', value: data.testimonials?.length || 0 },
    { label: 'Gallery Photos', value: data.gallery?.length || 0 },
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <div className="text-3xl font-bold text-[#1A3A28]">{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <Card title="Quick Guide">
        <ol className="text-sm text-gray-500 leading-8 list-decimal pl-5">
          <li>Click on a section in the sidebar to edit its content</li>
          <li>Fill in or change text, image URLs, etc.</li>
          <li>Click <strong>Save All</strong> to save changes to the server</li>
          <li>Open the <strong>View Live Site</strong> link in the sidebar to see changes</li>
          <li>Changes are saved to the server and persist across sessions</li>
        </ol>
      </Card>
    </>
  );
}

function HeroPanel({ data, updateField }) {
  const h = data.hero;
  return (
    <>
      <Card title="Video / Background">
        <Field label="Video URL (MP4)" hint="Leave empty to use poster image. Upload to YouTube or use stock video URL.">
          <Input value={h.videoUrl} onChange={v => updateField('hero', 'videoUrl', v)} placeholder="https://..." />
        </Field>
        <Field label="Fallback Poster Image URL">
          <Input value={h.posterUrl} onChange={v => updateField('hero', 'posterUrl', v)} />
        </Field>
      </Card>
      <Card title="Text Content">
        <Field label="Eyebrow Text">
          <Input value={h.eyebrow} onChange={v => updateField('hero', 'eyebrow', v)} />
        </Field>
        <Field label="Headline">
          <Input value={h.headline} onChange={v => updateField('hero', 'headline', v)} />
        </Field>
        <Field label="Description">
          <Textarea value={h.description} onChange={v => updateField('hero', 'description', v)} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Primary Button">
            <Input value={h.primaryBtn} onChange={v => updateField('hero', 'primaryBtn', v)} />
          </Field>
          <Field label="Secondary Button">
            <Input value={h.secondaryBtn} onChange={v => updateField('hero', 'secondaryBtn', v)} />
          </Field>
        </div>
      </Card>
    </>
  );
}

function AboutPanel({ data, updateField }) {
  const a = data.about;
  return (
    <Card title="About Content">
      <Field label="Section Label">
        <Input value={a.label} onChange={v => updateField('about', 'label', v)} />
      </Field>
      <Field label="Title">
        <Input value={a.title} onChange={v => updateField('about', 'title', v)} />
      </Field>
      <Field label="Paragraph 1">
        <Textarea value={a.paragraphs[0]} onChange={v => {
          const p = [...a.paragraphs]; p[0] = v;
          updateField('about', 'paragraphs', p);
        }} />
      </Field>
      <Field label="Paragraph 2">
        <Textarea value={a.paragraphs[1] || ''} onChange={v => {
          const p = [...a.paragraphs]; p[1] = v;
          updateField('about', 'paragraphs', p);
        }} />
      </Field>
      <Field label="Image URL">
        <Input value={a.imageUrl} onChange={v => updateField('about', 'imageUrl', v)} />
      </Field>
    </Card>
  );
}

function ServicesPanel({ data, setData }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? data.services : data.services.filter(s => s.category === filter);
  const [editing, setEditing] = useState(null);

  function updateService(id, key, value) {
    setData(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, [key]: value } : s),
    }));
  }

  function deleteService(id) {
    if (!confirm('Delete this service?')) return;
    setData(prev => ({ ...prev, services: prev.services.filter(s => s.id !== id) }));
  }

  function addService() {
    const newId = Math.max(0, ...data.services.map(s => s.id)) + 1;
    setData(prev => ({
      ...prev,
      services: [...prev.services, {
        id: newId, category: 'facial', name: 'New Service', korean: '',
        duration: '60 min', description: '', price: '$0', memberPrice: '$0',
      }],
    }));
    setEditing(newId);
  }

  return (
    <Card title="Manage Services" badge="Facial / Body / Scalp">
      <div className="mb-4">
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm">
          <option value="all">All</option>
          <option value="facial">Facial</option>
          <option value="body">Body</option>
          <option value="scalp">Scalp</option>
        </select>
      </div>
      <div className="space-y-3">
        {filtered.map(s => (
          <div key={s.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm">{s.name} <span className="text-gray-400 font-normal">({s.category})</span></h4>
              <div className="flex gap-2">
                <button onClick={() => setEditing(editing === s.id ? null : s.id)}
                  className="text-xs border border-gray-200 px-3 py-1 rounded hover:bg-gray-100">
                  {editing === s.id ? 'Close' : 'Edit'}
                </button>
                <button onClick={() => deleteService(s.id)}
                  className="text-xs border border-red-200 text-red-500 px-3 py-1 rounded hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>
            {editing === s.id && (
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Name"><Input value={s.name} onChange={v => updateService(s.id, 'name', v)} /></Field>
                  <Field label="Category">
                    <select value={s.category} onChange={e => updateService(s.id, 'category', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm">
                      <option value="facial">Facial</option>
                      <option value="body">Body</option>
                      <option value="scalp">Scalp</option>
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Korean Name"><Input value={s.korean} onChange={v => updateService(s.id, 'korean', v)} /></Field>
                  <Field label="Duration"><Input value={s.duration} onChange={v => updateService(s.id, 'duration', v)} /></Field>
                </div>
                <Field label="Description"><Textarea value={s.description} onChange={v => updateService(s.id, 'description', v)} /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Non-member Price"><Input value={s.price} onChange={v => updateService(s.id, 'price', v)} /></Field>
                  <Field label="Member Price"><Input value={s.memberPrice} onChange={v => updateService(s.id, 'memberPrice', v)} /></Field>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={addService}
        className="mt-4 border border-gray-200 rounded-lg px-5 py-2 text-sm font-medium hover:bg-gray-50">
        + Add New Service
      </button>
    </Card>
  );
}

function MembershipPanel({ data, updateField }) {
  const m = data.membership;
  return (
    <Card title="SOOP Membership Details">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name"><Input value={m.name} onChange={v => updateField('membership', 'name', v)} /></Field>
        <Field label="Price"><Input value={m.price} onChange={v => updateField('membership', 'price', v)} /></Field>
      </div>
      <Field label="Subtitle"><Input value={m.subtitle} onChange={v => updateField('membership', 'subtitle', v)} /></Field>
      <Field label="Title"><Input value={m.title} onChange={v => updateField('membership', 'title', v)} /></Field>
      <Field label="Description"><Textarea value={m.description} onChange={v => updateField('membership', 'description', v)} /></Field>
      <Field label="Perks (one per line)">
        <Textarea value={m.perks.join('\n')} rows={6}
          onChange={v => updateField('membership', 'perks', v.split('\n').filter(Boolean))} />
      </Field>
    </Card>
  );
}

function BAPanel({ data, setData }) {
  function updateBA(id, key, value) {
    setData(prev => ({
      ...prev,
      beforeAfter: prev.beforeAfter.map(b => b.id === id ? { ...b, [key]: value } : b),
    }));
  }

  function addBA() {
    const newId = Math.max(0, ...data.beforeAfter.map(b => b.id)) + 1;
    setData(prev => ({
      ...prev,
      beforeAfter: [...prev.beforeAfter, { id: newId, beforeImg: '', afterImg: '', title: 'New', desc: '' }],
    }));
  }

  function deleteBA(id) {
    setData(prev => ({ ...prev, beforeAfter: prev.beforeAfter.filter(b => b.id !== id) }));
  }

  return (
    <Card title="Treatment Results">
      <div className="space-y-4">
        {data.beforeAfter.map(b => (
          <div key={b.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Before Image URL"><Input value={b.beforeImg} onChange={v => updateBA(b.id, 'beforeImg', v)} placeholder="https://..." /></Field>
              <Field label="After Image URL"><Input value={b.afterImg} onChange={v => updateBA(b.id, 'afterImg', v)} placeholder="https://..." /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Title"><Input value={b.title} onChange={v => updateBA(b.id, 'title', v)} /></Field>
              <Field label="Subtitle"><Input value={b.desc} onChange={v => updateBA(b.id, 'desc', v)} /></Field>
            </div>
            <button onClick={() => deleteBA(b.id)} className="text-xs text-red-500 border border-red-200 px-3 py-1 rounded mt-2 hover:bg-red-50">Delete</button>
          </div>
        ))}
      </div>
      <button onClick={addBA} className="mt-4 border border-gray-200 rounded-lg px-5 py-2 text-sm font-medium hover:bg-gray-50">+ Add Comparison</button>
    </Card>
  );
}

function TestimonialsPanel({ data, setData }) {
  function updateT(id, key, value) {
    setData(prev => ({
      ...prev,
      testimonials: prev.testimonials.map(t => t.id === id ? { ...t, [key]: value } : t),
    }));
  }

  function addT() {
    const newId = Math.max(0, ...data.testimonials.map(t => t.id)) + 1;
    setData(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, { id: newId, text: '', author: '', location: '', rating: 5 }],
    }));
  }

  function deleteT(id) {
    setData(prev => ({ ...prev, testimonials: prev.testimonials.filter(t => t.id !== id) }));
  }

  return (
    <Card title="Guest Testimonials">
      <div className="space-y-4">
        {data.testimonials.map(t => (
          <div key={t.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <Field label="Quote"><Textarea value={t.text} onChange={v => updateT(t.id, 'text', v)} /></Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Author"><Input value={t.author} onChange={v => updateT(t.id, 'author', v)} /></Field>
              <Field label="Location"><Input value={t.location} onChange={v => updateT(t.id, 'location', v)} /></Field>
              <Field label="Rating (1-5)">
                <Input type="number" min="1" max="5" value={t.rating} onChange={v => updateT(t.id, 'rating', parseInt(v) || 5)} />
              </Field>
            </div>
            <button onClick={() => deleteT(t.id)} className="text-xs text-red-500 border border-red-200 px-3 py-1 rounded mt-2 hover:bg-red-50">Delete</button>
          </div>
        ))}
      </div>
      <button onClick={addT} className="mt-4 border border-gray-200 rounded-lg px-5 py-2 text-sm font-medium hover:bg-gray-50">+ Add Testimonial</button>
    </Card>
  );
}

function GalleryPanel({ data, setData }) {
  function updateImg(i, value) {
    setData(prev => {
      const g = [...prev.gallery]; g[i] = value;
      return { ...prev, gallery: g };
    });
  }
  function addImg() {
    setData(prev => ({ ...prev, gallery: [...prev.gallery, ''] }));
  }
  function deleteImg(i) {
    setData(prev => ({ ...prev, gallery: prev.gallery.filter((_, idx) => idx !== i) }));
  }

  return (
    <Card title="Gallery Images">
      <div className="space-y-3">
        {data.gallery.map((url, i) => (
          <div key={i} className="flex gap-3 items-center">
            <Input value={url} onChange={v => updateImg(i, v)} placeholder="Image URL" />
            <button onClick={() => deleteImg(i)} className="text-red-400 hover:text-red-600 shrink-0 text-lg">×</button>
          </div>
        ))}
      </div>
      <button onClick={addImg} className="mt-4 border border-gray-200 rounded-lg px-5 py-2 text-sm font-medium hover:bg-gray-50">+ Add Image</button>
    </Card>
  );
}

function FAQPanel({ data, setData }) {
  function updateFAQ(i, key, value) {
    setData(prev => {
      const f = [...prev.faq]; f[i] = { ...f[i], [key]: value };
      return { ...prev, faq: f };
    });
  }
  function addFAQ() {
    setData(prev => ({ ...prev, faq: [...prev.faq, { q: '', a: '' }] }));
  }
  function deleteFAQ(i) {
    setData(prev => ({ ...prev, faq: prev.faq.filter((_, idx) => idx !== i) }));
  }

  return (
    <Card title="Frequently Asked Questions">
      <div className="space-y-4">
        {data.faq.map((item, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <Field label="Question"><Input value={item.q} onChange={v => updateFAQ(i, 'q', v)} /></Field>
            <Field label="Answer"><Textarea value={item.a} onChange={v => updateFAQ(i, 'a', v)} /></Field>
            <button onClick={() => deleteFAQ(i)} className="text-xs text-red-500 border border-red-200 px-3 py-1 rounded hover:bg-red-50">Delete</button>
          </div>
        ))}
      </div>
      <button onClick={addFAQ} className="mt-4 border border-gray-200 rounded-lg px-5 py-2 text-sm font-medium hover:bg-gray-50">+ Add FAQ</button>
    </Card>
  );
}

function ContactPanel({ data, updateField }) {
  const c = data.contact;
  return (
    <Card title="Business Details">
      <Field label="Address"><Input value={c.address} onChange={v => updateField('contact', 'address', v)} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Phone"><Input value={c.phone} onChange={v => updateField('contact', 'phone', v)} /></Field>
        <Field label="Email"><Input value={c.email} onChange={v => updateField('contact', 'email', v)} /></Field>
      </div>
      <Field label="Hours"><Input value={c.hours} onChange={v => updateField('contact', 'hours', v)} /></Field>
      <Field label="Google Maps Embed URL" hint="Go to Google Maps → Share → Embed → Copy the src URL">
        <Input value={c.mapUrl} onChange={v => updateField('contact', 'mapUrl', v)} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Instagram URL"><Input value={c.instagram} onChange={v => updateField('contact', 'instagram', v)} /></Field>
        <Field label="Facebook URL"><Input value={c.facebook} onChange={v => updateField('contact', 'facebook', v)} /></Field>
      </div>
    </Card>
  );
}
