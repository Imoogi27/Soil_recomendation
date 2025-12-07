import React, { useState, useEffect } from "react";
import { ImageUploader } from "./components/ImageUploader";
import { AnalysisResults } from "./components/AnalysisResults";
import { WeatherLocation } from "./components/WeatherLocation";
import { Sprout, Info } from "lucide-react";

export default function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [aiSoilType, setAiSoilType] = useState(null);
  const [aiConfidence, setAiConfidence] = useState(null);

  // ---------------- LOCATION + WEATHER ----------------
  useEffect(() => {
    getLocationAndWeather();
  }, []);

  const getLocationAndWeather = async () => {
    setIsLoadingLocation(true);

    if ("geolocation" in navigator) {
      try {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
              );
              const data = await response.json();

              const city =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.county ||
                "Unknown";
              const country = data.address.country || "Unknown";
              const climate = determineClimate(position.coords.latitude);

              const mockLocation = {
                city,
                country,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                climate,
              };

              const mockWeather = generateMockWeather(climate);

              setLocation(mockLocation);
              setWeather(mockWeather);
              setIsLoadingLocation(false);
            } catch (error) {
              const climate = determineClimate(position.coords.latitude);
              const mockLocation = generateMockLocation(
                position.coords.latitude,
                position.coords.longitude
              );
              const mockWeather = generateMockWeather(climate);

              setLocation(mockLocation);
              setWeather(mockWeather);
              setIsLoadingLocation(false);
            }
          },
          (error) => {
            const defaultLocation = generateMockLocation(40.7128, -74.006);
            setLocation(defaultLocation);
            setWeather(generateMockWeather(defaultLocation.climate));
            setIsLoadingLocation(false);
          },
          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      } catch (error) {
        const defaultLocation = generateMockLocation(40.7128, -74.006);
        setLocation(defaultLocation);
        setWeather(generateMockWeather(defaultLocation.climate));
        setIsLoadingLocation(false);
      }
    } else {
      const defaultLocation = generateMockLocation(40.7128, -74.006);
      setLocation(defaultLocation);
      setWeather(generateMockWeather(defaultLocation.climate));
      setIsLoadingLocation(false);
    }
  };



const handleImageUpload = async (file, previewUrl) => {
  setUploadedImage(previewUrl);
  setIsAnalyzing(true);
  setAnalysis(null);

  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:5000/api/soil/analyze-image", {
      method: "POST",
      body: formData,
    });

    // Read raw text so we can debug easily
    const text = await res.text();
    console.log("Backend status:", res.status, res.statusText);
    console.log("Backend raw body:", text);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("JSON parse error:", e);
      throw new Error("Response is not valid JSON");
    }

    const rawSoilType =
      data.soilType || data.soil_type || data.predicted_class || "Unknown";

    const analysisResult = generateMockAnalysis(
      rawSoilType,  // aiSoilType
      weather,
      location
    );

    // optional: keep model confidence to show in UI
    analysisResult.modelConfidence =
      data.confidence !== undefined ? data.confidence : null;

    setAnalysis(analysisResult);
  } catch (err) {
    console.error("Error analyzing soil:", err);
    alert("Error analyzing soil image. Check console for details.");
  } finally {
    setIsAnalyzing(false);
  }
};
const handleReset = () => {
  setUploadedImage(null);
  setAnalysis(null);
  setAiSoilType(null);
  setAiConfidence(null);
  setIsAnalyzing(false);
};

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <Sprout className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-semibold text-green-900">
              AI Soil Analysis
            </h1>
          </div>
          <p className="text-green-700 text-lg max-w-2xl mx-auto leading-relaxed">
            Advanced soil composition analysis with AI-powered crop
            recommendations
          </p>
        </div>

        {/* Location + Weather card */}
        <WeatherLocation
          weather={weather}
          location={location}
          isLoading={isLoadingLocation}
        />

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-8 mt-10">
          <ImageUploader
            onImageUpload={handleImageUpload}
            uploadedImage={uploadedImage}
            isAnalyzing={isAnalyzing}
            onReset={handleReset}
          />

          <AnalysisResults
            analysis={analysis}
            isAnalyzing={isAnalyzing}
            weather={weather}
            location={location}
            aiSoilType={aiSoilType}
            aiConfidence={aiConfidence}
          />
        </div>

        {/* How it works */}
        <div className="mt-16 bg-white rounded-3xl p-10 shadow-lg shadow-green-500/5 border border-green-100/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Info className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-semibold text-green-900">
              How It Works
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Location Detection",
                description:
                  "We automatically detect your location and analyze current weather conditions for accurate recommendations.",
              },
              {
                step: "02",
                title: "AI Soil Analysis",
                description:
                  "Upload a soil photo and our AI analyzes composition, texture, pH levels, and nutrient content.",
              },
              {
                step: "03",
                title: "Smart Recommendations",
                description:
                  "Get personalized crop recommendations with detailed growth timelines optimized for your conditions.",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-6xl mb-4 bg-gradient-to-br from-green-200 to-emerald-200 bg-clip-text text-transparent opacity-40">
                  {item.step}
                </div>
                <h4 className="text-green-900 mb-3 text-lg font-semibold">
                  {item.title}
                </h4>
                <p className="text-green-700 leading-relaxed text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- HELPER FUNCTIONS ----------------

function determineClimate(latitude) {
  const absLat = Math.abs(latitude);
  if (absLat >= 0 && absLat < 23.5) return "Tropical";
  if (absLat >= 23.5 && absLat < 35) return "Subtropical";
  if (absLat >= 35 && absLat < 50) return "Temperate";
  if (absLat >= 50 && absLat < 60) return "Continental";
  return "Boreal";
}

function generateMockLocation(lat, lon) {
  const climate = determineClimate(lat);
  return {
    city: "Your Location",
    country: "Unknown",
    latitude: lat,
    longitude: lon,
    climate,
  };
}

function generateMockWeather(climate) {
  const patterns = {
    Tropical: {
      temperature: 28,
      condition: "Humid",
      humidity: 85,
      rainfall: 200,
      season: "Rainy",
    },
    Subtropical: {
      temperature: 25,
      condition: "Warm",
      humidity: 70,
      rainfall: 120,
      season: "Summer",
    },
    Temperate: {
      temperature: 18,
      condition: "Partly Cloudy",
      humidity: 65,
      rainfall: 100,
      season: "Spring",
    },
    Continental: {
      temperature: 12,
      condition: "Overcast",
      humidity: 70,
      rainfall: 80,
      season: "Fall",
    },
    Boreal: {
      temperature: 8,
      condition: "Cool",
      humidity: 75,
      rainfall: 60,
      season: "Spring",
    },
  };

  return patterns[climate] || patterns.Temperate;
}

function normalizeSoilType(raw) {
  if (!raw) return "Loamy Soil";
  const s = raw.toLowerCase();

  if (s.includes("alluvial")) return "Alluvial Soil";
  if (s.includes("clay")) return "Clayey Soil";
  if (s.includes("laterite")) return "Laterite Soil";
  if (s.includes("sandy loam")) return "Sandy Loam";
  if (s.includes("sandy") && !s.includes("loam")) return "Sandy Soil";
  if (s.includes("loam")) return "Loamy Soil";

  return "Loamy Soil";
}

function generateMockAnalysis(aiSoilType, weather, location) {
  const soilTypes = [
    // 1. LOAMY SOIL
    {
      type: "Loamy Soil",
      pH: 6.5,
      nitrogen: "Medium",
      phosphorus: "High",
      potassium: "Medium",
      moisture: "Good",
      texture:
        "Well-balanced mixture of sand, silt, and clay with good drainage",
      crops: [
        {
          name: "Tomatoes",
          suitability: 95,
          reason:
            "Loamy soil holds nutrients and drains well, ideal for fruiting crops.",
          growthTimeline: [
            {
              stage: "Seed Germination",
              duration: "5–10 days",
              description: "Sow seeds 1/4 inch deep in seed trays or plugs.",
            },
            {
              stage: "Seedling Development",
              duration: "3–4 weeks",
              description:
                "Transplant when 6–8 inches tall with several true leaves.",
            },
            {
              stage: "Vegetative Growth",
              duration: "4–6 weeks",
              description:
                "Stake plants and fertilize regularly to support strong growth.",
            },
            {
              stage: "Flowering & Fruiting",
              duration: "4–8 weeks",
              description:
                "Maintain consistent moisture; fruits set and ripen.",
            },
            {
              stage: "Harvest",
              duration: "Ongoing",
              description: "Pick fully colored but firm fruits regularly.",
            },
          ],
        },
        {
          name: "Wheat",
          suitability: 90,
          reason: "Loamy fields provide ideal aeration and root depth.",
          growthTimeline: [
            {
              stage: "Planting",
              duration: "1 day",
              description: "Drill seeds 1–2 inches deep in prepared seedbed.",
            },
            {
              stage: "Tillering",
              duration: "3–4 weeks",
              description: "Multiple shoots develop from the base of the plant.",
            },
            {
              stage: "Stem Extension & Heading",
              duration: "4–6 weeks",
              description: "Stems elongate and grain heads emerge.",
            },
            {
              stage: "Grain Filling",
              duration: "4–6 weeks",
              description: "Kernels expand and harden.",
            },
            {
              stage: "Harvest",
              duration: "3–5 days",
              description:
                "Harvest when grain is golden and moisture is around 13–14%.",
            },
          ],
        },
        {
          name: "Carrots",
          suitability: 88,
          reason:
            "Fine, loose structure lets taproots grow straight and deep.",
          growthTimeline: [
            {
              stage: "Seed Planting",
              duration: "1 day",
              description: "Sow seeds shallowly (about 1/4 inch) in rows.",
            },
            {
              stage: "Germination",
              duration: "14–21 days",
              description: "Keep soil moist until seedlings appear.",
            },
            {
              stage: "Root Development",
              duration: "8–10 weeks",
              description:
                "Roots thicken underground; thin plants to proper spacing.",
            },
            {
              stage: "Harvest",
              duration: "2–3 weeks window",
              description:
                "Pull when roots reach desired diameter and color.",
            },
          ],
        },
      ],
    },

    // 2. CLAYEY SOIL
    {
      type: "Clayey Soil",
      pH: 7.2,
      nitrogen: "High",
      phosphorus: "Medium",
      potassium: "High",
      moisture: "High",
      texture: "Heavy soil with fine particles, high water-holding capacity",
      crops: [
        {
          name: "Rice",
          suitability: 95,
          reason: "Clayey paddies retain water, perfect for flooded rice systems.",
          growthTimeline: [
            {
              stage: "Seed Preparation",
              duration: "1–2 days",
              description: "Soak and pre-germinate seeds in water.",
            },
            {
              stage: "Nursery / Seedling Stage",
              duration: "2–3 weeks",
              description: "Grow seedlings densely in a nursery plot.",
            },
            {
              stage: "Transplanting & Tillering",
              duration: "3–5 weeks",
              description: "Transplant to puddled field; multiple tillers form.",
            },
            {
              stage: "Panicle Development & Grain Fill",
              duration: "6–8 weeks",
              description: "Grain heads emerge and kernels mature.",
            },
            {
              stage: "Harvest",
              duration: "5–7 days",
              description: "Harvest when straw is yellow and grains are hard.",
            },
          ],
        },
        {
          name: "Cabbage",
          suitability: 85,
          reason: "Moist, fertile clay supports large leafy heads.",
          growthTimeline: [
            {
              stage: "Seed Starting",
              duration: "1 day",
              description:
                "Start seeds in trays 6–8 weeks before transplanting.",
            },
            {
              stage: "Seedling Growth",
              duration: "4–6 weeks",
              description: "Grow sturdy transplants with strong stems.",
            },
            {
              stage: "Head Formation",
              duration: "8–12 weeks",
              description: "Outer leaves wrap to form a solid head.",
            },
            {
              stage: "Harvest",
              duration: "1–2 weeks window",
              description: "Cut when heads are firm and compact.",
            },
          ],
        },
        {
          name: "Broccoli",
          suitability: 88,
          reason: "Cool, moist clayey soils are favorable for brassicas.",
          growthTimeline: [
            {
              stage: "Nursery Stage",
              duration: "4–6 weeks",
              description: "Raise seedlings in trays or nursery beds.",
            },
            {
              stage: "Vegetative Growth",
              duration: "6–8 weeks",
              description: "Plants form large leaves and thick stems.",
            },
            {
              stage: "Head Formation",
              duration: "2–3 weeks",
              description: "Central head develops at the top of the stem.",
            },
            {
              stage: "Harvest",
              duration: "Ongoing",
              description:
                "Cut main head before florets loosen; side shoots follow.",
            },
          ],
        },
      ],
    },

    // 3. SANDY SOIL
    {
      type: "Sandy Soil",
      pH: 6.0,
      nitrogen: "Low",
      phosphorus: "Medium",
      potassium: "Low",
      moisture: "Low",
      texture:
        "Very coarse particles with rapid drainage and low nutrient retention",
      crops: [
        {
          name: "Potatoes",
          suitability: 90,
          reason: "Loose sand lets tubers expand and reduces risk of rot.",
          growthTimeline: [
            {
              stage: "Planting",
              duration: "1 day",
              description: "Plant seed tubers 4 inches deep on ridges.",
            },
            {
              stage: "Sprouting",
              duration: "2–3 weeks",
              description: "Shoots emerge and rows become visible.",
            },
            {
              stage: "Tuber Initiation",
              duration: "2–3 weeks",
              description: "Small tubers begin forming underground.",
            },
            {
              stage: "Tuber Bulking & Maturation",
              duration: "8–10 weeks",
              description: "Tubers enlarge; vines gradually yellow.",
            },
            {
              stage: "Harvest",
              duration: "3–5 days",
              description: "Dig when foliage is dry and skins are firm.",
            },
          ],
        },
        {
          name: "Carrots",
          suitability: 88,
          reason: "Deep sandy beds prevent forked or twisted roots.",
          growthTimeline: [
            {
              stage: "Sowing",
              duration: "1 day",
              description: "Sow thinly in rows and cover lightly.",
            },
            {
              stage: "Germination",
              duration: "14–21 days",
              description: "Maintain moisture; sand dries quickly.",
            },
            {
              stage: "Root Growth",
              duration: "6–8 weeks",
              description: "Roots lengthen and thicken in loose soil.",
            },
            {
              stage: "Harvest",
              duration: "Ongoing",
              description: "Pull when roots reach desired size and color.",
            },
          ],
        },
        {
          name: "Radishes",
          suitability: 85,
          reason: "Fast-maturing roots do well in warm, well-drained beds.",
          growthTimeline: [
            {
              stage: "Planting",
              duration: "1 day",
              description: "Direct sow 1/2 inch deep with close spacing.",
            },
            {
              stage: "Growth",
              duration: "2–3 weeks",
              description: "Roots swell quickly; avoid water stress.",
            },
            {
              stage: "Harvest",
              duration: "1 week window",
              description: "Harvest promptly to avoid pithy roots.",
            },
          ],
        },
      ],
    },

    // 4. SANDY LOAM
    {
      type: "Sandy Loam",
      pH: 6.2,
      nitrogen: "Medium",
      phosphorus: "Medium",
      potassium: "Medium",
      moisture: "Moderate",
      texture:
        "Light soil with a mix of sand and finer particles, easy to work",
      crops: [
        {
          name: "Groundnut (Peanut)",
          suitability: 92,
          reason: "Loose sandy loam allows pods to develop underground.",
          growthTimeline: [
            {
              stage: "Sowing",
              duration: "1 day",
              description: "Plant seeds 1–2 inches deep in rows.",
            },
            {
              stage: "Vegetative Growth",
              duration: "3–4 weeks",
              description: "Plants form spreading leafy canopy.",
            },
            {
              stage: "Flowering & Pegging",
              duration: "3–4 weeks",
              description: "Flowers form and pegs enter the soil.",
            },
            {
              stage: "Pod Development",
              duration: "4–6 weeks",
              description:
                "Pods expand underground in the loosened soil.",
            },
            {
              stage: "Harvest",
              duration: "1–2 weeks",
              description:
                "Lift plants when most pods are filled and shells dry.",
            },
          ],
        },
        {
          name: "Potatoes",
          suitability: 90,
          reason:
            "Good balance of drainage and moisture supports tuber growth.",
          growthTimeline: [
            {
              stage: "Planting",
              duration: "1 day",
              description: "Plant seed tubers in ridges or beds.",
            },
            {
              stage: "Vegetative Growth",
              duration: "4–6 weeks",
              description:
                "Plants produce foliage; hill soil around stems.",
            },
            {
              stage: "Tuber Bulking",
              duration: "6–8 weeks",
              description: "Tubers increase in size underground.",
            },
            {
              stage: "Harvest",
              duration: "3–5 days",
              description:
                "Harvest when tops yellow and soil is dry.",
            },
          ],
        },
        {
          name: "Onion",
          suitability: 87,
          reason: "Loose structure lets bulbs swell evenly.",
          growthTimeline: [
            {
              stage: "Planting",
              duration: "1 day",
              description:
                "Plant sets or seedlings in rows with good spacing.",
            },
            {
              stage: "Bulb Formation",
              duration: "4–6 weeks",
              description: "Bulbs thicken at the base of the leaves.",
            },
            {
              stage: "Maturity",
              duration: "3–4 weeks",
              description:
                "Necks soften and tops fall over naturally.",
            },
            {
              stage: "Harvest & Curing",
              duration: "1–2 weeks",
              description:
                "Pull bulbs and dry thoroughly before storage.",
            },
          ],
        },
      ],
    },

    // 5. ALLUVIAL SOIL
    {
      type: "Alluvial Soil",
      pH: 6.8,
      nitrogen: "Medium",
      phosphorus: "High",
      potassium: "High",
      moisture: "Good",
      texture:
        "Fine, fertile river-deposited soil with deep profile",
      crops: [
        {
          name: "Rice",
          suitability: 93,
          reason:
            "Fertile, level alluvial plains are ideal for irrigated rice.",
          growthTimeline: [
            {
              stage: "Nursery Stage",
              duration: "2–3 weeks",
              description:
                "Raise seedlings in a small, well-watered area.",
            },
            {
              stage: "Transplanting & Tillering",
              duration: "3–5 weeks",
              description:
                "Transplant to main field; multiple tillers develop.",
            },
            {
              stage: "Panicle Development",
              duration: "3–4 weeks",
              description:
                "Grain heads form and emerge from the sheath.",
            },
            {
              stage: "Grain Fill & Maturity",
              duration: "4–5 weeks",
              description:
                "Kernels harden and straw turns yellow.",
            },
            {
              stage: "Harvest",
              duration: "5–7 days",
              description:
                "Cut and thresh when grains are fully mature.",
            },
          ],
        },
        {
          name: "Sugarcane",
          suitability: 90,
          reason:
            "Deep alluvial soils support long-duration, high-biomass crop.",
          growthTimeline: [
            {
              stage: "Setts Planting",
              duration: "1–2 days",
              description:
                "Plant stem cuttings in furrows at spacing.",
            },
            {
              stage: "Tillering & Grand Growth",
              duration: "6–10 months",
              description:
                "Numerous stalks arise and grow rapidly.",
            },
            {
              stage: "Ripening",
              duration: "2–3 months",
              description:
                "Sugar content increases in maturing canes.",
            },
            {
              stage: "Harvest",
              duration: "1–2 months window",
              description:
                "Cut canes when juice is sweet and tops dry.",
            },
          ],
        },
        {
          name: "Maize (Corn)",
          suitability: 88,
          reason: "High nutrient status favors vigorous maize growth.",
          growthTimeline: [
            {
              stage: "Planting",
              duration: "1 day",
              description: "Sow seeds 1–2 inches deep in moist soil.",
            },
            {
              stage: "Vegetative Growth",
              duration: "4–6 weeks",
              description:
                "Stalk height and leaf area increase rapidly.",
            },
            {
              stage: "Tasseling & Silking",
              duration: "2–3 weeks",
              description:
                "Male and female flowers appear and pollinate.",
            },
            {
              stage: "Grain Filling & Harvest",
              duration: "4–5 weeks",
              description:
                "Kernels fill and ears are harvested at full size.",
            },
          ],
        },
      ],
    },

    // 6. LATERITE SOIL
    {
      type: "Laterite Soil",
      pH: 5.5,
      nitrogen: "Low",
      phosphorus: "Low",
      potassium: "Medium",
      moisture: "Moderate",
      texture:
        "Reddish, iron-rich soil, often on slopes with good drainage",
      crops: [
        {
          name: "Tea",
          suitability: 90,
          reason:
            "Acidic, well-drained laterite in high rainfall areas suits tea bushes.",
          growthTimeline: [
            {
              stage: "Nursery Stage",
              duration: "3–6 months",
              description: "Grow seedlings or cuttings under shade.",
            },
            {
              stage: "Field Planting",
              duration: "1–2 weeks",
              description:
                "Transplant to terraces with proper spacing.",
            },
            {
              stage: "Bush Formation",
              duration: "1–2 years",
              description:
                "Regular pruning shapes low, pluckable bushes.",
            },
            {
              stage: "Plucking",
              duration: "Ongoing",
              description:
                "Harvest tender 2–3 leaves and a bud at intervals.",
            },
          ],
        },
        {
          name: "Coffee",
          suitability: 88,
          reason:
            "Shaded, lateritic uplands support deep-rooted coffee plants.",
          growthTimeline: [
            {
              stage: "Seedling Raising",
              duration: "6–9 months",
              description: "Grow seedlings in bags with shade.",
            },
            {
              stage: "Transplanting",
              duration: "1–2 weeks",
              description:
                "Plant along contours with shade trees.",
            },
            {
              stage: "Vegetative Growth",
              duration: "2–3 years",
              description:
                "Framework branches and canopy develop.",
            },
            {
              stage: "Flowering & Berry Development",
              duration: "8–10 months",
              description:
                "Flowers set berries which ripen to red.",
            },
            {
              stage: "Harvest",
              duration: "1–2 months",
              description:
                "Pick ripe red berries for processing.",
            },
          ],
        },
        {
          name: "Cashew",
          suitability: 85,
          reason: "Hardy trees thrive even on poor, lateritic slopes.",
          growthTimeline: [
            {
              stage: "Planting",
              duration: "1–2 days",
              description:
                "Plant grafts or seedlings at wide spacing.",
            },
            {
              stage: "Canopy Development",
              duration: "2–3 years",
              description:
                "Tree forms broad, spreading crown.",
            },
            {
              stage: "Flowering & Fruiting",
              duration: "3–4 months",
              description:
                "Panicles bear flowers and nuts with apples.",
            },
            {
              stage: "Harvest",
              duration: "1–2 months",
              description:
                "Collect fallen nuts and dry before storage.",
            },
          ],
        },
      ],
    },
  ];

  const normalized = normalizeSoilType(aiSoilType);
  const selectedType =
    soilTypes.find((s) => s.type === normalized) || soilTypes[0];

  const adjustedCrops = selectedType.crops
    .map((crop) => {
      let adjustedSuitability = crop.suitability;
      let weatherImpact = "";

      if (weather) {
        // temperature effects
        if (
          weather.temperature > 25 &&
          ["Lettuce", "Broccoli", "Cabbage"].includes(crop.name)
        ) {
          adjustedSuitability -= 15;
          weatherImpact = "Current temperature is too warm for optimal growth";
        } else if (
          weather.temperature < 15 &&
          ["Tomatoes", "Peppers", "Watermelon"].includes(crop.name)
        ) {
          adjustedSuitability -= 20;
          weatherImpact =
            "Current temperature is too cool, wait for warmer weather";
        } else if (weather.temperature >= 18 && weather.temperature <= 25) {
          adjustedSuitability += 5;
          weatherImpact = "Perfect temperature range for growing";
        }

        // rainfall effects
        if (
          weather.rainfall > 150 &&
          ["Carrots", "Potatoes", "Radishes"].includes(crop.name)
        ) {
          adjustedSuitability -= 10;
          weatherImpact +=
            (weatherImpact ? " • " : "") +
            "High rainfall may cause root issues";
        } else if (
          weather.rainfall < 60 &&
          ["Rice", "Cabbage"].includes(crop.name)
        ) {
          adjustedSuitability -= 15;
          weatherImpact +=
            (weatherImpact ? " • " : "") +
            "Low rainfall, irrigation recommended";
        }
      }

      return {
        ...crop,
        suitability: Math.max(40, Math.min(100, adjustedSuitability)),
        weatherImpact: weatherImpact || "Weather conditions are suitable",
      };
    })
    .sort((a, b) => b.suitability - a.suitability);

  let weatherAdjustment = "";
  let locationAdjustment = "";

  if (weather) {
    weatherAdjustment =
      `Current ${weather.season.toLowerCase()} conditions with ` +
      `${weather.temperature}°C temperature and ${weather.humidity}% ` +
      `humidity have been factored into recommendations.`;
  }

  if (location) {
    locationAdjustment =
      `Your ${location.climate.toLowerCase()} climate zone in ` +
      `${location.city}, ${location.country} influences the crop ` +
      `selection and timing.`;
  }

  return {
    soilType: selectedType.type,
    pH: selectedType.pH,
    nutrients: {
      nitrogen: selectedType.nitrogen,
      phosphorus: selectedType.phosphorus,
      potassium: selectedType.potassium,
    },
    recommendedCrops: adjustedCrops,
    moisture: selectedType.moisture,
    texture: selectedType.texture,
    weatherAdjustment,
    locationAdjustment,
  };
}

