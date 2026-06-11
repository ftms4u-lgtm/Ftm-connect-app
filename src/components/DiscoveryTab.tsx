import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Profile, RelationshipGoal } from "../types";
import { 
  Heart, X, Sparkles, MapPin, Briefcase, GraduationCap, 
  HelpCircle, ShieldCheck, Loader2, RefreshCw, Copy, Check
} from "lucide-react";

interface DiscoveryTabProps {
  candidates: Profile[];
  onSwipeLeft: (profile: Profile) => void;
  onSwipeRight: (profile: Profile) => void;
  isFtmUser: boolean; // Tells if the user views cis profile or vice versa
  onSelectIcebreaker?: (text: string) => void; // Optional fast transition
  userProfile?: Profile; // Current user's profile for computing alignment
  onShowToast?: (message: string, type?: "success" | "info" | "error") => void;
}

// Highly precise Compatibility Calculator based on shared goals and custom values
function calculateCompatibility(user: Profile | undefined, candidate: Profile): { score: number; reasons: string[] } {
  if (!user) return { score: 75, reasons: ["Shared community spaces"] };

  let score = 50; // Base score
  const reasons: string[] = [];

  // 1. Relationship Goals matching
  if (user.goals === candidate.goals) {
    score += 25;
    reasons.push(`Alignment: Both seeking ${user.goals}`);
  } else if (
    user.goals === RelationshipGoal.OPEN_TO_CONNECTIONS ||
    candidate.goals === RelationshipGoal.OPEN_TO_CONNECTIONS
  ) {
    score += 15;
    reasons.push("Flexible relationship outlook alignment");
  } else if (
    (user.goals === RelationshipGoal.LONG_TERM && candidate.goals === RelationshipGoal.FRIENDSHIP) ||
    (user.goals === RelationshipGoal.FRIENDSHIP && candidate.goals === RelationshipGoal.LONG_TERM)
  ) {
    score += 10;
    reasons.push("Goals align on deep emotional foundations");
  } else {
    score -= 5;
    reasons.push("Different style of dating progression");
  }

  // 2. Interest matching (case-insensitive)
  const userInterestsLower = user.interests.map(i => i.toLowerCase().trim());
  const candidateInterestsLower = candidate.interests.map(i => i.toLowerCase().trim());
  const sharedInterests = userInterestsLower.filter(interest => candidateInterestsLower.includes(interest));

  if (sharedInterests.length > 0) {
    const interestPoints = Math.min(30, sharedInterests.length * 15);
    score += interestPoints;
    const matchedCapitalized = candidate.interests.filter(i => 
      sharedInterests.includes(i.toLowerCase().trim())
    );
    reasons.push(`Mutual focus: ${matchedCapitalized.join(", ")}`);
  } else {
    // Context patterns fallback
    const hasOutdoorMatch = 
      (userInterestsLower.some(i => i.includes("hike") || i.includes("camp") || i.includes("backpack") || i.includes("climb")) &&
       candidateInterestsLower.some(i => i.includes("hike") || i.includes("camp") || i.includes("backpack") || i.includes("climb")));
    const hasCreativeMatch =
      (userInterestsLower.some(i => i.includes("art") || i.includes("design") || i.includes("potter") || i.includes("paint") || i.includes("music") || i.includes("synth")) &&
       candidateInterestsLower.some(i => i.includes("art") || i.includes("design") || i.includes("potter") || i.includes("paint") || i.includes("music") || i.includes("synth")));
    const hasFoodMatch =
      (userInterestsLower.some(i => i.includes("cook") || i.includes("brunch") || i.includes("beer") || i.includes("coffee") || i.includes("sourdough") || i.includes("tea")) &&
       candidateInterestsLower.some(i => i.includes("cook") || i.includes("brunch") || i.includes("beer") || i.includes("coffee") || i.includes("sourdough") || i.includes("tea")));

    if (hasOutdoorMatch) {
      score += 15;
      reasons.push("Shared love for the great outdoors");
    }
    if (hasCreativeMatch) {
      score += 15;
      reasons.push("Both appreciate artistic and hands-on creative pursuits");
    }
    if (hasFoodMatch) {
      score += 15;
      reasons.push("Shared appreciation for delicious food, drinks, or café chats");
    }

    if (!hasOutdoorMatch && !hasCreativeMatch && !hasFoodMatch) {
      score += 5;
      reasons.push("Opportunity to swap stories and hobbies!");
    }
  }

  // 3. Distance check
  if (candidate.distanceMiles !== undefined) {
    if (candidate.distanceMiles <= 5) {
      score += 5;
      reasons.push("Excellent neighborhood proximity");
    } else if (candidate.distanceMiles <= 15) {
      score += 2;
    }
  }

  const finalScore = Math.max(45, Math.min(99, score));
  return { score: finalScore, reasons };
}

export default function DiscoveryTab({ 
  candidates, 
  onSwipeLeft, 
  onSwipeRight,
  isFtmUser,
  onSelectIcebreaker,
  userProfile,
  onShowToast
}: DiscoveryTabProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [loadingIcebreakers, setLoadingIcebreakers] = useState(false);
  const [icebreakerError, setIcebreakerError] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const currentProfile = candidates[currentIndex];
  const compInfo = currentProfile ? calculateCompatibility(userProfile, currentProfile) : { score: 0, reasons: [] };

  const handleAction = (dir: "left" | "right") => {
    if (!currentProfile) return;
    
    // Clear old icebreakers
    setIcebreakers([]);
    setIcebreakerError("");
    setCopiedId(null);
    setDirection(dir);

    if (dir === "left") {
      onSwipeLeft(currentProfile);
    } else {
      onSwipeRight(currentProfile);
    }
    
    setCurrentIndex(prev => prev + 1);
  };

  const variants = {
    initial: {
      x: 0,
      opacity: 0,
      scale: 0.96
    },
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        opacity: { duration: 0.3, ease: "easeOut" },
        scale: { duration: 0.35, ease: "easeOut" }
      }
    },
    exit: (customDir: "left" | "right") => ({
      x: customDir === "left" ? -450 : 450,
      opacity: 0,
      scale: 0.92,
      rotate: customDir === "left" ? -10 : 10,
      transition: {
        x: { type: "tween", duration: 0.3, ease: "easeIn" },
        opacity: { duration: 0.25 },
        scale: { duration: 0.3 },
        rotate: { duration: 0.3, ease: "easeIn" }
      }
    })
  };

  const generateIcebreakers = async () => {
    if (!currentProfile) return;
    setLoadingIcebreakers(true);
    setIcebreakerError("");
    setIcebreakers([]);
    setCopiedId(null);

    try {
      const response = await fetch("/api/gemini/icebreakers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerBio: currentProfile.bio,
          partnerInterests: currentProfile.interests,
          partnerName: currentProfile.name
        })
      });

      if (!response.ok) {
        throw new Error("Failed to compile icebreakers from AI server.");
      }

      const data = await response.json();
      setIcebreakers(data);
    } catch (err: any) {
      console.error(err);
      setIcebreakerError("Unable to reach the Gemini Wingman. Please check your network and API key.");
    } finally {
      setLoadingIcebreakers(false);
    }
  };

  const resetDeck = () => {
    setCurrentIndex(0);
    setIcebreakers([]);
    setIcebreakerError("");
    setCopiedId(null);
  };

  const handleCopyIcebreaker = (starter: string, idx: number) => {
    navigator.clipboard.writeText(starter);
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 2000);
    if (onSelectIcebreaker) {
      onSelectIcebreaker(starter);
    }
    if (onShowToast) {
      onShowToast("Copied icebreaker to clipboard!", "success");
    }
  };

  if (!currentProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-[32px] text-center max-w-lg mx-auto shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-5 shadow-inner">
          <RefreshCw className="w-8 h-8 text-indigo-400 rotate-12 animate-pulse" />
        </div>
        <h3 className="text-2xl font-display font-semibold text-white/95 mb-2">You've reached the end of the line!</h3>
        <p className="text-white/60 text-sm max-w-xs mb-8">
          You have viewed all active profiles matching your selection. Check back soon for new community members!
        </p>
        <button
          onClick={resetDeck}
          className="px-6 py-3 bg-gradient-to-tr from-indigo-500 to-rose-400 hover:from-indigo-600 hover:to-rose-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all duration-150 cursor-pointer"
        >
          Explore Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Cards Deck */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentProfile.id}
          custom={direction}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.65}
          onDragEnd={(e, info) => {
            if (info.offset.x < -120) {
              handleAction("left");
            } else if (info.offset.x > 120) {
              handleAction("right");
            }
          }}
          className="backdrop-blur-2xl bg-[#1e293b]/40 rounded-[32px] border border-white/20 shadow-2xl overflow-hidden flex flex-col relative transition-all duration-300 touch-none select-none cursor-grab active:cursor-grabbing"
        >
        
        {/* Profile Avatar Stage / Visual Area */}
        <div className="relative h-72 sm:h-88 flex items-end justify-start overflow-hidden">
          {/* Custom Decorative Avatar Background Gradients based on their seed color */}
          <div className={`absolute inset-0 bg-gradient-to-tr ${currentProfile.avatarBgColor} opacity-25`} />
          
          {/* Compatibility Score Floating Badge */}
          <div className="absolute top-4 right-4 z-20 backdrop-blur-md bg-slate-900/85 border border-indigo-500/30 rounded-2xl p-2 sm:p-2.5 flex items-center gap-2 sm:gap-2.5 shadow-xl">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center">
              <svg className="w-9 h-9 sm:w-10 sm:h-10 transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  className="stroke-slate-700/60 fill-none"
                  strokeWidth="3.5"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  className={`fill-none transition-all duration-500 ${
                    compInfo.score >= 85 ? "stroke-emerald-400" :
                    compInfo.score >= 75 ? "stroke-indigo-400" : "stroke-rose-400"
                  }`}
                  strokeWidth="3.5"
                  strokeDasharray="100.53"
                  strokeDashoffset={100.53 - (100.53 * compInfo.score) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[10px] sm:text-xs font-bold text-white font-mono">
                {compInfo.score}%
              </span>
            </div>
            <div className="text-left select-none pr-1">
              <span className="text-[9px] font-bold text-indigo-300 uppercase block tracking-wider leading-none mb-0.5">COMPATIBILITY</span>
              <span className="text-[10px] text-white/90 font-semibold block leading-none">Match Score</span>
            </div>
          </div>

          {/* Abstract geometric background shapes to feel artistic & look incredibly premium */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent z-10" />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-white/5 border border-white/25 flex items-center justify-center text-5xl font-display font-medium text-white shadow-xl backdrop-blur-md mb-2 select-none">
              {currentProfile.name.charAt(0)}
            </div>
            <div className="text-[11px] uppercase tracking-widest text-indigo-300 font-semibold bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md backdrop-blur-md select-none">
              Active profile
            </div>
          </div>

          {/* Profile Name Overlay and details */}
          <div className="relative z-20 p-6 sm:p-8 w-full text-left">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">{currentProfile.name}, {currentProfile.age}</span>
              {currentProfile.verificationStatus === "verified" && (
                <ShieldCheck className="w-6 h-6 text-indigo-400 drop-shadow-sm fill-white/10" title="Community Verified Account" />
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-semibold text-white/90 backdrop-blur-md select-none">
                {currentProfile.gender}
              </span>
              <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-medium text-white/80 backdrop-blur-md select-none">
                {currentProfile.pronouns}
              </span>
            </div>

            {currentProfile.distanceMiles !== undefined && (
              <div className="flex items-center gap-1.5 text-white/75 text-xs mt-3 select-none">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{currentProfile.location} • {currentProfile.distanceMiles} miles away</span>
              </div>
            )}
          </div>
        </div>

        {/* Info Area */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Bio Description */}
          <div>
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3.5 select-none">About Me</h4>
            <p className="text-white/80 leading-relaxed text-sm whitespace-pre-line font-normal">{currentProfile.bio}</p>
          </div>

          {/* Transition and Openness info for educational dating support */}
          {(currentProfile.transitionStageShared || currentProfile.openToAnsweringQuestions) && (
            <div className="backdrop-blur-md bg-white/5 rounded-2xl p-4.5 border border-white/10 flex flex-col gap-3">
              <h5 className="text-xs font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-2 select-none">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                <span>Comfort & Boundary Notes</span>
              </h5>
              {currentProfile.transitionStageShared && (
                <p className="text-xs text-white/70">
                  <strong className="text-white/90 font-medium">Trans/Journey Info: </strong>
                  {currentProfile.transitionStageShared}
                </p>
              )}
              {currentProfile.openToAnsweringQuestions && (
                <p className="text-xs text-white/70 leading-relaxed">
                  <strong className="text-white/90 font-medium">Conversational Boundaries: </strong>
                  {currentProfile.openToAnsweringQuestions === "happy_to_share" && "🌱 Very open and happy to answer respectful questions!"}
                  {currentProfile.openToAnsweringQuestions === "prefer_no_invasive_questions" && "🔒 Please avoid transition inquiries early on. Let's make an emotional connection first."}
                  {currentProfile.openToAnsweringQuestions === "only_if_matched_and_close" && "💬 I'm glad to share about my trans experiences once we match and build real trust."}
                </p>
              )}
            </div>
          )}

          {/* Interests */}
          <div>
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 select-none">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {currentProfile.interests.map((interest) => (
                <span 
                  key={interest} 
                  className="px-3 py-1 bg-white/5 border border-white/10 text-white/80 rounded-lg text-xs font-medium select-none"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Compatibility Synergy Breakdown */}
          <div className="bg-gradient-to-br from-indigo-500/5 to-rose-500/5 rounded-2xl p-4 border border-indigo-500/20 flex flex-col gap-2.5 animate-in fade-in duration-200">
            <h5 className="text-xs font-bold text-rose-300 uppercase tracking-widest flex items-center gap-1.5 select-none">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Vibe Compatibility Breakdown</span>
            </h5>
            <div className="space-y-2">
              {compInfo.reasons.map((reason, idx) => (
                <div key={idx} className="text-xs text-white/85 flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-400 select-none">✓</span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Career & Intent */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5 text-white/60 text-xs text-left">
            {currentProfile.profession && (
              <div className="flex items-center gap-1.5 min-w-0">
                <Briefcase className="w-4 h-4 text-white/30 flex-shrink-0" />
                <span className="truncate">{currentProfile.profession}</span>
              </div>
            )}
            {currentProfile.education && (
              <div className="flex items-center gap-1.5 min-w-0">
                <GraduationCap className="w-4 h-4 text-white/30 flex-shrink-0" />
                <span className="truncate">{currentProfile.education}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 col-span-2 text-white/70 font-medium bg-indigo-500/5 py-1.5 px-3 rounded-lg border border-indigo-500/10">
              <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>Seeking: <span className="text-indigo-300 font-semibold">{currentProfile.goals}</span></span>
            </div>
          </div>
        </div>

        {/* Action Swiping Row */}
        <div className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-lg flex items-center justify-between gap-5 relative z-10">
          <button
            onClick={() => handleAction("left")}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-4 bg-white/5 hover:bg-white/10 active:scale-95 text-white/90 rounded-2xl border border-white/20 font-medium transition duration-150 cursor-pointer shadow-md"
            id="swipe_pass_btn"
          >
            <X className="w-5 h-5 text-rose-400" />
            <span>Pass</span>
          </button>
          
          <button
            onClick={() => handleAction("right")}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-4 bg-gradient-to-tr from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white font-semibold rounded-2xl active:scale-95 transition duration-150 cursor-pointer shadow-lg shadow-indigo-500/20"
            id="swipe_like_btn"
          >
            <Heart className="w-5 h-5 text-white fill-white/10" />
            <span>Like</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>

      {/* AI Assistant Icebreaker Generator Section */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[24px] p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center shadow-inner">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-display font-semibold text-white/90 select-none">Wingman AI: Icebreakers</h4>
              <p className="text-white/50 text-[11px] select-none">Get unique dialogue starters for {currentProfile.name}</p>
            </div>
          </div>
          <button
            onClick={generateIcebreakers}
            disabled={loadingIcebreakers}
            className="py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/15 text-indigo-300 disabled:text-stone-400 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition duration-150"
          >
            {loadingIcebreakers ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Ask Gemini</span>
              </>
            )}
          </button>
        </div>

        {/* Output Area */}
        {icebreakers.length > 0 && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold select-none">Click to copy or load into draft:</p>
            {icebreakers.map((starter, i) => (
              <div 
                key={i}
                onClick={() => handleCopyIcebreaker(starter, i)}
                className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white/85 text-xs relative group cursor-pointer transition-all duration-150 flex flex-col"
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-semibold text-indigo-300 font-sans text-[10px] uppercase">Option {i + 1}</span>
                  <div className="text-white/40 group-hover:text-white/70 transition-colors">
                    {copiedId === i ? (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                        <Check className="w-3 h-3" /> Loaded
                      </span>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>
                <p className="italic text-white/80 font-serif leading-relaxed text-xs">"{starter}"</p>
              </div>
            ))}
          </div>
        )}

        {icebreakerError && (
          <p className="text-rose-400 text-xs mt-2 font-normal">{icebreakerError}</p>
        )}

        {!loadingIcebreakers && icebreakers.length === 0 && (
          <p className="text-white/50 text-xs leading-relaxed font-normal p-1">
            Tap <strong className="text-indigo-300">"Ask Gemini"</strong> to generate polished, gender-affirming icebreaker prompt alternatives. The AI inspects {currentProfile.name}'s bio to formulate unique hooks, saving you from awkward first messages.
          </p>
        )}
      </div>
    </div>
  );
}

