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
      <div className="bg-white rounded-3xl p-8 shadow-lg shadow-green-500/5 border border-green-100 flex flex-col items-center justify-center text-center h-full">
        <BarChart3 className="w-10 h-10 text-emerald-500 mb-4" />
        <h2 className="text-xl font-semibold text-green-900 mb-2">
          Analysis Results
        </h2>
        <p className="text-green-700 text-sm max-w-sm">
          Upload a clear image of your soil to see AI-powered analysis,
          recommended crops, and a detailed growth timeline.
        </p>
      </div>
    );
  }

  if (!analysis && isAnalyzing) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-lg shadow-green-500/5 border border-green-100 flex flex-col items-center justify-center text-center h-full">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-green-900 mb-2">
          Analyzing Soil…
        </h2>
        <p className="text-green-700 text-sm max-w-sm">
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
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
            style={{
              background:
                "linear-gradient(to bottom right, #22c55e, #16a34a)",
            }}
          >
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-green-900">
              Analysis Results
            </h2>
            <p className="text-green-700 text-sm">AI-powered insights</p>
          </div>
        </div>

        {/* Yellow current-conditions banner */}
        {(analysis.weatherAdjustment || analysis.locationAdjustment) && (
          <div
            className="rounded-2xl px-5 py-4 text-sm border"
            style={{
              backgroundColor: "#fef3c7",
              borderColor: "#fde68a",
            }}
          >
            <div className="flex gap-3">
              <div
                className="mt-[2px] w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#fef9c3" }}
              >
                <ThermometerSun className="w-4 h-4 text-amber-500" />
              </div>
              <div className="space-y-1 text-amber-900">
                {analysis.weatherAdjustment && (
                  <p>{analysis.weatherAdjustment}</p>
                )}
                {analysis.locationAdjustment && (
                  <p>{analysis.locationAdjustment}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Soil type + pH + moisture */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Soil type card (mint) */}
          <div
            className="rounded-2xl px-5 py-4 space-y-2 border"
            style={{
              backgroundColor: "#ecfdf3",
              borderColor: "#bbf7d0",
            }}
          >
            <div className="flex items-center gap-2 text-sm font-medium text-green-900 mb-1">
              <Leaf className="w-4 h-4" />
              <span>Soil Type</span>
            </div>
            <p className="text-green-900 font-semibold">
              {analysis.soilType}
              {aiSoilType && (
                <span className="ml-1 text-xs text-green-700 font-normal">
                  (model: {aiSoilType})
                </span>
              )}
            </p>
            <p className="text-green-700 text-sm">{analysis.texture}</p>
          </div>

          {/* pH + Moisture (white) */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* pH card – number pill + Neutral line with dot */}
            <div className="rounded-2xl border border-green-100 px-5 py-4 bg-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-green-900">
                  pH Level
                </span>
                <span
                  className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold shadow-sm"
                  style={{
                    backgroundColor: "#22c55e",
                    color: "white",
                  }}
                >
                  {analysis.pH}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-700">
                <span
                  className="inline-block rounded-full"
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor: "#22c55e",
                  }}
                />
                <span>Neutral</span>
              </div>
            </div>

            {/* Moisture card – icon + value + env line */}
            <div className="rounded-2xl border border-green-100 px-5 py-4 bg-white">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#ecfdf3" }}
                >
                  <Droplets className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-sm font-medium text-green-900">
                  Moisture
                </span>
              </div>
              <p className="text-green-800 text-sm mb-1">{analysis.moisture}</p>
              {weather && location && (
                <p className="text-xs text-green-700">
                  {location.city}, {location.country} •{" "}
                  {weather.temperature}°C • {weather.humidity}% humidity
                </p>
              )}
            </div>
          </div>
        </div>

        {/* NPK tiles – big pastel cards like initial design */}
        <div className="mt-2">
          <p className="text-sm font-medium text-green-900 mb-3">
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
                  <div className="text-xs font-semibold mb-2">{label}</div>
                  <div
                    className="inline-flex px-3 py-1 rounded-full text-[11px] font-semibold"
                    style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                  >
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
        <div className="flex items-start gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-green-900">
              Recommended Crops
            </h2>
            <p className="text-green-700 text-sm">
              Ranked by suitability for your soil and current conditions.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {crops.map((crop) => (
            <div
              key={crop.name}
              className="rounded-2xl border border-green-100 bg-emerald-50/40 px-5 py-4"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <div className="text-sm text-green-900 font-semibold">
                    {crop.name}
                  </div>
                </div>

                <div className="text-right text-xs text-green-800">
                  <div className="font-semibold">Match</div>
                  <div>{Math.round(crop.suitability)}% Match</div>
                  <div className="mt-1 text-[11px] text-green-700">
                    {crop.weatherImpact}
                  </div>
                </div>
              </div>

              <p className="text-green-800 text-sm">{crop.reason}</p>
            </div>
          ))}

          {crops.length === 0 && (
            <p className="text-sm text-green-700">
              No crop recommendations available for this soil type.
            </p>
          )}
        </div>
      </section>

      {/* ================= GROWTH TIMELINE ================= */}
      <section className="bg-white rounded-3xl p-8 shadow-lg shadow-green-500/5 border border-green-100 space-y-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-green-900">
              Growth Timeline
            </h2>
            <p className="text-green-700 text-sm">
              Step-by-step guide for planting and harvesting in your soil type.
            </p>
          </div>
        </div>

        {/* crop tabs */}
        <div className="flex flex-wrap gap-2">
          {crops.map((crop, index) => {
            const isActive = index === activeCropIndex;
            return (
              <button
                key={crop.name}
                type="button"
                onClick={() => setActiveCropIndex(index)}
                className={`px-4 py-1.5 text-xs font-medium rounded border ${
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
            <p className="text-sm text-green-800 mb-4">
              Follow this timeline for{" "}
              <span className="font-semibold">{activeCrop.name}</span> in{" "}
              <span className="font-semibold">{analysis.soilType}</span>.
            </p>

            <div className="space-y-3">
              {activeCrop.growthTimeline.map((step, index) => (
                <div
                  key={`${step.stage}-${index}`}
                  className="rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <p className="text-sm font-semibold text-green-900">
                      {step.stage}
                    </p>
                    {step.duration && (
                      <span className="px-2.5 py-1 rounded-full bg-white border border-emerald-100 text-[11px] font-medium text-emerald-800">
                        {step.duration}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-green-800 leading-relaxed">
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
