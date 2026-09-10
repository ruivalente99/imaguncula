"use client";

import React, { useState } from "react";
import { useTranslation } from "@/locales";
import { HelpCircle, Monitor, Smartphone, PackageCheck, ChevronDown } from "lucide-react";

export function WhatsAppGuide() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-stone-200/80 dark:border-[#30363d] bg-stone-50/60 dark:bg-[#161b22]/60 overflow-hidden text-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-stone-100/60 dark:hover:bg-[#1c2128] transition-colors"
      >
        <div className="flex items-center gap-2 font-bold text-stone-800 dark:text-stone-200">
          <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>{t("export.guideTitle")}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="p-3.5 pt-1 space-y-3 text-[11px] text-stone-600 dark:text-stone-300 border-t border-stone-200/60 dark:border-[#30363d] animate-in fade-in-50 duration-150">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 shrink-0 mt-0.5">
              <Monitor className="w-3.5 h-3.5" />
            </div>
            <div>
              <strong className="block text-stone-800 dark:text-stone-100 font-semibold mb-0.5">
                No WhatsApp Web (Computador):
              </strong>
              <span>
                Basta clicar no botão <b>&quot;Copiar Imagem&quot;</b> abaixo e colar com <b>Ctrl+V</b> (ou Cmd+V) direto na conversa do WhatsApp Web. O WhatsApp reconhece como figurinha automaticamente!
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0 mt-0.5">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
            <div>
              <strong className="block text-stone-800 dark:text-stone-100 font-semibold mb-0.5">
                No Celular (iPhone ou Android):
              </strong>
              <span>
                Toque em <b>&quot;Compartilhar no WhatsApp&quot;</b> e selecione o contato desejado na folha de compartilhamento nativa.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 shrink-0 mt-0.5">
              <PackageCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <strong className="block text-stone-800 dark:text-stone-100 font-semibold mb-0.5">
                Criar Pacote Permanente:
              </strong>
              <span>
                Você pode baixar o arquivo <b>.webp</b> oficial de 512x512 ou o pacote <b>.ZIP</b> e importá-los em apps como <i>Sticker.ly</i> ou <i>Personal Stickers</i> para adicionar permanentemente ao teclado do WhatsApp.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
