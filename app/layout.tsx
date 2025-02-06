import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import "./dashboard/familyprofile/css/familyprofile.css"
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const jost = Jost({
	subsets: ["latin"],
	weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
	metadataBase: new URL("https://pbcensus.vercel.app/"),

	title: {
		template: "%s | PB Census",
		default: "PB Census",
	},
	authors: {
		name: "JAZCode & SeekerDev",
	},
	description:
		"Pulong Bunhangin Census Application.",
	openGraph: {
		title: "PB Census",
		description: "A census for Pulong Buhangin Sta. Maria",
		url: "https://pbcensus.vercel.app/",
		siteName: "Daily Todo",
		images: "/og.png",
		type: "website",
	},
	keywords: ["census", "pulong buhangin census", "pbcensus"],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${jost.className} antialiased dark:bg-[#09090B]`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<main className="w-screen h-screen">{children}</main>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
