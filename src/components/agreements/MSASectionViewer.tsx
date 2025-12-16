import { useEffect, useRef } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AGREEMENT_CONTENT, AGREEMENT_VERSION } from '@/content/agreementContent';

interface MSASectionViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scrollToSection?: string | null;
}

export function MSASectionViewer({ open, onOpenChange, scrollToSection }: MSASectionViewerProps) {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const document = AGREEMENT_CONTENT.fullMSA.document;

  useEffect(() => {
    if (open && scrollToSection) {
      // Slight delay to ensure sheet is rendered
      setTimeout(() => {
        const ref = sectionRefs.current[scrollToSection];
        if (ref) {
          ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [open, scrollToSection]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b flex-shrink-0">
          <SheetTitle className="text-lg">{document.title}</SheetTitle>
          <SheetDescription>
            {document.subtitle} — Version {AGREEMENT_VERSION}
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-8 pb-8">
            {document.sections.map((section) => (
              <div 
                key={section.id}
                ref={(el) => { sectionRefs.current[section.id] = el; }}
                className={`scroll-mt-4 ${
                  scrollToSection === section.id 
                    ? 'ring-2 ring-primary ring-offset-2 rounded-lg p-4 -m-4 bg-primary/5' 
                    : ''
                }`}
              >
                <h3 className="font-semibold text-base mb-3">{section.heading}</h3>
                <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
