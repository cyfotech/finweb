import type { ServiceItem } from '../data/services';
import { ServiceWorkflowAnimation } from './ServiceWorkflowAnimation';

interface ServiceLiveHeroAnimationProps {
  service: ServiceItem;
}

export function ServiceLiveHeroAnimation({ service }: ServiceLiveHeroAnimationProps) {
  return (
    <div className="relative mt-8 w-full overflow-hidden rounded-2xl border border-[#22AF68]/30 bg-white/80 p-5 shadow-lg backdrop-blur-xl dark:border-[#35E092]/25 dark:bg-[#071C25]/85 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#DCECE3] pb-4 dark:border-[rgba(53,224,146,0.15)]">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E9457] dark:text-[#35E092]">
          Service Workflow &bull; {service.name}
        </span>
        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] text-emerald-700 dark:text-[#35E092]">
          SLA: {service.turnaroundTime}
        </span>
      </div>
      <ServiceWorkflowAnimation service={service} variant="hero" />
    </div>
  );
}
