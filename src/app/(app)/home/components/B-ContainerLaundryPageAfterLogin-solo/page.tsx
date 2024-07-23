import DetailedLaundryPageSolo from "@/app/(app)/home/components/C-DetailedLaundryPageAfterLogin-solo/page";
import DetailedLaundryPageTeam from "@/app/(app)/home/components/C-DetailedLaundryPageAfterLogin-team/page";

import ChevronRightIconLarge from "@/assets/icons/others/chevron-right-large.svg";
import "@/app/global.css";

const ContainerActiveLaundryPage = () => {
	return (
		<div className="flex justify-center items-center bg-gray-50">
			<div className="w-full max-w-[430px] bg-white flex flex-col justify-center items-center">
				<div className="w-full max-w-[430px] mb-4">
					<div className="flex justify-between items-center">
						<div className="flex-1">
							<div className="flex items-center justify-between mt-[40px]">
								<h2 className="text-lg font-bold ml-[20px]">
									알뜰 세탁
								</h2>
								<button className="mr-[20px] flex-shrink-0">
									<ChevronRightIconLarge className="w-[20px] h-[20px]" />
								</button>
							</div>
							<p className="text-label-1-normal font-medium text-label-alternative ml-[20px]">
								배송은 같이 세탁은 따로
							</p>
						</div>
					</div>
				</div>
				<div className="flex overflow-x-auto w-full max-w-[430px] hide-scrollbar">
					<div className="flex-shrink-0 ml-[20px] w-[280px]">
						<DetailedLaundryPageSolo />
					</div>
					<div className="flex-shrink-0 ml-[32px] w-[280px]">
						<DetailedLaundryPageSolo />
					</div>
				</div>
				<div className="h-[40px] bg-white"></div>
			</div>
		</div>
	);
};

export default ContainerActiveLaundryPage;
