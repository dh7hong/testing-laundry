export const formatPhoneNumber = (
	phoneNumber: string
): string => {
	const cleaned = phoneNumber.replace(/\D/g, "");
	if (cleaned.startsWith("010")) {
		return `+82${cleaned.slice(1)}`;
	}
	if (cleaned.startsWith("82")) {
		return `+${cleaned}`;
	}
	return `+82${cleaned}`;
};
