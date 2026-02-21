/**
 * /apps — 앱 소개관 목록 페이지
 *
 * 거북스쿨의 모든 앱을 카테고리별로 소개하는 페이지입니다.
 * 로그인 여부와 관계없이 접근 가능합니다.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, ChevronLeft } from "lucide-react";
import {
    appShowcaseData,
    showcaseCategories,
    type AppShowcaseItem,
} from "@/constants/app-showcase-data";

export const Route = createFileRoute("/apps/")({
    component: AppsShowcasePage,
});

function AppsShowcasePage() {
    return (
        <div style={{ background: "#fafafa", minHeight: "100vh" }}>
            {/* ═══════ Back Nav ═══════ */}
            <div style={{ maxWidth: 960, margin: "0 auto", padding: "8px 24px 0" }}>
                <Link
                    to="/"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#6b7280",
                        textDecoration: "none",
                        padding: "8px 0",
                    }}
                >
                    <ChevronLeft style={{ width: 16, height: 16 }} />
                    메인으로
                </Link>
            </div>

            {/* ═══════ Hero ═══════ */}
            <section style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px 48px" }}>
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
                        <Sparkles style={{ width: 20, height: 20, color: "#f59e0b" }} />
                        <span
                            style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#f59e0b",
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                            }}
                        >
                            앱 소개관
                        </span>
                    </div>
                    <h1
                        style={{
                            fontSize: "clamp(28px, 5vw, 40px)",
                            fontWeight: 800,
                            color: "#111827",
                            letterSpacing: "-0.03em",
                            lineHeight: 1.2,
                            marginBottom: 12,
                        }}
                    >
                        거북스쿨의 모든 앱을
                        <br />
                        한눈에 살펴보세요
                    </h1>
                    <p
                        style={{
                            fontSize: 16,
                            color: "#6b7280",
                            lineHeight: 1.6,
                            maxWidth: 520,
                        }}
                    >
                        성적 관리부터 입시 예측까지, 수험 생활에 필요한 모든 도구가 준비되어 있습니다.
                        각 앱을 클릭하면 자세한 소개를 볼 수 있어요.
                    </p>
                </motion.div>
            </section>

            {/* ═══════ Category Sections ═══════ */}
            <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 80px" }}>
                {showcaseCategories.map((category, ci) => {
                    const apps = appShowcaseData.filter(
                        (app) => app.category === category.id,
                    );
                    if (apps.length === 0) return null;

                    return (
                        <motion.section
                            key={category.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: ci * 0.08 }}
                            viewport={{ once: true, margin: "-50px" }}
                            style={{ marginBottom: 56 }}
                        >
                            {/* Category Header */}
                            <div style={{ marginBottom: 20 }}>
                                <h2
                                    style={{
                                        fontSize: 22,
                                        fontWeight: 700,
                                        color: "#111827",
                                        letterSpacing: "-0.02em",
                                        marginBottom: 4,
                                    }}
                                >
                                    {category.label}
                                </h2>
                                <p style={{ fontSize: 14, color: "#9ca3af" }}>
                                    {category.description}
                                </p>
                            </div>

                            {/* App Cards */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                    gap: 16,
                                }}
                            >
                                {apps.map((app, ai) => (
                                    <AppCard key={app.id} app={app} index={ai} />
                                ))}
                            </div>
                        </motion.section>
                    );
                })}
            </div>

            {/* ═══════ Bottom CTA ═══════ */}
            <section
                style={{
                    background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
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
                            fontSize: 24,
                            fontWeight: 700,
                            color: "#fff",
                            marginBottom: 8,
                        }}
                    >
                        지금 바로 시작하세요
                    </h2>
                    <p
                        style={{
                            fontSize: 15,
                            color: "rgba(255,255,255,0.7)",
                            marginBottom: 24,
                        }}
                    >
                        거북스쿨 계정 하나로 모든 앱을 이용할 수 있습니다.
                    </p>
                    <Link
                        to="/auth/login"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            height: 48,
                            padding: "0 32px",
                            borderRadius: 9999,
                            background: "#fff",
                            color: "#1e293b",
                            fontSize: 15,
                            fontWeight: 700,
                            textDecoration: "none",
                            transition: "transform 200ms ease, box-shadow 200ms ease",
                        }}
                        className="hover:shadow-lg hover:-translate-y-0.5"
                    >
                        회원가입 / 로그인
                        <ArrowRight style={{ width: 16, height: 16 }} />
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// 앱 카드 컴포넌트
// ═══════════════════════════════════════════════════════════════
function AppCard({ app, index }: { app: AppShowcaseItem; index: number }) {
    const Icon = app.lucideIcon;

    return (
        <Link
            to="/apps/$appId"
            params={{ appId: app.id }}
            style={{ textDecoration: "none" }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: 24,
                    border: "1px solid #f3f4f6",
                    cursor: "pointer",
                    transition: "all 250ms ease",
                    height: "100%",
                }}
                className="hover:shadow-md hover:-translate-y-1 transition-all"
            >
                {/* Icon + Title */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 14,
                    }}
                >
                    <div
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 14,
                            background: app.gradient,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            flexShrink: 0,
                        }}
                    >
                        <Icon style={{ width: 20, height: 20 }} />
                    </div>
                    <div>
                        <h3
                            style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: "#111827",
                                letterSpacing: "-0.01em",
                            }}
                        >
                            {app.title}
                        </h3>
                        <p
                            style={{ fontSize: 13, color: "#9ca3af", marginTop: 1 }}
                        >
                            {app.subtitle}
                        </p>
                    </div>
                </div>

                {/* Highlights */}
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {app.highlights.map((h, idx) => (
                        <li
                            key={idx}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                fontSize: 13,
                                color: "#6b7280",
                                padding: "4px 0",
                            }}
                        >
                            <span
                                style={{
                                    width: 5,
                                    height: 5,
                                    borderRadius: "50%",
                                    background: app.color,
                                    flexShrink: 0,
                                    opacity: 0.7,
                                }}
                            />
                            {h}
                        </li>
                    ))}
                </ul>

                {/* Target Users */}
                <div style={{ marginTop: 14, display: "flex", gap: 6 }}>
                    {app.targetUsers.map((user) => (
                        <span
                            key={user}
                            style={{
                                fontSize: 11,
                                fontWeight: 600,
                                padding: "3px 10px",
                                borderRadius: 9999,
                                background: `${app.color}12`,
                                color: app.color,
                            }}
                        >
                            {user}
                        </span>
                    ))}
                </div>

                {/* CTA */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 16,
                        fontSize: 13,
                        fontWeight: 600,
                        color: app.color,
                    }}
                >
                    자세히 보기 <ArrowRight style={{ width: 14, height: 14 }} />
                </div>
            </motion.div>
        </Link>
    );
}
