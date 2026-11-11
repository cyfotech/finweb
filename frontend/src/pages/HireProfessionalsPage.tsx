import { useState, useEffect } from 'react';
import type { PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import {
  UserCheck,
  Star,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  Briefcase,
  Cpu,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { getHireRolesWithOverrides } from '../data/hireRoles';
import { EditableElement } from '../components/EditableElement';
import { usePageContent } from '../hooks/usePageContent';
import { EditableSectionContainer } from '../components/EditableSectionContainer';
import { settingsApi } from '../api/settings';
import { defaultTaxIntelligenceConfig, TaxIntelligenceConfig } from '../admin/pages/TaxIntelligenceManager';
import './HireProfessionalsPage.css';

export function HireProfessionalsPage() {
  const reduceMotion = useReducedMotion();
  const { getSection, isSectionEnabled } = usePageContent('hire-professionals');
  const [taxConfig, setTaxConfig] = useState<TaxIntelligenceConfig>(defaultTaxIntelligenceConfig);

  useEffect(() => {
    settingsApi.getAll()
      .then((res) => {
        if (res && res.tax_intelligence_config) {
          setTaxConfig({ ...defaultTaxIntelligenceConfig, ...res.tax_intelligence_config });
        }
      })
      .catch(() => {});
  }, []);

  const heroSection = getSection('hero');
  const rolesSection = getSection('professionals_grid');
  const ctaSection = getSection('cta');
  const roles = getHireRolesWithOverrides(rolesSection?.parsedContent?.roles);
  const eyebrowText = heroSection?.parsedContent?.eyebrow || 'Dedicated Staff Augmentation';
  const headlineText = heroSection?.title || 'Hire Dedicated US-Trained Tax & Accounting Professionals';
  const descriptionText = heroSection?.description || 'Deploy pre-vetted Enrolled Agents, CPAs, and CAS Controllers directly into your workflow. Seamless time-zone overlap, zero recruitment friction, and 72-hour project ramp-up.';

  const handleBrowseRoles = () => {
    document.getElementById('hp-roles')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCardPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / Math.max(rect.width, 1);
    const y = (event.clientY - rect.top) / Math.max(rect.height, 1);
    event.currentTarget.style.setProperty('--hp-tilt-x', `${(0.5 - y) * 7}deg`);
    event.currentTarget.style.setProperty('--hp-tilt-y', `${(x - 0.5) * 8}deg`);
    event.currentTarget.style.setProperty('--hp-shine-x', `${x * 100}%`);
    event.currentTarget.style.setProperty('--hp-shine-y', `${y * 100}%`);
  };

  const resetCardPointer = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--hp-tilt-x', '0deg');
    event.currentTarget.style.setProperty('--hp-tilt-y', '0deg');
    event.currentTarget.style.setProperty('--hp-shine-x', '50%');
    event.currentTarget.style.setProperty('--hp-shine-y', '50%');
  };

  return (
    <main
      className="hire-pro-page"
      aria-label="Hire dedicated tax and accounting professionals"
    >
      <div className="hp-ambient hp-ambient-one" aria-hidden="true" />
      <div className="hp-ambient hp-ambient-two" aria-hidden="true" />

      <div className="hp-content">
        {/* Hero */}
        <EditableSectionContainer sectionKey="hero" sectionTitle="Professional Hiring Hero" isEnabled={isSectionEnabled('hero')} sectionData={heroSection}>
        <section className="hp-hero">
          <div className="hp-hero-copy">
            <EditableElement
              sectionKey="hero"
              elementKey="eyebrow"
              elementType="subheading"
              label="Hire Pros Eyebrow"
              value={eyebrowText}
            >
              <div className="hp-eyebrow">
                <UserCheck size={15} aria-hidden="true" />
                <span>{eyebrowText}</span>
                <span className="hp-eyebrow-pulse" aria-hidden="true" />
              </div>
            </EditableElement>

            <EditableElement
              sectionKey="hero"
              elementKey="title"
              elementType="heading"
              label="Hire Pros Headline"
              value={headlineText}
            >
              <h1>
                {headlineText}
              </h1>
            </EditableElement>

            <EditableElement
              sectionKey="hero"
              elementKey="description"
              elementType="paragraph"
              label="Hire Pros Description"
              value={descriptionText}
            >
              <p className="hp-hero-description">
                {descriptionText}
              </p>
            </EditableElement>

            <div className="hp-trust-row" aria-label="Our strengths">
              <div className="hp-trust-item"><span className="hp-trust-icon"><ShieldCheck size={17} /></span><span>Pre-Vetted Professionals</span></div>
              <div className="hp-trust-item"><span className="hp-trust-icon"><Star size={17} /></span><span>US Tax Law Expertise</span></div>
              <div className="hp-trust-item"><span className="hp-trust-icon"><Briefcase size={17} /></span><span>Seamless Integration</span></div>
            </div>
          </div>

          {/* CSS-built 3D accounting illustration; dynamically managed via Tax Intelligence Manager */}
          <div className="hp-hero-art" aria-hidden="true">
            <div className="hp-orbit hp-orbit-one" />
            <div className="hp-orbit hp-orbit-two" />
            <div className="hp-glass-panel hp-panel-back">
              <div className="hp-panel-topline"><span /><span /><span /></div>
              <div className="hp-panel-heading"><span className="hp-mini-symbol">{taxConfig.coin.symbol || '$'}</span><span>{taxConfig.title}</span></div>
              <div className="hp-chart-bars">
                {taxConfig.chartBars.filter(b => b.enabled).map((b) => (
                  <i key={b.id} style={{ height: `${b.value}%`, background: b.color }} title={b.label} />
                ))}
              </div>
              <div className="hp-chart-line"><span /><span /><span /><span /><span /></div>
              <div className="hp-panel-footer"><span>{taxConfig.annualReviewLabel}</span><b>{taxConfig.annualReviewMetric}</b></div>
            </div>
            <div className="hp-floating-document hp-document-one">
              <div className="hp-doc-seal"><ShieldCheck size={20} /></div>
              <strong>{taxConfig.complianceCard.title}</strong><span /><span /><span className="hp-doc-short" />
              <small>{taxConfig.complianceCard.subtitle}</small>
            </div>
            <div className="hp-floating-document hp-document-two">
              <div className="hp-doc-spark"><Star size={15} /></div>
              <strong>{taxConfig.talentCard.title}</strong><span /><span /><span className="hp-doc-short" />
              <small>{taxConfig.talentCard.subtitle}</small>
            </div>
            {taxConfig.coin.enabled && (
              <div className="hp-floating-coin"><span>{taxConfig.coin.symbol}</span></div>
            )}
            <div className="hp-art-caption"><span className="hp-caption-dot" /> {taxConfig.caption} <ArrowUpRight size={14} /></div>
          </div>

          <div className="hp-hero-metrics">
            <div className="hp-metric"><span className="hp-metric-icon"><Clock size={17} /></span><div><strong>72-hour</strong><small>Rapid deployment</small></div></div>
            <div className="hp-metric"><span className="hp-metric-icon"><ShieldCheck size={17} /></span><div><strong>Pre-screened</strong><small>Qualified professionals</small></div></div>
            <div className="hp-metric"><span className="hp-metric-icon"><Cpu size={17} /></span><div><strong>Workflow-ready</strong><small>Software proficient</small></div></div>
          </div>
        </section>
        </EditableSectionContainer>

        <EditableSectionContainer sectionKey="professionals_grid" sectionTitle="Professional Roles" isEnabled={isSectionEnabled('professionals_grid')} sectionData={rolesSection}>
        <section className="hp-section hp-role-catalogue" id="hp-roles" aria-labelledby="hp-roles-heading">
          <div className="hp-section-heading hp-section-heading-split">
            <div>
              <span className="hp-section-kicker">{rolesSection?.subheading || 'Build your next chapter'}</span>
              <h2 id="hp-roles-heading">{rolesSection?.title || <>Explore professional <span>roles</span></>}</h2>
              <p>{rolesSection?.description || 'Choose a specialist path and learn about the work, tools, and experience that will help you thrive.'}</p>
            </div>
            <div className="hp-heading-note"><span className="hp-heading-note-dot" /> Four disciplines. One quality standard.</div>
          </div>

          <div className="hp-role-card-grid">
            {roles.map((role, index) => {
              const RoleIcon = role.icon;
              return (
                <motion.div
                  key={role.slug}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.18 }}
                  transition={{ duration: reduceMotion ? 0 : 0.48, delay: reduceMotion ? 0 : index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={`/hire-professionals/${role.slug}`}
                    className={`hp-role-card hp-role-card-${index + 1}`}
                    onPointerMove={handleCardPointerMove}
                    onPointerLeave={resetCardPointer}
                  >
                    <span className="hp-role-card-index">0{index + 1} / SPECIALIST PATH</span>
                    <span className="hp-role-card-icon"><RoleIcon size={25} strokeWidth={1.7} /></span>
                    <h3>{role.title}</h3>
                    <p>{role.cardDescription}</p>
                    <span className="hp-role-card-specialty"><Sparkles size={13} />{role.specialization}</span>
                    <span className="hp-role-card-skills">{role.skills.slice(0, 3).map(skill => <i key={skill}>{skill}</i>)}</span>
                    <span className="hp-role-card-link">Explore role <ArrowUpRight size={16} /></span>
                    <span className="hp-role-card-watermark" aria-hidden="true"><RoleIcon size={110} /></span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Deployment CTA */}
        </EditableSectionContainer>

        <EditableSectionContainer sectionKey="cta" sectionTitle="Hiring Call to Action" isEnabled={isSectionEnabled('cta')} sectionData={ctaSection}>
        <section className="hp-deployment-cta">
          <div className="hp-cta-grid-lines" aria-hidden="true" />
          <div className="hp-cta-icon-wrap"><div className="hp-cta-icon"><Clock size={27} /></div></div>
          <div className="hp-cta-copy">
            <span className="hp-cta-kicker">{ctaSection?.subheading || '72-Hour Rapid Deployment'}</span>
            <h2>{ctaSection?.title || 'Interview Qualified Candidates Within 48 Hours'}</h2>
            <p>{ctaSection?.description || 'Lock in top-tier accounting talent ahead of the busy season crunch. All candidates sign comprehensive bilateral NDAs and pass strict background verifications.'}</p>
            <div className="hp-cta-assurances">
              <span><ShieldCheck size={15} /> Verified &amp; Secure</span>
              <span><Clock size={15} /> Quick Ramp-Up</span>
              <span><UserCheck size={15} /> US-Trained Talent</span>
            </div>
          </div>
          <button type="button" onClick={handleBrowseRoles} className="hp-button hp-button-cta">
            <span>{ctaSection?.parsedContent?.buttonText || 'Explore Open Roles'}</span><ArrowRight size={17} />
          </button>
        </section>
        </EditableSectionContainer>
      </div>
    </main>
  );
}

export default HireProfessionalsPage;
