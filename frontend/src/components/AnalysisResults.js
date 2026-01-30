// src/components/AnalysisResults.js
import React, { useState, useEffect } from "react";
import { BarChart3, Leaf, Droplets, ThermometerSun, Clock } from "lucide-react";

export function AnalysisResults({
  analysis,
  isAnalyzing,
  weather,
  location,
  aiSoilType,
  aiConfidence,
}) {
  const [activeCropIndex, setActiveCropIndex] = useState(0);

  useEffect(() => {
    if (analysis && analysis.recommendedCrops?.length) {
      setActiveCropIndex(0);
    }
  }, [analysis]);

  // ---------- EMPTY / LOADING ----------
  if (!analysis && !isAnalyzing) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-lg shadow-green-500/5 border border-green-100 items-center h-full">
        <h2 className="text-xl font-semibold kulay-ni-aldred mb-2">
          Analysis Results
        </h2>
        <p className="kulay-ni-joyce text-sm max-w-sm">
          Upload a clear image of your soil to see AI-powered analysis,
          recommended crops, and a detailed growth timeline.
        </p>
      </div>
    );
  }

  if (!analysis && isAnalyzing) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-lg shadow-green-500/5 border border-green-100 items-center h-full">
        <h2 className="text-xl font-semibold kulay-ni-aldred mb-2">
          Analyzing Soil…
        </h2>
        <p className="kulay-ni-joyce text-sm max-w-sm">
          Your image is being processed by the AI model and combined with local
          weather and climate data.
        </p>
      </div>
    );
  }

  if (!analysis) return null;

  const crops = analysis.recommendedCrops || [];
  const activeCrop = crops[activeCropIndex];

  const levelColor = (level) => {
    if (!level) return { bg: "#f3f4f6", text: "#374151" };
    const l = level.toLowerCase();
    if (l === "high") return { bg: "#fee2e2", text: "#b91c1c" };
    if (l === "medium") return { bg: "#fffbeb", text: "#b45309" };
    return { bg: "#eff6ff", text: "#1d4ed8" };
  };

  return (
    <div className="space-y-8">
      {/* ================= ANALYSIS CARD (matches initial design more closely) ================= */}
      <section className="bg-white rounded-3xl p-8 shadow-lg shadow-green-500/5 border border-green-100 space-y-6">
        {/* Header */}
        <div className="flex items-center mb-2">
          <div>
            <h2 className="text-xl font-semibold kulay-ni-aldred mb-2">
              Analysis Results
            </h2>
            <p className="kulay-ni-joyce text-sm max-w-sm">AI-powered insights</p>
          </div>
        </div>

        {(analysis.weatherAdjustment || analysis.locationAdjustment) && (
          <div className="analysis-main weather-box--temp rounded-2xl px-5 py-4 text-sm border"
            style={{
              borderColor: "#fde68a",
            }}
          >
            <div>
              <ThermometerSun size={28} className="text-amber-500" />
            </div>
            <div className="analysis-label kulay-ni-ailec">
              {analysis.weatherAdjustment && (
                <p>{analysis.weatherAdjustment}</p>
              )}
              {analysis.locationAdjustment && (
                <p>{analysis.locationAdjustment}</p>
              )}
            </div>
          </div>
        )}
      
        {/* Soil type + pH + moisture */}
        <div className="soil-main grid gap-4 md:grid-cols-2">
          {/* Soil type card (mint) */}
          <div
            className="rounded-2xl px-5 py-4 space-y-2 border"
            style={{
              backgroundColor: "#77d5a9",
              borderColor: "#bbf7d0",
            }}
          >
            <div className="flex items-center justify-center gap-2 text-m font-semibold kulay-ni-aldred mb-1">
              <Leaf className="w-8 h-8" />
              <span>Soil Type</span>
            </div>
            <p className="kulay-ni-ailec font-semibold">
              {analysis.soilType}
              {aiSoilType && (
                <span className="ml-1 text-sm kulay-ni-ailec font-normal">
                  (model: {aiSoilType})
                </span>
              )}
            </p>
            <p className="kulay-ni-ailec text-sm ">{analysis.texture}</p>
          </div>

          {/* pH + Moisture (white) */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* pH card – number pill + Neutral line with dot */}
            <div className="weather-box--humid rounded-2xl border border-green-100 px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-m font-semibold kulay-ni-aldred">
                  pH Level
                </span>
                <span
                  className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold shadow-sm"
                  style={{
                    backgroundColor: "#0ca93b",
                    color: "#0a1f19",
                  }}
                >
                  {analysis.pH}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm kulay-ni-ailec">
                <span
                  className="inline-block rounded-full"
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: "#22c55e",
                  }}
                />
                <span>Neutral</span>
              </div>
            </div>

            {/* Moisture card – icon + value + env line */}
            <div className="weather-box--humid rounded-2xl border border-green-100 px-5 py-4">
              <div className="flex items-center justify-center gap-2 text-m font-semibold  mb-1">
                <div className="text-m font-semibold kulay-ni-aldred">
                  <Droplets className="w-8 h-8" />
                </div>
                <span className="text-m font-semibold kulay-ni-aldred">
                  Moisture
                </span>
              </div>
              <p className="kulay-ni-ailec text-sm mb-1">{analysis.moisture}</p>
              {weather && location && (
                <p className="text-sm kulay-ni-ailec">
                  {location.city}, {location.country} •{" "}
                  {weather.temperature}°C • {weather.humidity}% humidity
                </p>
              )}
            </div>
          </div>
        </div>

        {/* NPK tiles – big pastel cards like initial design */}
        <div className="mt-2">
          <p className="text-m font-semibold kulay-ni-aldred mb-3">
            Nutrient Levels (NPK)
          </p>

          <div className="flex flex-wrap gap-4">
            {["nitrogen", "phosphorus", "potassium"].map((key) => {
              const value = analysis.nutrients?.[key];
              const colors = levelColor(value);
              const label =
                key === "nitrogen"
                  ? "Nitrogen"
                  : key === "phosphorus"
                  ? "Phosphorus"
                  : "Potassium";

              return (
                <div
                  key={key}
                  className="rounded-2xl px-6 py-3 text-center shadow-sm min-w-[110px]"
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.text,
                  }}
                >
                  <div className="text-sm font-semibold mb-2">{label}</div>
                  <div>
                    {value || "Unknown"}
                  </div>
                </div>
              );
            })}

            {aiConfidence != null && (
              <div className="rounded-2xl px-4 py-3 border border-slate-100 bg-slate-50 text-xs text-slate-700">
                Model confidence:{" "}
                <span className="font-semibold">
                  {(aiConfidence * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= RECOMMENDED CROPS ================= */}
      <section className="bg-white rounded-3xl p-8 shadow-lg shadow-green-500/5 border border-green-100 space-y-4">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
          </div>
          <div>
            <h2 className="text-xl font-semibold kulay-ni-aldred mb-2">
              Recommended Crops
            </h2>
            <p className="kulay-ni-joyce text-sm">
              Ranked by suitability for your soil and current conditions.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {crops.map((crop) => (
            <div
              key={crop.name}
              className="crops-color rounded-2xl border border-green-100 bg-emerald-50/40 px-5 py-4"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <div className="text-m kulay-ni-aldred font-semibold">
                    {crop.name}
                  </div>
                </div>

                <div className="text-right text-xs text-green-800">
                  <div className="font-semibold">Match</div>
                  <div>{Math.round(crop.suitability)}% Match</div>
                  <div className="mt-1 text-[11px] kulay-ni-ailec">
                    {crop.weatherImpact}
                  </div>
                </div>
              </div>

              <p className="kulay-ni-ailec text-sm">{crop.reason}</p>
            </div>
          ))}

          {crops.length === 0 && (
            <p className="text-sm kulay-ni-aldred">
              No crop recommendations available for this soil type.
            </p>
          )}
        </div>
      </section>

      {/* ================= GROWTH TIMELINE ================= */}
      <section className="bg-white rounded-3xl p-8 shadow-lg shadow-green-500/5 border border-green-100 space-y-6">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
          </div>
          <div>
            <h2 className="text-xl font-semibold kulay-ni-aldred mb-2">
              Growth Timeline
            </h2>
            <p className="kulay-ni-joyce text-sm">
              Step-by-step guide for planting and harvesting in your soil type.
            </p>
          </div>
        </div>

        {/* crop tabs */}
        <div className="flex flex-wrap gap-10">
          {crops.map((crop, index) => {
            const isActive = index === activeCropIndex;
            return (
              <button
                key={crop.name}
                type="button"
                onClick={() => setActiveCropIndex(index)}
                className={`crops-tab px-4 py-1.5 text-sm font-semibold kulay-ni-kyle rounded border ${
                  isActive
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50"
                }`}
              >
                {crop.name}
              </button>
            );
          })}
        </div>

        {/* steps */}
        {activeCrop ? (
          <div className="mt-4">
            <p className="text-sm kulay-ni-joyce mb-4">
              Follow this timeline for{" "}
              <span className="text-sm kulay-ni-joyce font-semibold">{activeCrop.name}</span> in{" "}
              <span className="text-sm kulay-ni-joyce font-semibold">{analysis.soilType}</span>.
            </p>

            <div className="space-y-3">
              {activeCrop.growthTimeline.map((step, index) => (
                <div
                  key={`${step.stage}-${index}`}
                  className="crops-color rounded-2xl border border-green-100 bg-emerald-50/40 px-5 py-4"
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <p className="text-m font-semibold kulay-ni-aldred">
                      {step.stage}
                    </p>
                    {step.duration && (
                      <span className="crops-tab px-2.5 py-1 rounded-full border-emerald-100 text-[11px] font-medium kulay-ni-kyle">
                        {step.duration}
                      </span>
                    )}
                  </div>
                  <p className="text-sm kulay-ni-ailec leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-green-700">
            No growth timeline available. Try analyzing another soil image.
          </p>
        )}
      </section>
    </div>
  );
}
