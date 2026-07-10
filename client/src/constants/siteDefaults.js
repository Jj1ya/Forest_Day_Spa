export const DEFAULT_SERVICE_CATEGORIES = [
  { key: 'facial', label: 'Facial', layout: 'cards' },
  { key: 'body', label: 'Body', layout: 'cards' },
  { key: 'scalp', label: 'Head Spa', layout: 'cards' },
  { key: 'waxing', label: 'Waxing', layout: 'waxing' },
  { key: 'combo', label: 'Combo', layout: 'cards' },
];

export const DEFAULT_NAVIGATION = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#membership', label: 'Membership' },
  { href: '#packages', label: 'Packages' },
  { href: '#results', label: 'Results' },
  { href: '#contact', label: 'Contact' },
];

export const DEFAULT_SERVICES_SECTION = {
  label: 'Our Services',
  title: 'Treatments Tailored for You',
  description:
    'From K-beauty facials to tension-melting body work, restorative head spa, smooth waxing, and combo packages — every treatment is a journey to renewal.',
};

export function getServiceCategories(data) {
  return data?.serviceCategories?.length ? data.serviceCategories : DEFAULT_SERVICE_CATEGORIES;
}

export function getNavigation(data) {
  return data?.navigation?.length ? data.navigation : DEFAULT_NAVIGATION;
}

export function getServicesSection(data) {
  return { ...DEFAULT_SERVICES_SECTION, ...data?.servicesSection };
}

export function categoryLabel(categories, key) {
  return categories.find(c => c.key === key)?.label || key;
}

export function groupServicesByCategory(services, categories) {
  const groups = [];
  for (const cat of categories) {
    const items = services.filter(s => s.category === cat.key);
    if (items.length) groups.push({ category: cat, items });
  }
  const known = new Set(categories.map(c => c.key));
  const other = services.filter(s => !known.has(s.category));
  if (other.length) {
    groups.push({
      category: { key: 'other', label: 'Other', layout: 'cards' },
      items: other,
    });
  }
  return groups;
}

export function serviceOptionLabel(service) {
  const parts = [service.name];
  if (service.duration) parts.push(`(${service.duration})`);
  else if (service.price) parts.push(`(${service.price})`);
  return parts.join(' ');
}
