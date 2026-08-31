import React, { useState } from 'react';
import { Layers, Flame, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { ServiceItemData, WorkflowStepItem } from '../../types';

export const TabServicesWorkflow: React.FC = () => {
  const { settings, updateSection } = useSiteSettings();
  const servSection = settings.servicesSection;
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(servSection.services[0]?.id || null);

  const handleServiceFieldChange = (index: number, key: keyof ServiceItemData, value: any) => {
    const updated = [...servSection.services];
    updated[index] = {
      ...updated[index],
      [key]: value,
    };
    updateSection('servicesSection', { services: updated });
  };

  const handleFeaturesChange = (index: number, rawText: string) => {
    const lines = rawText.split('\n').map((s) => s.trim()).filter(Boolean);
    handleServiceFieldChange(index, 'features', lines);
  };

  const handleDeliverablesChange = (index: number, rawText: string) => {
    const lines = rawText.split('\n').map((s) => s.trim()).filter(Boolean);
    handleServiceFieldChange(index, 'deliverables', lines);
  };

  const handleWorkflowStepChange = (index: number, key: keyof WorkflowStepItem, value: string) => {
    const updated = [...servSection.workflowSteps];
    updated[index] = {
      ...updated[index],
      [key]: value,
    };
    updateSection('servicesSection', { workflowSteps: updated });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Services Section */}
      <div className="p-5 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#FFC857]" />
          <span>Teks Header Bagian Layanan Studio</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Badge Label Layanan
            </label>
            <input
              type="text"
              value={servSection.badge}
              onChange={(e) => updateSection('servicesSection', { badge: e.target.value })}
              className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#FFC857] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Judul Utama Layanan
            </label>
            <input
              type="text"
              value={servSection.title}
              onChange={(e) => updateSection('servicesSection', { title: e.target.value })}
              className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#FFC857] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
            Deskripsi Pengantar Layanan
          </label>
          <textarea
            rows={2}
            value={servSection.description}
            onChange={(e) => updateSection('servicesSection', { description: e.target.value })}
            className="w-full bg-[#181A24] border border-white/15 rounded-xl p-3 text-sm text-white focus:border-[#FFC857] focus:outline-none"
          />
        </div>
      </div>

      {/* 3 Core Services Editor */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-white">Edit Detail 3 Paket Layanan Utama</h4>

        {servSection.services.map((service, idx) => {
          const isExpanded = expandedServiceId === service.id;
          return (
            <div
              key={service.id}
              className="rounded-2xl bg-[#0D0E12] border border-white/10 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpandedServiceId(isExpanded ? null : service.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#181A24] border border-white/10 flex items-center justify-center font-bold text-xs text-[#FFC857]">
                    0{idx + 1}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white mr-2">{service.title}</span>
                    <span className="text-xs text-gray-400 font-light">({service.subtitle})</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10 hidden sm:inline">
                    {service.accentTag}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-5 border-t border-white/10 space-y-4 bg-[#141620]/60">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Judul Layanan</label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => handleServiceFieldChange(idx, 'title', e.target.value)}
                        className="w-full bg-[#0D0E12] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFC857] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Sub-Judul Inggris</label>
                      <input
                        type="text"
                        value={service.subtitle}
                        onChange={(e) => handleServiceFieldChange(idx, 'subtitle', e.target.value)}
                        className="w-full bg-[#0D0E12] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFC857] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Tag Sorotan</label>
                      <input
                        type="text"
                        value={service.accentTag}
                        onChange={(e) => handleServiceFieldChange(idx, 'accentTag', e.target.value)}
                        className="w-full bg-[#0D0E12] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFC857] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Deskripsi Layanan</label>
                    <textarea
                      rows={2}
                      value={service.description}
                      onChange={(e) => handleServiceFieldChange(idx, 'description', e.target.value)}
                      className="w-full bg-[#0D0E12] border border-white/15 rounded-lg p-3 text-xs text-white focus:border-[#FFC857] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Cakupan Pengerjaan (1 Poin Per Baris)
                      </label>
                      <textarea
                        rows={4}
                        value={service.features.join('\n')}
                        onChange={(e) => handleFeaturesChange(idx, e.target.value)}
                        className="w-full bg-[#0D0E12] border border-white/15 rounded-lg p-2.5 text-xs text-white font-mono focus:border-[#FFC857] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Format Output & File Akhir (1 Poin Per Baris)
                      </label>
                      <textarea
                        rows={4}
                        value={service.deliverables.join('\n')}
                        onChange={(e) => handleDeliverablesChange(idx, e.target.value)}
                        className="w-full bg-[#0D0E12] border border-white/15 rounded-lg p-2.5 text-xs text-white font-mono focus:border-[#FFC857] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fusion Lab & Workflow Texts */}
      <div className="p-5 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Flame className="w-4 h-4 text-[#A55EEA]" />
          <span>Teks Laboratorium Fusion & 5 Alur Kerja Studio</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Judul Fusion Lab</label>
            <input
              type="text"
              value={servSection.fusionLabTitle}
              onChange={(e) => updateSection('servicesSection', { fusionLabTitle: e.target.value })}
              className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-[#FFC857] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Badge Fusion Lab</label>
            <input
              type="text"
              value={servSection.fusionLabBadge}
              onChange={(e) => updateSection('servicesSection', { fusionLabBadge: e.target.value })}
              className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-[#FFC857] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Deskripsi Fusion Lab</label>
          <input
            type="text"
            value={servSection.fusionLabDesc}
            onChange={(e) => updateSection('servicesSection', { fusionLabDesc: e.target.value })}
            className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-[#FFC857] focus:outline-none"
          />
        </div>

        <div className="pt-3 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Judul Alur Kerja</label>
              <input
                type="text"
                value={servSection.workflowTitle}
                onChange={(e) => updateSection('servicesSection', { workflowTitle: e.target.value })}
                className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-[#FFC857] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Badge Alur Kerja</label>
              <input
                type="text"
                value={servSection.workflowBadge}
                onChange={(e) => updateSection('servicesSection', { workflowBadge: e.target.value })}
                className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:border-[#FFC857] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            {servSection.workflowSteps.map((step, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#181A24] border border-white/10 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="font-mono font-bold text-xs text-[#FFC857] shrink-0 w-8">
                  {step.step}
                </div>
                <div className="w-full sm:w-1/3">
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => handleWorkflowStepChange(idx, 'title', e.target.value)}
                    placeholder="Judul Langkah"
                    className="w-full bg-[#0D0E12] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[#FFC857] focus:outline-none"
                  />
                </div>
                <div className="w-full sm:w-2/3">
                  <input
                    type="text"
                    value={step.description}
                    onChange={(e) => handleWorkflowStepChange(idx, 'description', e.target.value)}
                    placeholder="Keterangan Langkah"
                    className="w-full bg-[#0D0E12] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-[#FFC857] focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
