import React, { useState } from "react";

const PopupInitial: React.FC = () => {
	const [showPopup, setShowPopup] = useState(true);

	return (
		<div className="relative ">
			{showPopup && (
				<div className="absolute bottom-[10px] w-[210px] bg-primary-normal text-white rounded-lg flex items-center justify-center text-label-1-normal font-normal z-10 px-[10px] py-[6px]">
					<div className="flex justify-center">
						<span>어떻게 이용하는지 알려드릴게요!</span>
					</div>
					
					<div className="absolute -bottom-[2px] left-[93%] w-[8px] h-[8px] bg-primary-normal transform rotate-45 z-0"></div>
				</div>
			)}
		</div>
	);
};

export default PopupInitial;