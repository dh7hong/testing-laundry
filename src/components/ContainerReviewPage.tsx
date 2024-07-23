import ChevronRightIcon from "@/assets/icons/main/chevron-right.svg";
import ReviewPage from "@/app/(public)/beforeLogin/components/E-ReviewPageBeforeLogin/page";

const ContainerReviewPage = () => {
	return (
		<>
			<div className="flex justify-center items-center bg-gray-50">
				<div className="w-[390px] bg-white flex flex-col justify-center items-center mb-[30px]">
					<div className="w-[390px] mb-4">
						<div className="flex justify-between items-center">
							<div className="flex-1">
								<div className="flex items-center justify-between mt-5">
									<h2 className="text-lg font-bold ml-[20px]">
										사용자들의 내돈내산 후기
									</h2>
									<span className="mr-[20px] flex-shrink-0">
										<ChevronRightIcon className="w-[20px] h-[20px]" />
									</span>
								</div>
								<p className="text-sm text-gray-600 ml-[20px]">
									리뷰는 결제 내역이 있는 실제 사용자들만 남길 수
									있어요!
								</p>
							</div>
						</div>
					</div>
					<div className="flex justify-center">
						<div className="w-[350px]">
							<div className="flex">
								<ReviewPage />
							</div>
						</div>
					</div>
					<div className="h-[74px] bg-white"></div>
				</div>
			</div>
		</>
	);
};

export default ContainerReviewPage;
