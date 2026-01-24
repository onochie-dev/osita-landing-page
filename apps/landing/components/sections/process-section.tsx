"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce, easing } from "@/lib/motion";

// Clean, minimal data transformation graphic
function MeasurementGraphic() {
  // Input: Overlapping chaotic squiggly lines
  const inputLines = [
    { y: 60, amplitude: 12, frequency: 0.14, phase: 0 },
    { y: 75, amplitude: 10, frequency: 0.18, phase: 1.2 },
    { y: 90, amplitude: 14, frequency: 0.12, phase: 0.5 },
    { y: 110, amplitude: 8, frequency: 0.2, phase: 2.1 },
    { y: 125, amplitude: 11, frequency: 0.15, phase: 0.8 },
    { y: 140, amplitude: 13, frequency: 0.13, phase: 1.5 },
    { y: 155, amplitude: 9, frequency: 0.19, phase: 2.8 },
    { y: 175, amplitude: 15, frequency: 0.11, phase: 0.3 },
    { y: 190, amplitude: 10, frequency: 0.16, phase: 1.9 },
    { y: 210, amplitude: 12, frequency: 0.14, phase: 2.5 },
    { y: 225, amplitude: 8, frequency: 0.21, phase: 0.7 },
    { y: 240, amplitude: 11, frequency: 0.15, phase: 1.1 },
  ];

  // Generate squiggly path for input lines
  const generateSquigglyPath = (startY: number, amplitude: number, frequency: number, phase: number) => {
    let d = `M 0 ${startY + Math.sin(phase) * amplitude}`;
    for (let x = 0; x <= 130; x += 2) {
      const y = startY + Math.sin(x * frequency + phase) * amplitude + Math.sin(x * frequency * 2.5 + phase) * (amplitude * 0.3);
      d += ` L ${x} ${y}`;
    }
    return d;
  };

  // Get end Y position of squiggly line
  const getEndY = (line: typeof inputLines[0]) => {
    const x = 130;
    return line.y + Math.sin(x * line.frequency + line.phase) * line.amplitude + Math.sin(x * line.frequency * 2.5 + line.phase) * (line.amplitude * 0.3);
  };

  // Output: 4 data blocks - positioned to match line flow
  const outputBlocks = [
    { y: 45, height: 48 },
    { y: 103, height: 48 },
    { y: 161, height: 48 },
    { y: 219, height: 48 },
  ];

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-transparent">
      <svg
        className="w-full h-full"
        viewBox="0 0 500 300"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* LEFT: Chaotic overlapping input lines */}
        {inputLines.map((line, i) => (
          <motion.path
            key={`input-${i}`}
            d={generateSquigglyPath(line.y, line.amplitude, line.frequency, line.phase)}
            fill="none"
            stroke="#9ca3af"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{
              duration: 1.2,
              delay: i * 0.08,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Connection lines: Input → Circle (converging) */}
        {inputLines.map((line, i) => (
          <motion.path
            key={`to-circle-${i}`}
            d={`M 130 ${getEndY(line)} Q 165 ${getEndY(line)}, 205 150`}
            fill="none"
            stroke="#d1d5db"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{
              duration: 0.6,
              delay: 1 + i * 0.06,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* CENTER: Transformation circle with OSITA */}
        <motion.circle
          cx="250"
          cy="150"
          r="42"
          fill="#fafafa"
          stroke="#374151"
          strokeWidth="2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: 1.6,
            repeat: Infinity,
            repeatDelay: 4,
          }}
        />

        {/* OSITA text in center */}
        <motion.text
          x="250"
          y="155"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fontFamily="Inter, system-ui, sans-serif"
          letterSpacing="0.05em"
          fill="#374151"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.4,
            delay: 1.8,
            repeat: Infinity,
            repeatDelay: 4,
          }}
        >
          OSITA
        </motion.text>

        {/* Connection lines: Circle → Output blocks (direct to each block) */}
        {outputBlocks.map((block, i) => (
          <motion.path
            key={`from-circle-${i}`}
            d={`M 292 150 C 320 150, 340 ${block.y + block.height / 2}, 360 ${block.y + block.height / 2}`}
            fill="none"
            stroke="#d1d5db"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{
              duration: 0.5,
              delay: 2.2 + i * 0.1,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeOut",
            }}
          />
        ))}

        {/* RIGHT: Clean output data blocks */}
        {outputBlocks.map((block, i) => (
          <g key={`block-${i}`}>
            {/* Block container */}
            <motion.rect
              x="360"
              y={block.y}
              width="115"
              height={block.height}
              fill="#fafafa"
              stroke="#374151"
              strokeWidth="1.5"
              rx="3"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                delay: 2.5 + i * 0.12,
                repeat: Infinity,
                repeatDelay: 4,
              }}
            />

            {/* Data rows inside blocks */}
            {[0, 1, 2].map((j) => (
              <motion.rect
                key={`row-${i}-${j}`}
                x="368"
                y={block.y + 10 + j * 13}
                width={j === 0 ? 99 : j === 1 ? 80 : 60}
                height="6"
                fill={j === 0 ? "#374151" : "#d1d5db"}
                rx="1"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{
                  duration: 0.25,
                  delay: 2.7 + i * 0.12 + j * 0.06,
                  repeat: Infinity,
                  repeatDelay: 4,
                }}
                style={{ transformOrigin: "left" }}
              />
            ))}
          </g>
        ))}

        {/* Flowing dots for data movement */}
        {[0, 1, 2, 3].map((i) => (
          <motion.circle
            key={`dot-${i}`}
            r="3"
            fill="#6b7280"
            initial={{ cx: 130, cy: 90 + i * 45, opacity: 0 }}
            animate={{
              cx: [130, 250, 360],
              cy: [90 + i * 45, 150, outputBlocks[i].y + outputBlocks[i].height / 2],
              opacity: [0, 0.5, 0.5, 0],
            }}
            transition={{
              duration: 2,
              delay: 1.2 + i * 0.3,
              repeat: Infinity,
              repeatDelay: 3.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// Reporting Graphic - Documents being generated
function ReportingGraphic() {
  const documents = [0, 1, 2];

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {documents.map((i) => (
        <motion.div
          key={i}
          className="absolute w-48 h-64 bg-white border-2 border-gray-300 rounded-lg shadow-lg"
          style={{ zIndex: documents.length - i }}
          initial={{ y: -100, opacity: 0, rotateX: -20 }}
          animate={{
            y: i * 20,
            x: i * 10,
            opacity: 1,
            rotateX: 0,
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.3,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        >
          <div className="p-4 space-y-2">
            <div className="h-3 bg-gray-700 rounded w-3/4"></div>
            <div className="h-2 bg-gray-300 rounded w-full"></div>
            <div className="h-2 bg-gray-300 rounded w-5/6"></div>
            <div className="h-2 bg-gray-300 rounded w-full"></div>
            <div className="mt-4 space-y-1">
              {Array.from({ length: 8 }).map((_, j) => (
                <motion.div
                  key={j}
                  className="h-1.5 bg-gray-200 rounded"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.3 + j * 0.1,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Verification Graphic - Checkmarks cascading top to bottom
function VerificationGraphic() {
  const checkItems = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <div className="w-48 h-64 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="space-y-3">
          {checkItems.map((i) => (
            <div key={i} className="flex items-center gap-2">
              <motion.div
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                initial={{ backgroundColor: "#e5e7eb", scale: 0.8 }}
                animate={{
                  backgroundColor: ["#e5e7eb", "#10B981", "#10B981"],
                  scale: [0.8, 1.1, 1],
                }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.35,
                  repeat: Infinity,
                  repeatDelay: 4,
                }}
              >
                <motion.svg
                  className="w-2.5 h-2.5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1] }}
                  transition={{
                    duration: 0.2,
                    delay: i * 0.35 + 0.2,
                    repeat: Infinity,
                    repeatDelay: 4,
                  }}
                >
                  <path d="M5 13l4 4L19 7" />
                </motion.svg>
              </motion.div>
              <div className="flex-1 space-y-1">
                <motion.div
                  className="h-1.5 bg-gray-300 rounded"
                  style={{ width: `${95 - (i % 3) * 20}%` }}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: [0.3, 0.8, 0.8] }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.35,
                    repeat: Infinity,
                    repeatDelay: 4,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Procurement Graphic - EUA/CBAM market display
function ProcurementGraphic() {
  // Static price chart data with more volatility
  const chartData = [65, 62, 68, 64, 70, 66, 63, 69, 72, 67, 64, 71, 68, 65, 68];
  const min = Math.min(...chartData);
  const max = Math.max(...chartData);
  const range = max - min;

  const generatePath = () => {
    const points = chartData.map((value, index) => {
      const x = (index / (chartData.length - 1)) * 140;
      const y = 50 - ((value - min) / range) * 45;
      return `${x},${y}`;
    });
    return `M ${points.join(" L ")}`;
  };

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <div className="w-52 h-80 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-medium text-gray-800">EUA Spot</div>
            <div className="text-[8px] text-gray-400">EU Allowance</div>
          </div>
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-green-500"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* VWAP - Primary Reference Price */}
        <div className="px-3 py-2">
          <div className="flex items-baseline justify-between mb-1">
            <div>
              <div className="text-[8px] text-gray-400 uppercase tracking-wide mb-0.5">VWAP</div>
              <motion.div
                className="flex items-baseline gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3, repeat: Infinity, repeatDelay: 4 }}
              >
                <span className="text-xl font-semibold text-gray-900 tabular-nums">67.89</span>
                <span className="text-[10px] text-gray-400">EUR</span>
              </motion.div>
            </div>
            <motion.div
              className="flex flex-col items-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5, repeat: Infinity, repeatDelay: 4 }}
            >
              <span className="text-[10px] text-green-600 font-medium">+0.35</span>
              <span className="text-[9px] text-green-600">(+0.5%)</span>
            </motion.div>
          </div>
          <div className="text-[8px] text-gray-400 mt-1">Last: 68.24</div>
        </div>

        {/* Chart */}
        <div className="px-3 py-2">
          <svg className="w-full h-14" viewBox="0 0 140 55">
            {/* Grid lines */}
            <line x1="0" y1="15" x2="140" y2="15" stroke="#f3f4f6" strokeWidth="1" />
            <line x1="0" y1="35" x2="140" y2="35" stroke="#f3f4f6" strokeWidth="1" />
            
            {/* Chart line */}
            <motion.path
              d={generatePath()}
              fill="none"
              stroke="#374151"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.8, repeat: Infinity, repeatDelay: 2.5 }}
            />
          </svg>
        </div>

        {/* Futures Contract Strip */}
        <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-2 text-[7px]">
            <div>
              <div className="text-gray-400 mb-0.5">MO1 Futures</div>
              <motion.div
                className="text-gray-700 font-medium tabular-nums"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 2, repeat: Infinity, repeatDelay: 4 }}
              >
                68.45
              </motion.div>
            </div>
            <div>
              <div className="text-gray-400 mb-0.5">Dec&apos;2 2026</div>
              <motion.div
                className="text-gray-700 font-medium tabular-nums"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 2.2, repeat: Infinity, repeatDelay: 4 }}
              >
                69.12
              </motion.div>
            </div>
            <div>
              <div className="text-gray-400 mb-0.5">Hedge Ratio (h)</div>
              <motion.div
                className="text-gray-700 font-medium tabular-nums"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 2.4, repeat: Infinity, repeatDelay: 4 }}
              >
                0.96
              </motion.div>
            </div>
            <div>
              <div className="text-gray-400 mb-0.5">Hedge Effectiveness (HE)</div>
              <motion.div
                className="text-gray-700 font-medium tabular-nums"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 2.6, repeat: Infinity, repeatDelay: 4 }}
              >
                97.38%
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-gray-100">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[9px] text-gray-500">CBAM Certificate</span>
            <motion.div
              className="flex items-center gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 2.6, repeat: Infinity, repeatDelay: 4 }}
            >
              <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[9px] text-green-600 font-medium">Acquired</span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Section {
  title: string;
  subtitle: string;
  content: string;
  graphic: React.ComponentType;
  align: "left" | "right";
}

export function ProcessSection() {
  const sections: Section[] = [
    {
      title: "Measurement",
      subtitle:
        "High-resolution emissions modeling transforms raw operational data into audit-grade emissions calculations.",
      content:
        "Osita ingests production records, energy consumption logs, and process parameters to construct facility-level emission inventories. Our estimation engine applies IPCC methodologies, installation-specific emission factors, and instrumentation hierarchies compliant with EU MRV standards. Calculations are traceable to source data, with uncertainty quantification built into every output. Missing instrumentation? We map gaps against Implementing Regulation requirements and provide retrofit guidance.",
      graphic: MeasurementGraphic,
      align: "left",
    },
    {
      title: "Reporting",
      subtitle:
        "Our proprietary CBAM filing engine automates registry submissions for EU importers.",
      content:
        "Generate quarterly CBAM reports structured to Transitional Registry specifications, including embedded emissions, precursor allocations, and carbon price adjustments. All submissions maintain complete audit trails linking declared values to underlying measurement data. Document packages include methodology disclosures, calculation worksheets, and supporting evidence formatted for customs authorities. Version control ensures amendments and resubmissions preserve regulatory compliance across reporting periods.",
      graphic: ReportingGraphic,
      align: "right",
    },
    {
      title: "Verification",
      subtitle:
        "Osita connects emissions data, reports, and calculations directly to accredited third-party verifiers, accelerating verification timelines and lowering costs.",
      content:
        "Verification workflows route evidence packages to accredited bodies with read access to source calculations and measurement protocols. Verifiers validate emission factors, activity data, and calculation logic within the platform, eliminating document exchange cycles. Findings, corrective actions, and verification statements are tracked within each reporting period. The system maintains ISO 14065 conformance documentation and supports both installation-level and product-level verification scopes.",
      graphic: VerificationGraphic,
      align: "left",
    },
    {
      title: "Procurement",
      subtitle:
        "Integrated procurement of CBAM certificates reduces price risk and operational friction.",
      content:
        "Forecast certificate liability based on production schedules, declared emissions intensity, and EU ETS price trajectories. Osita calculates quarterly purchase volumes aligned with importers' CBAM obligations, with scenario modeling for carbon price volatility. Procurement workflows connect forecasts to certificate acquisition, with compliance tracking against surrender deadlines. Position management tools help importers hedge exposure as the definitive regime approaches in 2026.",
      graphic: ProcurementGraphic,
      align: "right",
    },
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto space-y-32">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            className={`grid lg:grid-cols-2 gap-12 items-center ${
              section.align === "right" ? "lg:[grid-auto-flow:dense]" : ""
            }`}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
          >
            {/* Text content */}
            <motion.div 
              className={section.align === "right" ? "lg:col-start-2" : ""}
              variants={{
                hidden: { opacity: 0, x: section.align === "right" ? 20 : -20 },
                visible: { 
                  opacity: 1, 
                  x: 0,
                  transition: { duration: 0.6, ease: easing.entrance },
                },
              }}
            >
              <h2 className="text-4xl tracking-tight text-gray-900 mb-4">
                {section.title}
              </h2>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                {section.subtitle}
              </p>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </motion.div>

            {/* Graphic */}
            <motion.div
              className={`flex items-center justify-center ${
                section.align === "right" ? "lg:col-start-1 lg:row-start-1" : ""
              }`}
              variants={fadeInUp}
            >
              <div className="w-full max-w-md aspect-square rounded-2xl flex items-center justify-center overflow-hidden bg-gray-50 border border-gray-200 p-6">
                <section.graphic />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

