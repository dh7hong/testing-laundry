import React from "react";

import { CTAButtonProps } from "@/lib/types";

const CTAButtonMedium: React.FC<CTAButtonProps> = ({
	buttonWidth = "280px",
	buttonHeight = "52px",
	buttonColor,
	borderColor,
	borderThickness,
	borderRadius = "8px",
	buttonText,
	buttonTextSize = "16px",
	buttonTextWeight = 600,
	buttonTextColor,
	disabled = false,
	onClick
}) => {
	const buttonStyles = {
		width: buttonWidth,
		height: buttonHeight,
		backgroundColor: buttonColor,
		borderColor: borderColor,
		borderWidth: borderThickness,
		borderRadius: borderRadius,
		fontSize: buttonTextSize,
		fontWeight: buttonTextWeight,
		color: buttonTextColor,
	};

	return (
		<button
			className={`flex justify-center items-center font-semibold rounded-md transition-colors duration-300 ${
				disabled ? "cursor-not-allowed" : "cursor-pointer"
			}`}
			style={buttonStyles}
			disabled={disabled}
			onClick={onClick} // Attach the onClick directly here
		>
			{buttonText}
		</button>
	);
};

export default CTAButtonMedium;
