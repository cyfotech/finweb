import { FinancialDonutChart } from './FinancialDonutChart';
import { useAnimationSettings } from '../context/AnimationSettingsContext';

const defaultHomeFinancialMix = [
  {
    id: 'tax-preparation',
    name: 'Tax preparation',
    value: 1280000,
    color: '#22b887',
    description: 'Prepared and reviewed returns across individual and business clients.',
    metric: '4,200+ returns'
  },
  {
    id: 'accounting-books',
    name: 'Accounting & books',
    value: 920000,
    color: '#39c7c0',
    description: 'Reconciliations, monthly close, and reliable financial records.',
    metric: '3,500+ closes'
  },
  {
    id: 'payroll-support',
    name: 'Payroll support',
    value: 610000,
    color: '#d3a753',
    description: 'Accurate payroll processing and employee pay-cycle support.',
    metric: '1,800+ pay runs'
  },
  {
    id: 'firm-capacity',
    name: 'Firm capacity',
    value: 430000,
    color: '#728fb5',
    description: 'Dedicated accounting teams aligned to partner workflows.',
    metric: '12 specialist pods'
  }
];

export function HomeHeroServiceAnimation() {
  const { settings } = useAnimationSettings();
  const chartConfig = settings?.homeDonutChart;

  if (chartConfig && chartConfig.enabled === false) {
    return null;
  }

  const data = chartConfig?.items?.length ? chartConfig.items : defaultHomeFinancialMix;
  const title = chartConfig?.title || 'Financial operations';
  const subtitle = chartConfig?.subtitle || 'A clearer view of work delivered across your firm.';
  const centerLabel = chartConfig?.centerLabel || 'PORTFOLIO MIX';

  return (
    <FinancialDonutChart
      data={data}
      title={title}
      subtitle={subtitle}
      centerLabel={centerLabel}
      valueFormatter={value => `$${new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(value)}`}
      totalFormatter={value => `$${new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(value)}`}
      tone="home"
    />
  );
}
