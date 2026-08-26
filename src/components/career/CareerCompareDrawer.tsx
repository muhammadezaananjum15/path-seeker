import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCareerStore } from '../../stores/useCareerStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import { Scale, X, ArrowRight, TrendingUp, DollarSign, Check, Award } from 'lucide-react';

export const CareerCompareDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    careers,
    comparedCareerIds,
    isCompareDrawerOpen,
    setCompareDrawerOpen,
    removeComparedCareer,
    clearComparedCareers
  } = useCareerStore();

  const comparedCareers = comparedCareerIds
    .map((id) => careers.find((c) => c.id === id))
    .filter(Boolean) as typeof careers;

  if (comparedCareers.length === 0) return null;

  return (
    <>
      {/* Floating Toggle Bar when closed but items selected */}
      {!isCompareDrawerOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setCompareDrawerOpen(true)}
            className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#402D9C] text-[#F4F2FA] border border-[#6755C2] shadow-[0_10px_30px_rgba(64,45,156,0.5)] hover:bg-[#6755C2] transition-all cursor-pointer font-medium text-xs tracking-wide"
          >
            <Scale className="w-4 h-4" />
            <span>
              Compare Careers ({comparedCareers.length}/3 Selected)
            </span>
          </motion.button>
        </div>
      )}

      {/* Expanded Comparison Drawer Modal */}
      <AnimatePresence>
        {isCompareDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCompareDrawerOpen(false)}
              className="fixed inset-0 bg-[#030305]/80 backdrop-blur-md"
            />

            {/* Content Drawer */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-5xl bg-[#08012B] border border-[#6755C2]/40 rounded-t-3xl sm:rounded-3xl shadow-[0_25px_60px_rgba(3,3,5,0.95)] overflow-hidden z-10 max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#6755C2]/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#07031A] border border-[#6755C2]/40 flex items-center justify-center text-[#6755C2]">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-editorial text-[#F4F2FA]">
                      Career Trajectory Comparison
                    </h3>
                    <p className="text-xs text-[#8B85A8]">
                      Evaluating {comparedCareers.length} pathways across compensation, skills, and demand
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={clearComparedCareers}>
                    Clear All
                  </Button>
                  <button
                    onClick={() => setCompareDrawerOpen(false)}
                    className="p-1.5 rounded-lg text-[#8B85A8] hover:text-[#F4F2FA] hover:bg-[#07031A] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Comparison Columns Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {comparedCareers.map((career) => (
                    <div
                      key={career.id}
                      className="bg-[#07031A] border border-[#6755C2]/30 rounded-2xl p-5 space-y-4 relative flex flex-col justify-between"
                    >
                      <button
                        onClick={() => removeComparedCareer(career.id)}
                        className="absolute top-3 right-3 text-[#8B85A8] hover:text-[#F4F2FA] p-1 rounded-md"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="space-y-3">
                        <div>
                          <Badge variant="royal" size="sm">
                            {career.domain}
                          </Badge>
                          <h4 className="text-base font-bold font-editorial text-[#F4F2FA] mt-2">
                            {career.title}
                          </h4>
                          <p className="text-xs text-[#8B85A8] mt-1 line-clamp-2">
                            {career.shortDescription}
                          </p>
                        </div>

                        {/* Metric Comparison Table */}
                        <div className="space-y-2 pt-2 border-t border-[#6755C2]/20 text-xs">
                          <div className="flex items-center justify-between py-1 border-b border-[#6755C2]/10">
                            <span className="text-[#8B85A8]">Passport Match</span>
                            <span className="font-mono font-bold text-[#6755C2]">
                              {career.matchScore}%
                            </span>
                          </div>

                          <div className="flex items-center justify-between py-1 border-b border-[#6755C2]/10">
                            <span className="text-[#8B85A8]">Average Salary</span>
                            <span className="font-mono font-bold text-[#F4F2FA]">
                              {formatCurrency(career.averageSalary)}/yr
                            </span>
                          </div>

                          <div className="flex items-center justify-between py-1 border-b border-[#6755C2]/10">
                            <span className="text-[#8B85A8]">Senior / Lead Pay</span>
                            <span className="font-mono font-bold text-[#F4F2FA]">
                              {formatCurrency(career.salaryRange.lead)}/yr
                            </span>
                          </div>

                          <div className="flex items-center justify-between py-1 border-b border-[#6755C2]/10">
                            <span className="text-[#8B85A8]">Market Demand</span>
                            <span className="font-medium text-[#F4F2FA]">
                              {career.demandLevel}
                            </span>
                          </div>

                          <div className="flex items-center justify-between py-1">
                            <span className="text-[#8B85A8]">5-Year Growth</span>
                            <span className="font-mono text-[#6755C2]">
                              {career.growthRate}
                            </span>
                          </div>
                        </div>

                        {/* Required Skills */}
                        <div className="space-y-1.5 pt-2">
                          <span className="text-[10px] uppercase tracking-wider text-[#8B85A8] font-mono block">
                            Key Skills Needed
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {career.requiredSkills.map((s) => (
                              <span
                                key={s}
                                className="text-[10px] px-2 py-0.5 rounded bg-[#08012B] text-[#F4F2FA] border border-[#6755C2]/20"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full mt-4"
                        onClick={() => {
                          setCompareDrawerOpen(false);
                          navigate(`/careers/${career.id}`);
                        }}
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Deep Dive Profile
                      </Button>
                    </div>
                  ))}

                  {/* Empty Slot placeholder if less than 3 */}
                  {comparedCareers.length < 3 && (
                    <div className="border border-dashed border-[#6755C2]/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 text-[#8B85A8] min-h-[300px]">
                      <Scale className="w-8 h-8 text-[#6755C2]/50 mb-2" />
                      <p className="text-xs font-medium text-[#F4F2FA]">
                        Add Another Career
                      </p>
                      <p className="text-[11px] max-w-xs text-[#8B85A8]">
                        Browse the Career Bank and click the scale icon on any card to compare.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
