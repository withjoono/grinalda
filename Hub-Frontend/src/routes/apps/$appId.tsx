/**
 * /apps/$appId — 앱 상세 소개 페이지
 *
 * 개별 앱의 기능, 대상 사용자, 핵심 특장점을 상세히 소개합니다.
 * 로그인 여부와 관계없이 접근 가능합니다.
 */

import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
    ArrowRight,
    ChevronLeft,
    ExternalLink,
    CheckCircle2,
    Users as UsersIcon,
} from "lucide-react";
import { getAppById, appShowcaseData, type AppShowcaseItem } from "@/constants/app-showcase-data";
import { generateSSOUrl, getSSOServiceId } from "@/lib/utils/sso-helper";

export const Route = createFileRoute("/apps/$appId")({
    component: AppDetailPage,
});

function AppDetailPage() {
    const { appId } = useParams({ from: "/apps/$appId" });
    const app = getAppById(appId);

    if (!app) {
        return (
            <div
                style={{
                    minHeight: "60vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 16,
                }}
            >
                <p style={{ fontSize: 18, color: "#6b7280" }}>앱을 찾을 수 없습니다.</p>
                <Link
                    to="/apps"
                    style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#3b82f6",
                        textDecoration: "none",
                    }}
                >
                    ← 앱 소개관으로 돌아가기
                </Link>
            </div>
        );
    }

    // Get other apps in same category for "related apps"
    const relatedApps = appShowcaseData.filter(
        (a) => a.category === app.category && a.id !== app.id,
    );

    return (
        <div style={{ background: "#fafafa", minHeight: "100vh" }}>
            {/* ═══════ Hero Section ═══════ */}
            <HeroSection app={app} />

            {/* ═══════ Features Section ═══════ */}
            <FeaturesSection app={app} />

            {/* ═══════ Target Users Section ═══════ */}
            <TargetUsersSection app={app} />

            {/* ═══════ Highlights Section ═══════ */}
            <HighlightsSection app={app} />

            {/* ═══════ Related Apps ═══════ */}
            {relatedApps.length > 0 && (
                <RelatedAppsSection apps={relatedApps} currentApp={app} />
            )}

            {/* ═══════ Bottom CTA ═══════ */}
            <BottomCTA app={app} />
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// Hero Section
// ═══════════════════════════════════════════════════════════════
function HeroSection({ app }: { app: AppShowcaseItem }) {
    const Icon = app.lucideIcon;

    return (
        <section
            style={{
                background: app.gradient,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Decorative circles */}
            <div
                style={{
                    position: "absolute",
                    top: -80,
                    right: -80,
                    width: 300,
                    height: 300,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.06)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: -60,
                    left: -60,
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.04)",
                }}
            />

            <div
                style={{
                    maxWidth: 960,
                    margin: "0 auto",
                    padding: "16px 24px 64px",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Back button */}
                <Link
                    to="/apps"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 14,
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.7)",
                        textDecoration: "none",
                        padding: "8px 0",
                        marginBottom: 24,
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
                    {/* Category badge */}
                    <span
                        style={{
                            display: "inline-block",
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "4px 12px",
                            borderRadius: 9999,
                            background: "rgba(255,255,255,0.15)",
                            color: "rgba(255,255,255,0.9)",
                            marginBottom: 16,
                            backdropFilter: "blur(4px)",
                        }}
                    >
                        {app.categoryLabel}
                    </span>

                    {/* Icon + Title */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            marginBottom: 16,
                        }}
                    >
                        <div
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: 18,
                                background: "rgba(255,255,255,0.2)",
                                backdropFilter: "blur(8px)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                            }}
                        >
                            <Icon style={{ width: 28, height: 28 }} />
                        </div>
                        <div>
                            <h1
                                style={{
                                    fontSize: "clamp(28px, 5vw, 38px)",
                                    fontWeight: 800,
                                    color: "#fff",
                                    letterSpacing: "-0.03em",
                                    lineHeight: 1.2,
                                }}
                            >
                                {app.title}
                            </h1>
                            <p
                                style={{
                                    fontSize: 16,
                                    color: "rgba(255,255,255,0.8)",
                                    marginTop: 4,
                                }}
                            >
                                {app.subtitle}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <p
                        style={{
                            fontSize: 16,
                            color: "rgba(255,255,255,0.85)",
                            lineHeight: 1.7,
                            maxWidth: 600,
                            marginBottom: 28,
                        }}
                    >
                        {app.description}
                    </p>

                    {/* CTA Buttons */}
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <AppLaunchButton app={app} />
                        <Link
                            to="/auth/login"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                height: 48,
                                padding: "0 24px",
                                borderRadius: 14,
                                background: "rgba(255,255,255,0.15)",
                                color: "#fff",
                                fontSize: 15,
                                fontWeight: 600,
                                textDecoration: "none",
                                border: "1px solid rgba(255,255,255,0.2)",
                                backdropFilter: "blur(4px)",
                                transition: "all 200ms ease",
                            }}
                            className="hover:bg-white/25"
                        >
                            회원가입
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════════════
// Features Section
// ═══════════════════════════════════════════════════════════════
function FeaturesSection({ app }: { app: AppShowcaseItem }) {
    return (
        <section style={{ maxWidth: 960, margin: "0 auto", padding: "64px 24px" }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                <h2
                    style={{
                        fontSize: 26,
                        fontWeight: 700,
                        color: "#111827",
                        letterSpacing: "-0.02em",
                        marginBottom: 8,
                    }}
                >
                    핵심 기능
                </h2>
                <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 36 }}>
                    {app.title}의 주요 기능들을 소개합니다.
                </p>
            </motion.div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: 16,
                }}
            >
                {app.features.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.08 }}
                        viewport={{ once: true }}
                        style={{
                            background: "#fff",
                            borderRadius: 20,
                            padding: 24,
                            border: "1px solid #f3f4f6",
                            transition: "all 250ms ease",
                        }}
                        className="hover:shadow-sm hover:-translate-y-0.5"
                    >
                        {/* Emoji Icon */}
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 14,
                                background: `${app.color}0D`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 24,
                                marginBottom: 16,
                            }}
                        >
                            {feature.icon}
                        </div>

                        {/* Title */}
                        <h3
                            style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: "#111827",
                                marginBottom: 6,
                            }}
                        >
                            {feature.title}
                        </h3>

                        {/* Description */}
                        <p
                            style={{
                                fontSize: 14,
                                color: "#6b7280",
                                lineHeight: 1.6,
                            }}
                        >
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════════════
// Target Users Section
// ═══════════════════════════════════════════════════════════════
function TargetUsersSection({ app }: { app: AppShowcaseItem }) {
    const userDescriptions: Record<string, { emoji: string; detail: string }> = {
        학생: { emoji: "🎓", detail: "학습과 입시를 위한 핵심 도구" },
        선생님: { emoji: "👨‍🏫", detail: "학생 관리와 수업 효율을 극대화" },
        학부모: { emoji: "👪", detail: "자녀의 학습 현황을 한눈에 파악" },
    };

    return (
        <section
            style={{
                background: "#fff",
                borderTop: "1px solid #f3f4f6",
                borderBottom: "1px solid #f3f4f6",
            }}
        >
            <div style={{ maxWidth: 960, margin: "0 auto", padding: "56px 24px" }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 8,
                        }}
                    >
                        <UsersIcon style={{ width: 20, height: 20, color: app.color }} />
                        <h2
                            style={{
                                fontSize: 22,
                                fontWeight: 700,
                                color: "#111827",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            누구를 위한 앱인가요?
                        </h2>
                    </div>
                    <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 32 }}>
                        {app.title}은(는) 다음 사용자를 위해 설계되었습니다.
                    </p>
                </motion.div>

                <div
                    style={{
                        display: "flex",
                        gap: 16,
                        flexWrap: "wrap",
                    }}
                >
                    {app.targetUsers.map((user, idx) => {
                        const info = userDescriptions[user] || {
                            emoji: "👤",
                            detail: "",
                        };
                        return (
                            <motion.div
                                key={user}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                style={{
                                    flex: "1 1 200px",
                                    background: `${app.color}08`,
                                    border: `1px solid ${app.color}20`,
                                    borderRadius: 16,
                                    padding: "24px 20px",
                                    textAlign: "center",
                                }}
                            >
                                <div style={{ fontSize: 36, marginBottom: 8 }}>{info.emoji}</div>
                                <h3
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 700,
                                        color: app.color,
                                        marginBottom: 4,
                                    }}
                                >
                                    {user}
                                </h3>
                                <p style={{ fontSize: 13, color: "#6b7280" }}>{info.detail}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════════════
// Highlights Section
// ═══════════════════════════════════════════════════════════════
function HighlightsSection({ app }: { app: AppShowcaseItem }) {
    return (
        <section style={{ maxWidth: 960, margin: "0 auto", padding: "56px 24px" }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                <h2
                    style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: "#111827",
                        letterSpacing: "-0.02em",
                        marginBottom: 24,
                    }}
                >
                    왜 {app.title}인가요?
                </h2>
            </motion.div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {app.highlights.map((highlight, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            padding: "16px 20px",
                            background: "#fff",
                            borderRadius: 14,
                            border: "1px solid #f3f4f6",
                        }}
                    >
                        <CheckCircle2
                            style={{
                                width: 22,
                                height: 22,
                                color: app.color,
                                flexShrink: 0,
                            }}
                        />
                        <span
                            style={{
                                fontSize: 15,
                                fontWeight: 600,
                                color: "#374151",
                            }}
                        >
                            {highlight}
                        </span>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════════════
// Related Apps Section
// ═══════════════════════════════════════════════════════════════
function RelatedAppsSection({
    apps,
    currentApp,
}: {
    apps: AppShowcaseItem[];
    currentApp: AppShowcaseItem;
}) {
    return (
        <section
            style={{
                background: "#fff",
                borderTop: "1px solid #f3f4f6",
            }}
        >
            <div style={{ maxWidth: 960, margin: "0 auto", padding: "56px 24px" }}>
                <h2
                    style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#111827",
                        marginBottom: 20,
                    }}
                >
                    같은 카테고리의 다른 앱
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                        gap: 12,
                    }}
                >
                    {apps.map((app) => {
                        const Icon = app.lucideIcon;
                        return (
                            <Link
                                key={app.id}
                                to="/apps/$appId"
                                params={{ appId: app.id }}
                                style={{ textDecoration: "none" }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        padding: "16px 16px",
                                        borderRadius: 14,
                                        border: "1px solid #f3f4f6",
                                        cursor: "pointer",
                                        transition: "all 200ms ease",
                                    }}
                                    className="hover:shadow-sm hover:bg-gray-50"
                                >
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
                                        <h3
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 700,
                                                color: "#111827",
                                            }}
                                        >
                                            {app.title}
                                        </h3>
                                        <p style={{ fontSize: 12, color: "#9ca3af" }}>
                                            {app.subtitle}
                                        </p>
                                    </div>
                                    <ArrowRight
                                        style={{
                                            width: 14,
                                            height: 14,
                                            color: "#d1d5db",
                                            marginLeft: "auto",
                                        }}
                                    />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════════════
// Bottom CTA
// ═══════════════════════════════════════════════════════════════
function BottomCTA({ app }: { app: AppShowcaseItem }) {
    return (
        <section
            style={{
                background: app.gradient,
                padding: "64px 24px",
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
                        fontSize: 26,
                        fontWeight: 700,
                        color: "#fff",
                        marginBottom: 8,
                    }}
                >
                    지금 {app.title} 시작하기
                </h2>
                <p
                    style={{
                        fontSize: 15,
                        color: "rgba(255,255,255,0.75)",
                        marginBottom: 28,
                        maxWidth: 400,
                        margin: "0 auto 28px",
                    }}
                >
                    거북스쿨 계정으로 바로 사용할 수 있습니다.
                </p>
                <div
                    style={{
                        display: "flex",
                        gap: 12,
                        justifyContent: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <AppLaunchButton app={app} variant="white" />
                    <Link
                        to="/apps"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            height: 48,
                            padding: "0 24px",
                            borderRadius: 14,
                            background: "rgba(255,255,255,0.15)",
                            color: "#fff",
                            fontSize: 15,
                            fontWeight: 600,
                            textDecoration: "none",
                            border: "1px solid rgba(255,255,255,0.2)",
                            backdropFilter: "blur(4px)",
                        }}
                    >
                        다른 앱 둘러보기
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════════════
// App Launch Button (with SSO support)
// ═══════════════════════════════════════════════════════════════
function AppLaunchButton({
    app,
    variant = "gradient",
}: {
    app: AppShowcaseItem;
    variant?: "gradient" | "white";
}) {
    const handleClick = async () => {
        const serviceId = getSSOServiceId(app.appUrl);
        if (!serviceId) {
            window.open(app.appUrl, "_blank");
            return;
        }
        try {
            const ssoUrl = await generateSSOUrl(app.appUrl, serviceId);
            window.open(ssoUrl, "_blank");
        } catch {
            window.open(app.appUrl, "_blank");
        }
    };

    const isWhite = variant === "white";

    return (
        <button
            onClick={handleClick}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                height: 48,
                padding: "0 28px",
                borderRadius: 14,
                background: isWhite ? "#fff" : "rgba(255,255,255,0.2)",
                color: isWhite ? app.color : "#fff",
                fontSize: 15,
                fontWeight: 700,
                border: isWhite ? "none" : "1px solid rgba(255,255,255,0.25)",
                cursor: "pointer",
                transition: "all 200ms ease",
                backdropFilter: isWhite ? "none" : "blur(4px)",
            }}
            className="hover:shadow-lg hover:-translate-y-0.5"
        >
            앱 바로가기
            <ExternalLink style={{ width: 16, height: 16 }} />
        </button>
    );
}
