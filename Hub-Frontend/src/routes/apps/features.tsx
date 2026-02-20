/**
 * /apps/features — 전체 기능 카탈로그 페이지
 *
 * 9개 앱의 모든 기능을 앱별로 열거하고 간단 소개합니다.
 * 로그인 여부와 관계없이 접근 가능합니다.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ChevronLeft, Sparkles, ArrowRight, ExternalLink } from "lucide-react";
import { appShowcaseData, type AppShowcaseItem } from "@/constants/app-showcase-data";
import { appFeatureCatalog, type FeatureItem } from "@/constants/app-feature-catalog";

export const Route = createFileRoute("/apps/features")({
    component: FeatureCatalogPage,
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 태그 색상 맵
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const tagColors: Record<string, { bg: string; text: string }> = {
    핵심: { bg: "#dbeafe", text: "#1d4ed8" },
    신규: { bg: "#dcfce7", text: "#15803d" },
    연계: { bg: "#fef3c7", text: "#b45309" },
    AI: { bg: "#f3e8ff", text: "#7c3aed" },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 전체 기능 수
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const totalFeatures = appFeatureCatalog.reduce(
    (sum, app) => sum + app.features.length,
    0,
);

function featureSlug(name: string): string {
    return name
        .replace(/[\s/]+/g, "-")
        .replace(/[()&]/g, "")
        .toLowerCase();
}

function FeatureCatalogPage() {
    return (
        <div style={{ background: "#fafafa", minHeight: "100vh" }}>
            {/* ═══════ Hero ═══════ */}
            <section
                style={{
                    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Decorative */}
                <div
                    style={{
                        position: "absolute",
                        top: -100,
                        right: -100,
                        width: 400,
                        height: 400,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)",
                    }}
                />

                <div
                    style={{
                        maxWidth: 960,
                        margin: "0 auto",
                        padding: "16px 24px 56px",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <Link
                        to="/apps"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 14,
                            fontWeight: 500,
                            color: "rgba(255,255,255,0.6)",
                            textDecoration: "none",
                            padding: "8px 0",
                            marginBottom: 20,
                        }}
                    >
                        <ChevronLeft style={{ width: 16, height: 16 }} />
                        앱 소개관
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                marginBottom: 12,
                            }}
                        >
                            <Sparkles style={{ width: 18, height: 18, color: "#a78bfa" }} />
                            <span
                                style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: "#a78bfa",
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                }}
                            >
                                Feature Catalog
                            </span>
                        </div>
                        <h1
                            style={{
                                fontSize: "clamp(26px, 5vw, 36px)",
                                fontWeight: 800,
                                color: "#fff",
                                letterSpacing: "-0.03em",
                                lineHeight: 1.2,
                                marginBottom: 10,
                            }}
                        >
                            거북스쿨 전체 기능 카탈로그
                        </h1>
                        <p
                            style={{
                                fontSize: 15,
                                color: "rgba(255,255,255,0.6)",
                                lineHeight: 1.6,
                                maxWidth: 520,
                            }}
                        >
                            9개 앱 ×{" "}
                            <span style={{ color: "#a78bfa", fontWeight: 700 }}>
                                총 {totalFeatures}개 기능
                            </span>
                            을 한 페이지에서 살펴보세요.
                        </p>

                        {/* Quick jump nav */}
                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                                flexWrap: "wrap",
                                marginTop: 24,
                            }}
                        >
                            {appShowcaseData.map((app) => (
                                <a
                                    key={app.id}
                                    href={`#${app.id}`}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 6,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        padding: "6px 12px",
                                        borderRadius: 9999,
                                        background: "rgba(255,255,255,0.08)",
                                        color: "rgba(255,255,255,0.8)",
                                        textDecoration: "none",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        transition: "all 200ms ease",
                                    }}
                                    className="hover:bg-white/15"
                                >
                                    <div
                                        style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: "50%",
                                            background: app.color,
                                        }}
                                    />
                                    {app.title}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══════ App Feature Sections ═══════ */}
            <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px 80px" }}>
                {appShowcaseData.map((app, idx) => {
                    const catalog = appFeatureCatalog.find((c) => c.appId === app.id);
                    if (!catalog) return null;

                    return (
                        <AppFeatureSection
                            key={app.id}
                            app={app}
                            features={catalog.features}
                            index={idx}
                        />
                    );
                })}
            </div>

            {/* ═══════ Bottom CTA ═══════ */}
            <section
                style={{
                    background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                    padding: "56px 24px",
                    textAlign: "center",
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2
                        style={{
                            fontSize: 22,
                            fontWeight: 700,
                            color: "#fff",
                            marginBottom: 8,
                        }}
                    >
                        모든 기능을 직접 체험해보세요
                    </h2>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 24 }}>
                        거북스쿨 계정 하나로 {totalFeatures}개 기능을 이용할 수 있습니다.
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <Link
                            to="/auth/login"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                height: 44,
                                padding: "0 28px",
                                borderRadius: 12,
                                background: "#fff",
                                color: "#1e293b",
                                fontSize: 14,
                                fontWeight: 700,
                                textDecoration: "none",
                            }}
                        >
                            시작하기 <ArrowRight style={{ width: 14, height: 14 }} />
                        </Link>
                        <Link
                            to="/apps"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                height: 44,
                                padding: "0 28px",
                                borderRadius: 12,
                                background: "rgba(255,255,255,0.1)",
                                color: "#fff",
                                fontSize: 14,
                                fontWeight: 600,
                                textDecoration: "none",
                                border: "1px solid rgba(255,255,255,0.15)",
                            }}
                        >
                            앱 소개관
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// 앱별 기능 섹션
// ═══════════════════════════════════════════════════════════════
function AppFeatureSection({
    app,
    features,
    index,
}: {
    app: AppShowcaseItem;
    features: FeatureItem[];
    index: number;
}) {
    const Icon = app.lucideIcon;

    return (
        <motion.section
            id={app.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            viewport={{ once: true, margin: "-30px" }}
            style={{
                marginBottom: 48,
                scrollMarginTop: 32,
            }}
        >
            {/* Section Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                    flexWrap: "wrap",
                    gap: 12,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            background: app.gradient,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            flexShrink: 0,
                        }}
                    >
                        <Icon style={{ width: 18, height: 18 }} />
                    </div>
                    <div>
                        <h2
                            style={{
                                fontSize: 20,
                                fontWeight: 700,
                                color: "#111827",
                                letterSpacing: "-0.02em",
                                margin: 0,
                            }}
                        >
                            {app.title}
                        </h2>
                        <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
                            {app.subtitle} · {features.length}개 기능
                        </p>
                    </div>
                </div>

                <Link
                    to="/apps/$appId"
                    params={{ appId: app.id }}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 13,
                        fontWeight: 600,
                        color: app.color,
                        textDecoration: "none",
                        padding: "6px 12px",
                        borderRadius: 8,
                        border: `1px solid ${app.color}30`,
                        transition: "all 200ms ease",
                    }}
                    className="hover:shadow-sm"
                >
                    앱 소개 <ExternalLink style={{ width: 12, height: 12 }} />
                </Link>
            </div>

            {/* Feature List */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #f3f4f6",
                    overflow: "hidden",
                }}
            >
                {features.map((feature, fi) => (
                    <a
                        key={fi}
                        href={`/apps/${app.id}#${featureSlug(feature.name)}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: fi * 0.03 }}
                            viewport={{ once: true }}
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 12,
                                padding: "14px 20px",
                                borderBottom: fi < features.length - 1 ? "1px solid #f9fafb" : "none",
                                transition: "background 150ms ease",
                                cursor: "pointer",
                            }}
                            className="hover:bg-gray-50/80"
                        >
                            {/* Number */}
                            <span
                                style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: "#d1d5db",
                                    minWidth: 20,
                                    paddingTop: 2,
                                    textAlign: "right",
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {String(fi + 1).padStart(2, "0")}
                            </span>

                            {/* Content */}
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color: "#1f2937",
                                        }}
                                    >
                                        {feature.name}
                                    </span>
                                    {feature.tag && (
                                        <span
                                            style={{
                                                fontSize: 10,
                                                fontWeight: 700,
                                                padding: "2px 7px",
                                                borderRadius: 6,
                                                background: tagColors[feature.tag]?.bg || "#f3f4f6",
                                                color: tagColors[feature.tag]?.text || "#6b7280",
                                                letterSpacing: "0.02em",
                                            }}
                                        >
                                            {feature.tag}
                                        </span>
                                    )}
                                </div>
                                <p
                                    style={{
                                        fontSize: 13,
                                        color: "#9ca3af",
                                        margin: "3px 0 0",
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {feature.description}
                                </p>
                            </div>

                            {/* Arrow hint */}
                            <ArrowRight
                                style={{
                                    width: 14,
                                    height: 14,
                                    color: "#e5e7eb",
                                    marginTop: 4,
                                    flexShrink: 0,
                                }}
                            />
                        </motion.div>
                    </a>
                ))}
            </div>
        </motion.section>
    );
}
