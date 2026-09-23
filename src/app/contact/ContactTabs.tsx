'use client';

import { useState } from 'react';
import { ContactForm } from '@/components/forms/ContactForm';
import { VolunteerForm } from '@/components/forms/VolunteerForm';
import { PartnershipForm } from '@/components/forms/PartnershipForm';

const tabs = [
  { key: 'message', label: 'Message' },
  { key: 'benevole', label: 'Devenir bénévole' },
  { key: 'partenariat', label: 'Partenariat' }
] as const;

type TabKey = (typeof tabs)[number]['key'];

export function ContactTabs() {
  const [active, setActive] = useState<TabKey>('message');

  return (
    <div>
      <div role="tablist" aria-label="Type de demande" className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            id={`tab-${tab.key}`}
            aria-selected={active === tab.key}
            aria-controls={`panel-${tab.key}`}
            onClick={() => setActive(tab.key)}
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
              active === tab.key
                ? 'bg-ol-ember-ink text-ol-white'
                : 'border border-ol-line-strong text-ol-charcoal hover:border-ol-ember'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8 max-w-2xl">
        <div
          role="tabpanel"
          id="panel-message"
          aria-labelledby="tab-message"
          hidden={active !== 'message'}
        >
          <ContactForm />
        </div>
        <div
          role="tabpanel"
          id="panel-benevole"
          aria-labelledby="tab-benevole"
          hidden={active !== 'benevole'}
        >
          <VolunteerForm />
        </div>
        <div
          role="tabpanel"
          id="panel-partenariat"
          aria-labelledby="tab-partenariat"
          hidden={active !== 'partenariat'}
        >
          <PartnershipForm />
        </div>
      </div>
    </div>
  );
}
