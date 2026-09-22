import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { NavRoute } from '../types';

interface LegalViewProps {
  route: 'impressum' | 'terms' | 'privacy' | 'disclaimer';
  onBack: () => void;
  onNavigate: (route: NavRoute) => void;
}

export const LegalView: React.FC<LegalViewProps> = ({ route, onBack, onNavigate }) => {
  const content = {
    impressum: {
      title: 'Imprint (Impressum)',
      subtitle: 'Legal information and company details pursuant to applicable regulations.',
      sections: [
        {
          heading: 'Information according to legal requirements',
          body: [
            'FLW (orderflw.com)',
            'Educational Orderflow & Auction Market Theory Platform',
            'Contact: support@orderflw.com'
          ]
        },
        {
          heading: 'Responsible for Content',
          body: [
            'FLW Media & Trading Education Team',
            'Discord: https://discord.gg/bsuM3urQCX',
            'YouTube: https://www.youtube.com/@orderflw'
          ]
        },
        {
          heading: 'Disclaimer',
          body: [
            'The contents of our pages have been created with the utmost care. However, we cannot guarantee the accuracy, completeness, or timeliness of the contents.'
          ]
        }
      ]
    },
    terms: {
      title: 'Terms of Service',
      subtitle: 'Please review the terms and conditions governing the use of orderflw.com.',
      sections: [
        {
          heading: '1. Acceptance of Terms',
          body: [
            'By accessing or using FLW (orderflw.com), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.'
          ]
        },
        {
          heading: '2. Educational Purpose Only',
          body: [
            'FLW provides free educational content regarding orderflow, auction market theory, and market microstructure. Nothing on this website constitutes financial, investment, legal, or tax advice. All trading decisions are made solely at your own risk.'
          ]
        },
        {
          heading: '3. Intellectual Property',
          body: [
            'All text, graphics, user interfaces, visual interfaces, diagrams, and educational models provided on this site are the intellectual property of FLW and its creators.'
          ]
        },
        {
          heading: '4. Limitation of Liability',
          body: [
            'In no event shall FLW or its contributors be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.'
          ]
        }
      ]
    },
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'How we collect, handle, and protect your information.',
      sections: [
        {
          heading: '1. Information We Collect',
          body: [
            'We respect your privacy. FLW does not sell or distribute personal information to third parties.',
            'When you save journal entries or checklists locally, that data is stored directly in your browser client storage (LocalStorage) and remains on your device.'
          ]
        },
        {
          heading: '2. Analytics & Cookies',
          body: [
            'We may use privacy-respecting anonymous telemetry to improve site performance and user experience. No personal identifying information is tracked.'
          ]
        },
        {
          heading: '3. Third-Party Links',
          body: [
            'Our website contains links to external platforms such as Discord, YouTube, and select prop firm evaluation programs. We are not responsible for the privacy practices of external sites.'
          ]
        }
      ]
    },
    disclaimer: {
      title: 'Risk Disclaimer',
      subtitle: 'Important financial risk disclosures regarding trading and leveraged instruments.',
      sections: [
        {
          heading: 'Financial & Trading Risk Warning',
          body: [
            'FLW provides free educational content on orderflow trading. All content on this website is for educational and informational purposes only and should not be considered financial or investment advice. We are not licensed financial advisors, and nothing shared here constitutes a recommendation to buy, sell, or hold any financial instrument.',
            'Trading futures, equities, forex, and leveraged financial products involves substantial risk of loss and is not suitable for every investor. An investor could potentially lose all or more than their initial investment.',
            'Hypothetical or simulated performance results have certain inherent limitations. Unlike actual performance records, simulated results do not represent actual trading. No representation is being made that any account will or is likely to achieve profits or losses similar to those discussed on this platform.'
          ]
        }
      ]
    }
  };

  const current = content[route];

  return (
    <div className="w-full min-h-screen pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Back navigation */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[13px] text-[var(--color-ink-3)] hover:text-white mb-8 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        <div className="border-b border-[var(--color-hair-1)] pb-8 mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-ink-1)] tracking-tight">
            {current.title}
          </h1>
          <p className="text-[14px] text-[var(--color-ink-3)] mt-2">
            {current.subtitle}
          </p>
        </div>

        <div className="space-y-8">
          {current.sections.map((sec, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-hair-1)]"
            >
              <h2 className="text-[16px] font-semibold text-[var(--color-ink-1)] mb-3">
                {sec.heading}
              </h2>
              <div className="space-y-2 text-[13.5px] text-[var(--color-ink-3)] leading-relaxed">
                {sec.body.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Nav to other legal pages */}
        <div className="mt-12 pt-6 border-t border-[var(--color-hair-1)] flex flex-wrap gap-4 text-[13px] text-[var(--color-ink-4)]">
          <button
            onClick={() => onNavigate('impressum')}
            className={`cursor-pointer transition-colors ${route === 'impressum' ? 'text-white font-medium' : 'hover:text-[var(--color-ink-2)]'}`}
          >
            Imprint
          </button>
          <span>·</span>
          <button
            onClick={() => onNavigate('terms')}
            className={`cursor-pointer transition-colors ${route === 'terms' ? 'text-white font-medium' : 'hover:text-[var(--color-ink-2)]'}`}
          >
            Terms
          </button>
          <span>·</span>
          <button
            onClick={() => onNavigate('privacy')}
            className={`cursor-pointer transition-colors ${route === 'privacy' ? 'text-white font-medium' : 'hover:text-[var(--color-ink-2)]'}`}
          >
            Privacy
          </button>
          <span>·</span>
          <button
            onClick={() => onNavigate('disclaimer')}
            className={`cursor-pointer transition-colors ${route === 'disclaimer' ? 'text-white font-medium' : 'hover:text-[var(--color-ink-2)]'}`}
          >
            Disclaimer
          </button>
        </div>
      </div>
    </div>
  );
};
