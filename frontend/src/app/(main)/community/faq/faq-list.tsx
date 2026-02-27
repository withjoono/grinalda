'use client';

import { useAllFaq } from '@/apis/hooks/use-boards';
import { ErrorSection } from '@/components/status/error-section';
import { LoadingSection } from '@/components/status/loading-section';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FaqList() {
  const { data: faqs, isPending, isError, refetch } = useAllFaq();

  if (isPending) return <LoadingSection className='py-20' />;
  if (isError) return <ErrorSection onRetry={refetch} />;

  return (
    <Accordion type='single' collapsible>
      {faqs
        .sort((a, b) => a.id - b.id)
        .map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className='border-b-0'
          >
            <AccordionTrigger className='hover:text-foreground/60 hover:no-underline'>
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className='w-full whitespace-pre-line pl-4'>
              {faq.answer.replace(/\\n/g, '\n')}
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
}
