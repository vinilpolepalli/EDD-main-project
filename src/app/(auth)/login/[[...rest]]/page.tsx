import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <SignIn
      forceRedirectUrl="/dashboard"
      signUpUrl="/signup"
      appearance={{
        variables: {
          colorPrimary: "#16a34a",
          colorBackground: "#ffffff",
          colorInputBackground: "#f0fdf4",
          colorText: "#14532d",
          colorTextSecondary: "#166534",
          colorDanger: "#dc2626",
          borderRadius: "0.75rem",
          fontFamily: "var(--font-nunito), sans-serif",
          fontWeight: { bold: 700, normal: 400, medium: 600 },
        },
        elements: {
          card: "shadow-2xl border border-green-100",
          headerTitle: "text-green-900 font-extrabold",
          headerSubtitle: "text-green-700",
          socialButtonsBlockButton:
            "border-green-200 text-green-800 hover:bg-green-50",
          dividerLine: "bg-green-100",
          dividerText: "text-green-500",
          formFieldLabel: "text-green-800 font-semibold",
          formFieldInput:
            "border-green-200 focus:border-green-500 focus:ring-green-500",
          formButtonPrimary:
            "bg-green-600 hover:bg-green-700 text-white font-bold",
          footerActionLink: "text-green-600 hover:text-green-800 font-bold",
          footerActionText: "text-green-700",
          identityPreviewText: "text-green-800",
          identityPreviewEditButton: "text-green-600",
        },
      }}
    />
  );
}
