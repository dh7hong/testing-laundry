import React from "react";

type ItemProps = {
	icon: React.ReactNode;
	title: string;
	description: React.ReactNode;
	iconContainerStyle?: string;
};

const LaundryItem: React.FC<ItemProps> = ({
	icon,
	title,
	description,
	iconContainerStyle,
}) => {
	return (
		<div className="flex flex-col bg-white rounded-xl text-center w-full h-full p-4 items-center justify-center">
			<button className="flex flex-col items-center">
				<div
					className={iconContainerStyle}
					style={{ wordBreak: "keep-all" }}
				>
					{icon}
					<div className="h-[12px]"></div>
				</div>
				<h3
					className="text-headline-1 font-semibold mt-2 flex-shrink-0"
					style={{ wordBreak: "keep-all" }}
				>
					{title}
				</h3>
				<div
					className="text-label-alternative font-medium text-caption-1 whitespace-pre-line flex-shrink-0"
					style={{ wordBreak: "keep-all" }}
				>
					{description}
				</div>
			</button>
		</div>
	);
};

export default LaundryItem;
