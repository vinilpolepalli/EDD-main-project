import { SignUp } from "@clerk/nextjs";
import { AuthSplitScreen } from "@/components/auth/auth-split-screen";

export default function SignupPage() {
  return (
    <AuthSplitScreen
      headline="Start your money quest."
      sub="Build real personal-finance instincts through quests, simulators, and mini-games. No credit card needed."
    >
      <div className="mb-8">
        <h1
          className="font-serif font-normal text-ink"
          style={{
            fontSize: "clamp(2rem, 4vw, 2.5rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          Create your account
        </h1>
        <p className="mt-3 font-sans text-[0.9375rem] text-muted">
          Free forever. Pick a plan later if you want more profiles.
        </p>
      </div>
      <SignUp
        forceRedirectUrl="/avatar"
        signInUrl="/login"
        appearance={{
          variables: {
            colorPrimary: "#2F7A5C",
            colorBackground: "#F5F4F0",
            colorInputBackground: "#FFFFFF",
            colorText: "#0A0A0A",
            colorTextSecondary: "#6B6B6B",
            colorDanger: "#B23A3A",
            borderRadius: "0.625rem",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontWeight: { bold: 500, normal: 400, medium: 500 },
          },
          elements: {
            rootBox: "w-full",
            card: "bg-transparent shadow-none border-0 p-0",
            header: "hidden",
            socialButtonsBlockButton:
              "border border-line bg-white text-ink hover:bg-paper-2",
            dividerLine: "bg-line",
            dividerText: "text-muted text-[0.75rem] uppercase tracking-[0.1em]",
            formFieldLabel:
              "text-ink font-sans text-[0.75rem] font-medium uppercase tracking-[0.1em]",
            formFieldInput:
              "border-line bg-white text-ink focus:border-accent focus:ring-1 focus:ring-accent",
            formButtonPrimary:
              "h-11 rounded-full bg-ink hover:bg-ink/90 text-white font-medium normal-case",
            footerActionLink: "text-accent hover:text-accent/80 font-medium",
            footerActionText: "text-muted",
          },
        }}
      />
    </AuthSplitScreen>
  );
}
