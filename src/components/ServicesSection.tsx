import React, { useState } from 'react';
import { Layers, Disc, Sparkles, CheckCircle2, ArrowRight, Music, Zap, Sliders, AudioLines, Flame } from 'lucide-react';
import { FUSION_PRESETS } from '../data/mockData';
import { GenreId } from '../types';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface Props {
  onSelectService: (serviceId: string) => void;
  onPreviewFusionAudio: (demoTrackId: GenreId) => void;
  activeGenre: GenreId | null;
  isPlaying: boolean;
}

export const ServicesSection: React.FC<Props> = ({
  onSelectService,
  onPreviewFusionAudio,
  activeGenre,
  isPlaying,
}) => {
  const { settings } = useSiteSettings();
  const { servicesSection, branding } = settings;
  const { services, workflowSteps } = servicesSection;

  const [activeFusionIndex, setActiveFusionIndex] = useState(0);
  const [customGenreA, setCustomGenreA] = useState('Gamelan Pelog');
  const [customGenreB, setCustomGenreB] = useState('Cyber EDM Synth');

  const getServiceIcon = (iconName: string, index: number) => {
    switch (iconName?.toLowerCase()) {
      case 'layers':
        return <Layers className="w-6 h-6 text-[#FFC857]" />;
      case 'disc':
        return <Disc className="w-6 h-6 text-[#A55EEA]" />;
      case 'sparkles':
        return <Sparkles className="w-6 h-6 text-[#FFC857]" />;
      default:
        return index % 2 === 0 ? (
          <Layers className="w-6 h-6 text-[#FFC857]" />
        ) : (
          <Disc className="w-6 h-6 text-[#A55EEA]" />
        );
    }
  };

  const currentPreset = FUSION_PRESETS[activeFusionIndex] || FUSION_PRESETS[0];

  return (
    <section id="layanan" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#181A24] border border-[#A55EEA]/30 text-xs font-semibold text-[#C084FC] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{servicesSection.badge || 'Solusi Produksi Audio Komprehensif'}</span>
        </div>
        <h2 className="font-serif-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-4 text-glow-gold">
          {servicesSection.title || 'Layanan Unggulan Kami'}
        </h2>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          {servicesSection.description}
        </p>
      </div>

      {/* 3 Core Services Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        {services.map((service, idx) => {
          const isGold = idx % 2 === 0;

          return (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="glass-card rounded-2xl p-7 border border-white/10 flex flex-col justify-between hover:border-[#FFC857]/50 hover:shadow-xl hover:shadow-[#FFC857]/10 transition-all duration-300 relative group overflow-hidden"
            >
              {/* Subtle top glow */}
              <div
                className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity ${
                  isGold ? 'bg-[#FFC857]/20' : 'bg-[#A55EEA]/20'
                }`}
              />

              <div>
                {/* Header tag and Icon */}
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#181A24] border border-white/10 flex items-center justify-center shadow-md">
                    {getServiceIcon(service.icon, idx)}
                  </div>
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      isGold
                        ? 'bg-[#FFC857]/10 text-[#FFC857] border-[#FFC857]/30'
                        : 'bg-[#A55EEA]/10 text-[#C084FC] border-[#A55EEA]/30'
                    }`}
                  >
                    {service.accentTag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif-heading font-bold text-2xl text-white mb-1 group-hover:text-[#FFC857] transition-colors">
                  {service.title}
                </h3>
                <div className="text-xs text-gray-400 font-medium mb-4">
                  {service.subtitle}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Feature Highlights */}
                <div className="mb-6 space-y-2.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Cakupan Pengerjaan:
                  </div>
                  {service.features?.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-[#FFC857] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Deliverables */}
                <div className="pt-4 border-t border-white/10 mb-6 space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Format Output & File Akhir:
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {service.deliverables?.map((deliv, i) => (
                      <div key={i} className="text-[11px] text-gray-400 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#A55EEA]" />
                        <span>{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onSelectService(service.id)}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-[#FFC857] hover:text-[#0D0E12] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 group/btn shadow-sm"
              >
                <span>Pesan Layanan Ini</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Interactive Cross-Genre Fusion Laboratory */}
      <div
        id="fusion-lab"
        className="glass-card rounded-3xl p-6 sm:p-10 border border-white/15 relative overflow-hidden mb-20 shadow-2xl backdrop-blur-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A55EEA]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFC857]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A55EEA]/15 border border-[#A55EEA]/30 text-xs font-semibold text-[#C084FC] mb-2">
                <Flame className="w-3.5 h-3.5 text-[#FFC857]" />
                <span>{servicesSection.fusionLabBadge || `Speciality ${branding.brandName || 'Delfea'}: Cross-Genre Fusion`}</span>
              </div>
              <h3 className="font-serif-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-white">
                {servicesSection.fusionLabTitle || 'Laboratorium Eksplorasi Antar-Genre'}
              </h3>
              <p className="text-sm text-gray-300 max-w-2xl mt-1">
                {servicesSection.fusionLabDesc || 'Mematahkan batasan konvensional. Simak bagaimana kami meleburkan identitas musik tradisional Nusantara dengan aransemen modern global.'}
              </p>
            </div>

            {/* Audition Trigger for active fusion preset */}
            <button
              type="button"
              onClick={() => onPreviewFusionAudio(currentPreset.demoTrackId)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#A55EEA] to-[#8B5CF6] text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-[#A55EEA]/30 hover:scale-105 transition-all flex items-center gap-2.5 shrink-0"
            >
              <Zap className="w-4 h-4 text-[#FFC857]" />
              <span>
                {activeGenre === currentPreset.demoTrackId && isPlaying
                  ? 'Jeda Audio Fusion'
                  : `Audisi: ${currentPreset.title}`}
              </span>
            </button>
          </div>

          {/* Fusion Preset Switcher Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {FUSION_PRESETS.map((preset, idx) => {
              const isSelected = activeFusionIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveFusionIndex(idx)}
                  className={`p-4 rounded-xl text-left border transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#181A24] border-[#FFC857] shadow-lg shadow-[#FFC857]/15'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  <div className="text-xs font-mono text-[#FFC857] mb-1">
                    Konsep #{idx + 1}
                  </div>
                  <div className="text-sm font-semibold text-white mb-1">
                    {preset.title}
                  </div>
                  <div className="text-[11px] text-gray-400">
                    {preset.genreA} + {preset.genreB}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Preset Detail Showcase */}
          <div className="bg-[#0D0E12]/90 rounded-2xl p-6 sm:p-8 border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#C084FC] mb-2">
                <Sliders className="w-4 h-4" />
                <span>Rentang Tempo: {currentPreset.bpmRange}</span>
              </div>
              <h4 className="font-serif-heading font-bold text-xl sm:text-2xl text-white mb-3">
                {currentPreset.title}
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed mb-6">
                {currentPreset.description}
              </p>

              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Elemen Kunci Peleburan:
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentPreset.signatureElements.map((elem, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-[#181A24] border border-[#FFC857]/25 text-xs text-[#FFC857] font-medium"
                    >
                      {elem}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Mixer Sandbox simulator */}
            <div className="bg-[#141620] rounded-xl p-5 border border-white/5 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <AudioLines className="w-4 h-4 text-[#FFC857]" />
                  <span>Kombinasi Impian Anda</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">
                      Genre Tradisional / Intim
                    </label>
                    <select
                      value={customGenreA}
                      onChange={(e) => setCustomGenreA(e.target.value)}
                      className="w-full bg-[#0D0E12] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFC857] focus:outline-none"
                    >
                      <option value="Gamelan Pelog">Gamelan Pelog / Slendro</option>
                      <option value="Dangdut Kendang">Dangdut Rampak / Ketipung</option>
                      <option value="Jazz Akustik">Jazz 9th Rhodes & Brass</option>
                      <option value="Bossanova Gitar">Bossanova Nylon Guitar</option>
                      <option value="Suling Etnik">Suling Bambu & Kecapi</option>
                    </select>
                  </div>

                  <div className="text-center font-serif text-[#FFC857] font-bold text-sm">
                    ✕
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">
                      Genre Modern / Kontemporer
                    </label>
                    <select
                      value={customGenreB}
                      onChange={(e) => setCustomGenreB(e.target.value)}
                      className="w-full bg-[#0D0E12] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#A55EEA] focus:outline-none"
                    >
                      <option value="Cyber EDM Synth">Cybernetic EDM & 808 Bass</option>
                      <option value="Modern Pop Catchy">Modern Radio-Ready Pop</option>
                      <option value="Cinematic Orchestral">Cinematic Film Score Epic</option>
                      <option value="Lo-Fi Chill Hop">Lo-Fi Chillhop Beats</option>
                      <option value="Heavy Rock Fusion">Progressive Metal & Synth</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10">
                <a
                  href="#kontak"
                  className="w-full py-2 rounded-lg bg-white/10 hover:bg-[#FFC857] hover:text-[#0D0E12] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors text-center"
                >
                  <span>Diskusikan Ide Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Step Studio Production Workflow */}
      <div id="workflow" className="mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono text-[#FFC857] uppercase tracking-widest mb-1">
            {servicesSection.workflowBadge || 'Transparansi Proses'}
          </div>
          <h3 className="font-serif-heading font-bold text-2xl sm:text-3xl text-white">
            {servicesSection.workflowTitle || `Alur Kerja Standar Industri ${branding.brandName || 'Delfea'}`}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {workflowSteps.map((item, idx) => (
            <div
              key={idx}
              className="glass-card rounded-xl p-5 border border-white/10 relative group hover:border-[#FFC857]/40 transition-colors"
            >
              <div className="font-serif font-black text-2xl text-[#FFC857]/40 group-hover:text-[#FFC857] transition-colors mb-2">
                {item.step}
              </div>
              <div className="text-sm font-bold text-white mb-2">
                {item.title}
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
