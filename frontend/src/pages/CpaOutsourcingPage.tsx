import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  ArrowUpRight,
  Check,
  ShieldCheck,
  Cpu,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  Lock,
  Calendar,
  CheckCircle2,
  FileCheck2,
  Activity,
} from 'lucide-react';
import { getServicesByCategory } from '../data/services';
import { TimelineDiagram } from '../components/graphics/TimelineDiagram';
import { DataFlowDiagram } from '../components/graphics/DataFlowDiagram';
import { usePageContent } from '../hooks/usePageContent';
import { EditableSectionContainer } from '../components/EditableSectionContainer';
import { EditableElement } from '../components/EditableElement';
import { settingsApi } from '../api/settings';
import { defaultProductionDashboardConfig, ProductionDashboardConfig } from '../admin/pages/ProductionDashboardManager';
import './CpaOutsourcingPage.css';

const SOFTWARE_STACK = [
  'UltraTax CS',
  'ProConnect Tax',
  'Drake Software',
  'Lacerte',
  'CCH Axcess',
  'QuickBooks Online',
  'Xero',
  'NetSuite',
  'Bill.com',
  'Gusto & ADP',
];

export function CpaOutsourcingPage() {
  const navigate = useNavigate();
  const cpaServices = getServicesByCategory('cpa');
  const { getSection, isSectionEnabled } = usePageContent('cpa-outsourcing');

  const heroSection = getSection('hero');
  const overviewSection = getSection('overview');
  const softwareSection = getSection('software_stack');
  const offeringsSection = getSection('offerings');
  const timelineSection = getSection('timeline');
  const dataFlowSection = getSection('data_flow');
  const [prodConfig, setProdConfig] = useState<ProductionDashboardConfig>(defaultProductionDashboardConfig);

  useEffect(() => {
    settingsApi.getAll()
      .then((res) => {
        if (res && res.production_dashboard_config) {
          setProdConfig({ ...defaultProductionDashboardConfig, ...res.production_dashboard_config });
        }
      })
      .catch(() => {});
  }, []);
  const ctaSection = getSection('cta');
  const heroContent = heroSection?.parsedContent || {};
  const softwareTools = Array.isArray(softwareSection?.parsedContent?.items) && softwareSection.parsedContent.items.length
    ? softwareSection.parsedContent.items
    : SOFTWARE_STACK;

  const heroEyebrow = heroSection?.parsedContent?.eyebrow || heroSection?.subheading || 'US Tax · Bookkeeping · CPA Outsourcing';
  const heroTitle = heroSection?.title || 'US Tax Preparation Outsourcing for CPA Firms';
  const heroDesc = heroSection?.description || 'Extend your preparation capacity without expanding your in-house team.';

  const handleRequestScope = (slug: string) => {
    navigate(`/book-consultation?category=cpa&service=${encodeURIComponent(slug)}`);
  };

  const handlePagePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100;
    const y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100;
    event.currentTarget.style.setProperty('--cpa-pointer-x', `${x}%`);
    event.currentTarget.style.setProperty('--cpa-pointer-y', `${y}%`);
  };

  const handleCardPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / Math.max(rect.width, 1);
    const y = (event.clientY - rect.top) / Math.max(rect.height, 1);
    event.currentTarget.style.setProperty('--cpa-tilt-x', `${(0.5 - y) * 5.5}deg`);
    event.currentTarget.style.setProperty('--cpa-tilt-y', `${(x - 0.5) * 6.5}deg`);
    event.currentTarget.style.setProperty('--cpa-glow-x', `${x * 100}%`);
    event.currentTarget.style.setProperty('--cpa-glow-y', `${y * 100}%`);
  };

  const resetCardPointer = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--cpa-tilt-x', '0deg');
    event.currentTarget.style.setProperty('--cpa-tilt-y', '0deg');
    event.currentTarget.style.setProperty('--cpa-glow-x', '50%');
    event.currentTarget.style.setProperty('--cpa-glow-y', '50%');
  };

  return (
    <main
      className="cpa-outsourcing-page"
      style={{ '--cpa-office-image': 'url("/cpa-outsourcing-office-bg.png")' } as React.CSSProperties & { '--cpa-office-image': string }}
      onPointerMove={handlePagePointerMove}
      aria-label="CPA outsourcing services"
    >
      <div className="cpa-page-atmosphere cpa-atmosphere-one" aria-hidden="true" />
      <div className="cpa-page-atmosphere cpa-atmosphere-two" aria-hidden="true" />
      <div className="cpa-page-pointer-glow" aria-hidden="true" />

      <div className="cpa-page-content">
        {/* Premium hero */}
        <EditableSectionContainer sectionKey="hero" sectionTitle="CPA Outsourcing Hero" isEnabled={isSectionEnabled('hero')} sectionData={heroSection}>
        <section className="cpa-hero">
          <div className="cpa-hero-copy">
            <EditableElement
              sectionKey="hero"
              elementKey="subheading"
              elementType="subheading"
              label="CPA Eyebrow"
              value={heroEyebrow}
            >
              <div className="cpa-eyebrow">
                <span className="cpa-eyebrow-icon"><Building2 size={15} /></span>
                <span>{heroEyebrow}</span>
                <span className="cpa-live-dot" aria-hidden="true" />
              </div>
            </EditableElement>

            <EditableElement
              sectionKey="hero"
              elementKey="title"
              elementType="heading"
              label="CPA Hero Headline"
              value={heroTitle}
            >
              <h1>
                {heroTitle.includes('White-Label') ? (
                  <>
                    {heroTitle.split('White-Label')[0]}
                    <span className="cpa-title-gradient">White-Label</span>
                    {heroTitle.split('White-Label').slice(1).join('White-Label')}
                  </>
                ) : heroTitle}
              </h1>
            </EditableElement>

            <EditableElement
              sectionKey="hero"
              elementKey="description"
              elementType="paragraph"
              label="CPA Lead Description"
              value={heroDesc}
            >
              <p className="cpa-hero-description">
                {heroDesc}
              </p>
            </EditableElement>

            <div className="cpa-hero-proof-row">
              <div className="cpa-proof-item">
                <span className="cpa-proof-icon"><ShieldCheck size={17} /></span>
                <span><strong>{heroContent.proof1Title || 'Quality-first'}</strong><small>{heroContent.proof1Description || 'Diagnostic reviews'}</small></span>
              </div>
              <div className="cpa-proof-item">
                <span className="cpa-proof-icon"><Clock size={17} /></span>
                <span><strong>{heroContent.proof2Title || 'Reliable turnaround'}</strong><small>{heroContent.proof2Description || 'Deadline-focused delivery'}</small></span>
              </div>
              <div className="cpa-proof-item">
                <span className="cpa-proof-icon"><Lock size={17} /></span>
                <span><strong>{heroContent.proof3Title || 'Secure workflows'}</strong><small>{heroContent.proof3Description || 'Confidential by design'}</small></span>
              </div>
            </div>

            <div className="cpa-hero-actions">
              <EditableElement
                sectionKey="hero"
                elementKey="exploreButton"
                elementType="button"
                label="Explore Outsourcing CTA"
                value={heroContent.primaryButtonText || 'Explore outsourcing'}
              >
                <button
                  type="button"
                  className="cpa-button cpa-button-primary"
                  onClick={() => handleRequestScope('tax-prep-outsourcing')}
                >
                  {heroContent.primaryButtonText || 'Explore outsourcing'} <ArrowRight size={16} />
                </button>
              </EditableElement>
              <a className="cpa-text-link" href="#cpa-offerings">
                {heroContent.secondaryButtonText || 'View all capabilities'} <ArrowUpRight size={16} />
              </a>
            </div>
          </div>

          {/* CSS-only financial operations illustration */}
          <div className="cpa-hero-visual" aria-label="Illustration of a tax workflow dashboard">
            <div className="cpa-visual-halo cpa-visual-halo-a" />
            <div className="cpa-visual-halo cpa-visual-halo-b" />
            <div className="cpa-visual-orbit cpa-visual-orbit-a" />
            <div className="cpa-visual-orbit cpa-visual-orbit-b" />

            <div className="cpa-dashboard-card">
              <div className="cpa-dashboard-topbar">
                <div className="cpa-dashboard-brand"><span /> {prodConfig.brandTag}</div>
                <div className="cpa-window-dots"><i /><i /><i /></div>
              </div>
              <div className="cpa-dashboard-title-row">
                <div><small>{prodConfig.kicker}</small><strong>{prodConfig.title}</strong></div>
                <span className="cpa-dashboard-status"><i /> {prodConfig.statusText}</span>
              </div>
              <div className="cpa-dashboard-metrics">
                <div><small>{prodConfig.stat1Title}</small><strong>{prodConfig.stat1Value}</strong><em>{prodConfig.stat1Change}</em></div>
                <div><small>{prodConfig.stat2Title}</small><strong>{prodConfig.stat2Value}</strong><em>{prodConfig.stat2Change}</em></div>
              </div>
              <div className="cpa-chart-heading"><span>{prodConfig.chartTitle}</span><small>{prodConfig.chartSubtitle}</small></div>
              <div className="cpa-dashboard-chart">
                <div className="cpa-chart-grid"><i /><i /><i /><i /></div>
                <div className="cpa-chart-bars">
                  {prodConfig.chartData.map((pt, i) => (
                    <i key={i} style={{ height: `${pt.value}%` }} title={`${pt.day}: ${pt.value}%`} />
                  ))}
                </div>
                <svg className="cpa-chart-trace" viewBox="0 0 280 90" preserveAspectRatio="none" aria-hidden="true">
                  <defs><linearGradient id="cpaChartGradient" x1="0" x2="1"><stop offset="0%" stopColor="#24b8b0" /><stop offset="55%" stopColor="#6c91ee" /><stop offset="100%" stopColor="#e4b65c" /></linearGradient></defs>
                  <path d="M5 72 C32 64, 36 53, 60 58 S90 36, 116 46 S149 54, 170 31 S211 44, 231 21 S258 25, 275 8" fill="none" stroke="url(#cpaChartGradient)" strokeWidth="3" strokeLinecap="round" />
                  <path d="M5 72 C32 64, 36 53, 60 58 S90 36, 116 46 S149 54, 170 31 S211 44, 231 21 S258 25, 275 8 L275 90 L5 90Z" fill="url(#cpaChartGradient)" opacity=".12" />
                </svg>
              </div>
              <div className="cpa-dashboard-footer"><span><i /> {prodConfig.footerNote}</span><span>{prodConfig.footerTimestamp}</span></div>
            </div>

            <div className="cpa-floating-badge cpa-floating-badge-top">
              <span className="cpa-floating-icon"><FileCheck2 size={19} /></span>
              <span><strong>{prodConfig.cardTopTitle}</strong><small>{prodConfig.cardTopSubtitle}</small></span>
              <CheckCircle2 size={16} className="cpa-badge-check" />
            </div>

            <div className="cpa-floating-badge cpa-floating-badge-bottom">
              <span className="cpa-floating-icon cpa-floating-icon-gold"><Activity size={19} /></span>
              <span><strong>{prodConfig.cardBottomTitle}</strong><small>{prodConfig.cardBottomSubtitle}</small></span>
              <Sparkles size={16} className="cpa-badge-sparkle" />
            </div>

            <div className="cpa-visual-caption"><span /> {prodConfig.caption} <ArrowUpRight size={13} /></div>
          </div>

          <div className="cpa-hero-bottomline">
            <div><span className="cpa-bottomline-icon"><Layers size={17} /></span><span><strong>Flexible capacity</strong><small>Scale with demand</small></span></div>
            <div><span className="cpa-bottomline-icon"><ShieldCheck size={17} /></span><span><strong>Review-led delivery</strong><small>Consistent workpapers</small></span></div>
            <div><span className="cpa-bottomline-icon"><Cpu size={17} /></span><span><strong>Tech-enabled</strong><small>Your existing software</small></span></div>
          </div>
        </section>

        {/* Software ecosystem */}
        </EditableSectionContainer>

        <EditableSectionContainer sectionKey="software_stack" sectionTitle="Software Stack" isEnabled={isSectionEnabled('software_stack')} sectionData={softwareSection}>
        <section className="cpa-software-section" aria-labelledby="cpa-software-heading">
          <div className="cpa-software-intro">
            <div className="cpa-section-icon"><Cpu size={18} /></div>
            <div>
              <h2 id="cpa-software-heading">{softwareSection?.title || 'Fits your existing tech stack'}</h2>
              <p>{softwareSection?.description || 'Native compatibility with your firm’s tax, accounting, and payroll tools.'}</p>
            </div>
          </div>
          <div className="cpa-software-chips">
            {softwareTools.map((sw: string, idx: number) => (
              <span className="cpa-software-chip" key={sw} style={{ '--chip-index': idx } as React.CSSProperties & { '--chip-index': number }}>
                <i aria-hidden="true" />{sw}
              </span>
            ))}
          </div>
        </section>

        {/* CPA service offering cards */}
        </EditableSectionContainer>

        <EditableSectionContainer sectionKey="offerings" sectionTitle="CPA Firm Offerings" isEnabled={isSectionEnabled('offerings')} sectionData={offeringsSection}>
        <section className="cpa-section cpa-offerings-section" id="cpa-offerings" aria-labelledby="cpa-offerings-heading">
          <div className="cpa-section-heading">
            <div>
              <span className="cpa-section-kicker"><Sparkles size={13} /> {offeringsSection?.subheading || 'Specialized capabilities'}</span>
              <h2 id="cpa-offerings-heading">{offeringsSection?.title || <>The <span>10 Core CPA Firm Offerings</span></>}</h2>
              <p>{offeringsSection?.description || 'Select a specialized capability to review the workflow or reserve production capacity.'}</p>
            </div>
            <div className="cpa-section-count"><strong>{String(cpaServices.length).padStart(2, '0')}</strong><span>service<br />capabilities</span></div>
          </div>

          {cpaServices.length > 0 ? (
            <div className="cpa-services-grid">
              {cpaServices.map((service, idx) => (
                <article
                  key={service.id}
                  className="cpa-service-card"
                  onPointerMove={handleCardPointerMove}
                  onPointerLeave={resetCardPointer}
                >
                  <div className="cpa-card-light" aria-hidden="true" />
                  <div className="cpa-service-card-top">
                    <span className="cpa-offering-number">OFFERING {String(idx + 1).padStart(2, '0')}</span>
                    <span className="cpa-turnaround"><Clock size={13} /> {service.turnaroundTime}</span>
                  </div>

                  <div className="cpa-service-icon"><Building2 size={20} /></div>
                  <h3>{service.name}</h3>
                  <p className="cpa-service-description">{service.shortDescription}</p>

                  <div className="cpa-deliverables-label"><span /> Typical deliverables</div>
                  <ul className="cpa-deliverables-list">
                    {service.deliverables.slice(0, 3).map((deliverable, deliverableIndex) => (
                      <li key={deliverableIndex}><span className="cpa-deliverable-check"><Check size={11} /></span><span>{deliverable}</span></li>
                    ))}
                  </ul>

                  <div className="cpa-service-card-actions">
                    <button type="button" className="cpa-details-button" onClick={() => navigate(`/services/${service.slug}`)}>
                      View details &amp; FAQ <ArrowUpRight size={14} />
                    </button>
                    <button type="button" className="cpa-scope-button" onClick={() => handleRequestScope(service.slug)} aria-label={`Scope capacity for ${service.name}`}>
                      Scope <ArrowRight size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="cpa-empty-state">
              <Layers size={24} />
              <strong>No CPA offerings are configured yet.</strong>
              <span>Check the CPA category entries in src/data/services.</span>
            </div>
          )}
        </section>

        {/* Existing interactive diagrams */}
        </EditableSectionContainer>

        <EditableSectionContainer sectionKey="timeline" sectionTitle="Delivery Timeline" isEnabled={isSectionEnabled('timeline')} sectionData={timelineSection}>
        <section className="cpa-diagram-section" aria-label={timelineSection?.title || 'Annual sprint timeline'}>
          <div className="cpa-diagram-heading">
            <span className="cpa-section-kicker"><Calendar size={13} /> {timelineSection?.subheading || 'Delivery planning'}</span>
            <h2>{timelineSection?.title || <>From intake to <span>delivery</span></>}</h2>
            <p>{timelineSection?.description || 'A structured workflow keeps deadlines visible and reviews consistent.'}</p>
          </div>
          <div className="cpa-diagram-frame"><TimelineDiagram cmsContent={timelineSection} /></div>
        </section>
        </EditableSectionContainer>

        {isSectionEnabled('overview') && (
          <EditableSectionContainer sectionKey="overview" sectionTitle="How CPA Outsourcing Works" sectionData={overviewSection}>
            <section className="cpa-section">
              <div className="cpa-diagram-heading">
                <h2>{overviewSection?.title || 'How CPA Outsourcing Works'}</h2>
                <p>{overviewSection?.description || 'Seamless integration with your tax software and workflow.'}</p>
              </div>
            </section>
          </EditableSectionContainer>
        )}

        <EditableSectionContainer sectionKey="data_flow" sectionTitle="Enquiry Routing" isEnabled={isSectionEnabled('data_flow')} sectionData={dataFlowSection}>
        <section className="cpa-diagram-section" aria-label={dataFlowSection?.title || 'Enquiry routing'}>
          <div className="cpa-diagram-heading">
            <span className="cpa-section-kicker"><Activity size={13} /> {dataFlowSection?.subheading || 'Service routing'}</span>
            <h2>{dataFlowSection?.title || <>Enquiry routing</>}</h2>
            <p>{dataFlowSection?.description || 'Choose a service area to see which CPA team will receive your request.'}</p>
          </div>
          <div className="cpa-diagram-frame"><DataFlowDiagram cmsContent={dataFlowSection} /></div>
        </section>

        {/* Pilot CTA */}
        </EditableSectionContainer>

        <EditableSectionContainer sectionKey="cta" sectionTitle="CPA Outsourcing Call to Action" isEnabled={isSectionEnabled('cta')} sectionData={ctaSection}>
        <section className="cpa-pilot-cta">
          <div className="cpa-cta-light-orb" aria-hidden="true" />
          <div className="cpa-cta-emblem"><ShieldCheck size={27} /><span /></div>
          <div className="cpa-cta-copy">
            <span className="cpa-cta-kicker"><Lock size={13} /> {ctaSection?.subheading || 'Zero-Commitment Trial Available'}</span>
            <h2>
              {ctaSection?.title ? (
                ctaSection.title
              ) : (
                <>Test our workpaper quality with <span>3 pilot returns</span></>
              )}
            </h2>
            <p>{ctaSection?.description || 'Experience our two-tier review rigor, diagnostic notes, and overnight turnaround before committing to seasonal capacity.'}</p>
            <div className="cpa-cta-assurances">
              <span><CheckCircle2 size={14} /> Two-tier review</span>
              <span><CheckCircle2 size={14} /> Diagnostic notes</span>
              <span><CheckCircle2 size={14} /> Secure workflow</span>
            </div>
          </div>
          <button type="button" className="cpa-button cpa-button-cta" onClick={() => handleRequestScope('tax-prep-outsourcing')}>
            {ctaSection?.parsedContent?.buttonText || 'Request 3-Return Pilot'} <ArrowRight size={16} />
          </button>
        </section>
        </EditableSectionContainer>

        <footer className="cpa-page-footnote"><span className="cpa-footnote-dot" /> Flexible capacity for modern CPA practices <span>•</span> Built around your workflow</footer>
      </div>
    </main>
  );
}

export default CpaOutsourcingPage;
