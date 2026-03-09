import { notFound } from 'next/navigation'
import { getStep, STEPS } from '@/lib/steps'
import { StepPage } from '@/components/step/StepLayout'

export function generateStaticParams() {
  return STEPS.map((s) => ({ id: s.id }))
}

export default function StepRoute({ params }: { params: { id: string } }) {
  const step = getStep(params.id)
  if (!step) notFound()
  return <StepPage step={step} />
}
