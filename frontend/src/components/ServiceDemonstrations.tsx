import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import type { ServiceItem } from '../data/services';
import { ServiceExecutionSimulation } from './ServiceExecutionSimulation';
import { servicesApi } from '../api/services';

interface ServiceDemoProps {
  service: ServiceItem;
}

export function ServiceDemonstration({ service }: ServiceDemoProps) {
  const [config, setConfig] = useState<any>({
    simulationBadge: 'Interactive service walkthrough',
    simulationSubtext: 'Explore the stages, checkpoints, and handoffs that shape this service from start to delivery.',
  });

  useEffect(() => {
    servicesApi.getPageConfig()
      .then((cfg) => {
        if (cfg && typeof cfg === 'object') {
          setConfig((prev: any) => ({ ...prev, ...cfg }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-[#DCE5E2] bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-[rgba(121,241,232,0.2)] dark:bg-[#071C25]/80 sm:p-8">
      <div className="mb-6 flex flex-col justify-between gap-3 border-b border-[#E2EBE8] pb-6 dark:border-[#102C38] sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#49E3D6]/30 bg-[#49E3D6]/15 px-3 py-1 text-xs font-semibold text-[#17383F] dark:text-[#7DF5E8]">
            <Sparkles className="h-3.5 w-3.5 text-[#315F69] dark:text-[#49E3D6]" />
            <span>{config.simulationBadge || 'Interactive service walkthrough'}</span>
          </div>
          <h3 className="text-xl font-bold text-[#12242B] dark:text-[#F4FBFC] sm:text-2xl">
            Live Execution Simulation: {service.name}
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#476067] dark:text-[#A8C0C6] sm:text-base">
            {config.simulationSubtext || 'Explore the stages, checkpoints, and handoffs that shape this service from start to delivery.'}
          </p>
        </div>
      </div>
      <ServiceExecutionSimulation key={service.slug} service={service} />
    </div>
  );
}
