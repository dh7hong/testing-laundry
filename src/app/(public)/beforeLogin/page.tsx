// src/pages/index.tsx
import React from "react";
import MainView from "@/app/(public)/beforeLogin/components/A-MainViewBeforeLogin/page";
import ContainerInactiveLaundryPageSolo from "@/app/(public)/beforeLogin/components/B-ContainerLaundryPageBeforeLogin-solo/page";
import ContainerInactiveLaundryPageTeam from "@/app/(public)/beforeLogin/components/B-ContainerLaundryPageBeforeLogin-team/page";
import AppFooter from "@/app/(public)/beforeLogin/components/F-Footer/page";
import ContainerReviewPage from "@/app/(public)/beforeLogin/components/D-ContainerReviewBeforeLogin/page";

export default function BeforeLoginHomePage() {
	return (
		<div>
			<MainView />
			<ContainerInactiveLaundryPageSolo />
			<ContainerInactiveLaundryPageTeam />
			<ContainerReviewPage />
			<AppFooter />
		</div>
	);
}
