import InactiveLaundryPage from "@/app/(public)/beforeLogin/components/C-DetailedLaundryPageBeforeLogin-team/page";
import ChevronRightIconLarge from "@/assets/icons/others/chevron-right-large.svg";

const ContainerActiveLaundryPage = () => {
	return (
		<div className="flex justify-center items-center bg-gray-50">
			<div className="w-full max-w-[430px] bg-white flex flex-col justify-center items-center">
				<div className="w-full max-w-[430px] mb-4">
					<div className="flex justify-between items-center">
						<div className="flex-1">
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-bold ml-[20px]">
									팀 세탁
								</h2>
								<button className="mr-[20px] flex-shrink-0">
									<ChevronRightIconLarge className="w-[20px] h-[20px]" />
								</button>
							</div>
							<p className="text-label-1-normal font-medium text-label-alternative ml-[20px]">
								배송도 세탁도 같이
							</p>
						</div>
					</div>
				</div>
				<div className="flex overflow-x-auto w-full max-w-[430px] hide-scrollbar">
					<div className="flex-shrink-0 ml-[20px] w-[280px]">
						<InactiveLaundryPage />
					</div>
					<div className="flex-shrink-0 ml-[32px] w-[280px]">
						<InactiveLaundryPage />
					</div>
				</div>
				<div className="h-[40px] bg-white"></div>
			</div>
		</div>
	);
};

export default ContainerActiveLaundryPage;
