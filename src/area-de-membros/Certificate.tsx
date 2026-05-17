import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Award, ShieldCheck, Check } from 'lucide-react';

interface CertificateProps {
  userName: string;
  completionDate: string;
}

export const Certificate: React.FC<CertificateProps> = ({ userName, completionDate }) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-6 no-print">
          <div className="w-24 h-24 bg-brand-yellow/20 rounded-3xl flex items-center justify-center text-brand-yellow">
            <Award size={48} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Seu Certificado</h2>
            <p className="text-slate-500 font-medium">Parabéns pela conclusão do curso! Você já pode emitir seu certificado de participação.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handlePrint}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-all shadow-lg"
            >
              IMPRIMIR
            </button>
          </div>
        </div>

        {/* Certificate Preview */}
        <div 
          ref={certificateRef}
          className="certificate-container relative w-full max-w-5xl mx-auto shadow-2xl overflow-hidden rounded-lg group"
        >
          <div className="relative w-full h-full">
            {/* Template Image */}
            <img 
              src="https://i.ibb.co/v6WQ0zRv/image.png" 
              alt="Certificate Template" 
              className="w-full h-auto block"
            />
            
            {/* Overlay Content */}
            <div className="absolute inset-0 pointer-events-none">
              {/* User Name - Aligned with the template space after "concedido a" */}
              <div className="cert-name-overlay absolute top-[57%] left-1/2 -translate-x-1/2 w-full text-center px-[15%]">
                <h4 className="text-[2.8vw] md:text-3xl lg:text-4xl font-black text-[#1a1a1a] font-display italic tracking-tight leading-none uppercase">
                  {userName || 'Leonardo Pinheiro'}
                </h4>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media print {
            .no-print, 
            aside, 
            header, 
            nav, 
            button {
              display: none !important;
            }

            body, html {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }

            main {
              margin-left: 0 !important;
              padding: 0 !important;
              width: 100% !important;
            }

            /* Keep height: auto so percentages match between screen and print */
            .certificate-container {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              width: 100vw !important;
              height: auto !important;
              max-width: none !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              background: white !important;
            }

            .certificate-container img {
              width: 100% !important;
              height: auto !important;
              display: block !important;
            }

            /* Override name position specifically for print */
            .cert-name-overlay {
              top: 59% !important;
            }

            @page {
              size: landscape;
              margin: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
};
